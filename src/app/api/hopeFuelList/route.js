import { NextResponse } from "next/server";
import prisma from "../../utilites/prisma";

// Helper: default to current month if no dates provided
function getDateRange(fromDate, toDate) {
  if (fromDate && toDate)
    return { gte: new Date(fromDate), lt: new Date(toDate) };
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { gte: first, lt: nextMonth };
}

// Parse "status" as either ID (number) or name (string)
function statusFilter(status) {
  if (!status || status === "all") return undefined;
  const asNum = Number(status);
  if (!Number.isNaN(asNum)) {
    return { TransactionStatusID: asNum }; // by ID
  }
  return { TransactionStatus: { TransactionStatus: status } };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const pageSize = Math.max(
      1,
      Math.min(100, Number(url.searchParams.get("pageSize")) || 9)
    );

    const fromDate = url.searchParams.get("fromDate");
    const toDate = url.searchParams.get("toDate");
    const status = url.searchParams.get("status");
    const name = url.searchParams.get("name");
    const email = url.searchParams.get("email");
    const hopefuelID = url.searchParams.get("hopefuelID");
    const cardID = url.searchParams.get("cardID");

    const dateRange = getDateRange(fromDate, toDate);

    // 1) Base TransactionID list (date/name/email/hopefuel/cardID filters only), ORDERED
    const base = await prisma.transactions.findMany({
      where: {
        TransactionDate: dateRange,
        ...(hopefuelID
          ? {
              HopeFuelID: {
                equals: isNaN(Number(hopefuelID))
                  ? hopefuelID
                  : Number(hopefuelID),
              },
            }
          : {}),
        Customer: {
          ...(name ? { Name: { contains: name } } : {}),
          ...(email ? { Email: { contains: email } } : {}),
          ...(cardID ? { CardID: { equals: Number(cardID) } } : {}),
        },
      },
      select: { TransactionID: true, HopeFuelID: true },
      orderBy: { HopeFuelID: "desc" },
    });

    // Keep the base order (by HopeFuelID desc)
    const baseIdsOrdered = base.map((b) => b.TransactionID);

    // 2) If a status filter is present, reduce to only those whose LATEST FormStatus matches
    let filteredIdsOrdered = baseIdsOrdered;

    const statusWhere = statusFilter(status); // e.g. { TransactionStatusID: 3 } or { TransactionStatus: { TransactionStatus: '...' } }
    if (statusWhere) {
      // 2a) Find latest FormStatusID per TransactionID in the base set
      const latestByTx = await prisma.formStatus.groupBy({
        by: ["TransactionID"],
        where: { TransactionID: { in: baseIdsOrdered } },
        _max: { FormStatusID: true },
      });

      const latestIds = latestByTx
        .map((x) => x._max.FormStatusID)
        .filter(Boolean);

      if (latestIds.length) {
        // 2b) Load those "latest" rows to inspect their status
        const latestRows = await prisma.formStatus.findMany({
          where: { FormStatusID: { in: latestIds } },
          include: { TransactionStatus: true },
        });

        // 2c) Build a set of TransactionIDs whose latest status matches
        const okTxIds = new Set(
          latestRows
            .filter((fs) => {
              if ("TransactionStatusID" in statusWhere) {
                return (
                  fs.TransactionStatusID === statusWhere.TransactionStatusID
                );
              }
              if (statusWhere.TransactionStatus?.TransactionStatus) {
                return (
                  fs.TransactionStatus?.TransactionStatus?.toLowerCase() ===
                  statusWhere.TransactionStatus.TransactionStatus.toLowerCase()
                );
              }
              return true;
            })
            .map((fs) => fs.TransactionID)
        );

        // 2d) Preserve original order while filtering
        filteredIdsOrdered = baseIdsOrdered.filter((id) => okTxIds.has(id));
      } else {
        filteredIdsOrdered = [];
      }
    }

    // 3) Pagination **after** status filtering
    const total = filteredIdsOrdered.length;
    const start = (page - 1) * pageSize;
    const pagedIds = filteredIdsOrdered.slice(start, start + pageSize);

    // 4) Fetch final rows for the page
    const rows = pagedIds.length
      ? await prisma.transactions.findMany({
          where: { TransactionID: { in: pagedIds } },
          // ensure consistent ordering: HopeFuelID desc; Prisma may reorder by IN-list,
          // so we can re-sort client-side after mapping (shown below).
          include: {
            Customer: true,
            SupportRegion: {
              select: { Region: true },
            },
            Wallet: { include: { Currency: true } },
            Note: true,
            Screenshot: true,
            TransactionAgent: {
              orderBy: { TransactionAgentID: "asc" },
              take: 1,
              include: { Agent: true },
            },
            FormStatus: {
              orderBy: { FormStatusID: "desc" },
              take: 1,
              include: { TransactionStatus: true },
            },
          },
        })
      : [];

    // 5) (Optional) re-sort the result by HopeFuelID desc to match your base order
    rows.sort((a, b) => b.HopeFuelID - a.HopeFuelID);

    // 6) Map to response shape (unchanged)
    const data = rows.map((transaction) => {
      const customer = transaction.Customer || {};
      const currency = transaction.Wallet?.Currency || {};
      const latestFs = transaction.FormStatus?.[0];
      const firstAgent = transaction.TransactionAgent?.[0];
      const screenshots = (transaction.Screenshot || [])
        .map((s) => s.ScreenShotLink)
        .filter(Boolean);

      return {
        Name: customer.Name ?? null,
        Email: customer.Email ?? null,
        CardID: customer.CardID ?? null,
        ManyChatId: customer.ManyChatId ?? null,
        HopeFuelID: transaction.HopeFuelID,
        TransactionDate: transaction.TransactionDate,
        Amount: transaction.Amount,
        Month: transaction.Month,
        CurrencyCode: currency.CurrencyCode ?? null,
        ScreenShot: screenshots,
        FormFilledPerson: firstAgent?.Agent?.Username ?? null,
        TransactionStatus:
          latestFs?.TransactionStatus?.TransactionStatus ?? null,
        TransactionStatusID: latestFs?.TransactionStatusID ?? null,
        FormStatusID: latestFs?.FormStatusID ?? null,
        Note: transaction.Note?.Note ?? null,
        SupportRegion: transaction.SupportRegion?.Region ?? null,
      };
    });

    // 7) Return correct total (count of filtered IDs)
    return NextResponse.json({ page, pageSize, total, data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
