// import { NextResponse } from "next/server";

// import db from "../../../utilites/db";

// async function retrieveCurrentMonthHopeFuelCards(page, limit, filters = {}) {
//   const { q, statusId, currency, agentId } = filters;
//   const offset = (page - 1) * limit;

//   // Base WHERE (current month)
//   const whereParts = [
//     `t.TransactionDate >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
//     `t.TransactionDate < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)`,
//   ];
//   const whereParams = [];

//   // Optional text search (same fields used in your prior search API)
//   if (q && q.trim()) {
//     const like = `%${q.trim()}%`;
//     whereParts.push(`(
//       t.HopeFuelID LIKE ? OR
//       c.Name LIKE ? OR
//       c.Email LIKE ? OR
//       c.CardID LIKE ? OR
//       t.TransactionDate LIKE ? OR
//       t.Amount LIKE ? OR
//       curr.CurrencyCode LIKE ? OR
//       t.Month LIKE ? OR
//       ss.ScreenShotLink LIKE ? OR
//       c.ManyChatId LIKE ? OR
//       a.AwsId LIKE ? OR
//       ts.TransactionStatus LIKE ? OR
//       n.Note LIKE ? OR
//       bc.BaseCountryName LIKE ?
//     )`);
//     whereParams.push(
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like,
//       like
//     );
//   }

//   // Optional filters
//   if (statusId) {
//     whereParts.push(`current_fs.TransactionStatusID = ?`);
//     whereParams.push(Number(statusId));
//   }
//   if (currency) {
//     whereParts.push(`curr.CurrencyCode = ?`);
//     whereParams.push(String(currency));
//   }
//   if (agentId) {
//     // First form-filling agent (matches your ta/a join)
//     whereParts.push(`a.Username = ?`);
//     whereParams.push(Number(agentId));
//   }

//   const whereSQL = `WHERE ${whereParts.join(" AND ")}`;

//   const countQuery = `
//     SELECT COUNT(*) AS total
//     FROM (
//       SELECT DISTINCT t.TransactionID
//       FROM Transactions t
//       LEFT JOIN Customer c    ON t.CustomerID = c.CustomerId
//       LEFT JOIN BaseCountry bc ON c.UserCountryID = bc.BaseCountryID
//       LEFT JOIN Wallet w      ON t.WalletID   = w.WalletId
//       LEFT JOIN Currency curr ON w.CurrencyId = curr.CurrencyId
//       LEFT JOIN Note n        ON t.NoteID     = n.NoteID
//       LEFT JOIN ScreenShot ss ON t.TransactionID = ss.TransactionID
//       LEFT JOIN (
//         SELECT ta1.TransactionID, ta1.AgentID
//         FROM TransactionAgent ta1
//         INNER JOIN (
//           SELECT TransactionID, MIN(TransactionAgentID) AS FirstTAID
//           FROM TransactionAgent
//           GROUP BY TransactionID
//         ) first_ta ON ta1.TransactionID = first_ta.TransactionID
//                    AND ta1.TransactionAgentID = first_ta.FirstTAID
//       ) ta ON t.TransactionID = ta.TransactionID
//       LEFT JOIN Agent a ON ta.AgentID = a.AgentID
//       LEFT JOIN (
//         SELECT fs.TransactionID, fs.TransactionStatusID, fs.FormStatusID
//         FROM FormStatus fs
//         INNER JOIN (
//           SELECT TransactionID, MAX(FormStatusID) AS LatestFormStatusID
//           FROM FormStatus
//           GROUP BY TransactionID
//         ) latest_fs ON fs.FormStatusID = latest_fs.LatestFormStatusID
//       ) current_fs ON t.TransactionID = current_fs.TransactionID
//       LEFT JOIN TransactionStatus ts ON current_fs.TransactionStatusID = ts.TransactionStatusID
//       ${whereSQL}
//     ) x;
//   `;

//   const dataQuery = `
//     SELECT
//       c.Name,
//       c.Email,
//       c.CardID,
//       c.ManyChatId,
//       c.UserCountryID,
//       bc.BaseCountryName AS UserCountryName,
//       t.HopeFuelID,
//       t.TransactionDate,
//       t.Amount,
//       t.Month,
//       curr.CurrencyCode,
//       GROUP_CONCAT(DISTINCT ss.ScreenShotLink SEPARATOR ',') AS ScreenShot,
//       MAX(a.Username) AS FormFilledPerson,
//       ts.TransactionStatus,
//       ts.TransactionStatusID,
//       current_fs.FormStatusID,
//       n.Note AS Note
//     FROM Transactions t
//     LEFT JOIN Customer c    ON t.CustomerID = c.CustomerId
//     LEFT JOIN BaseCountry bc ON c.UserCountryID = bc.BaseCountryID
//     LEFT JOIN Wallet w      ON t.WalletID   = w.WalletId
//     LEFT JOIN Currency curr ON w.CurrencyId = curr.CurrencyId
//     LEFT JOIN Note n        ON t.NoteID     = n.NoteID
//     LEFT JOIN ScreenShot ss ON t.TransactionID = ss.TransactionID
//     LEFT JOIN (
//       SELECT ta1.TransactionID, ta1.AgentID
//       FROM TransactionAgent ta1
//       INNER JOIN (
//         SELECT TransactionID, MIN(TransactionAgentID) AS FirstTAID
//         FROM TransactionAgent
//         GROUP BY TransactionID
//       ) first_ta ON ta1.TransactionID = first_ta.TransactionID
//                  AND ta1.TransactionAgentID = first_ta.FirstTAID
//     ) ta ON t.TransactionID = ta.TransactionID
//     LEFT JOIN Agent a ON ta.AgentID = a.AgentID
//     LEFT JOIN (
//       SELECT fs.TransactionID, fs.TransactionStatusID, fs.FormStatusID
//       FROM FormStatus fs
//       INNER JOIN (
//         SELECT TransactionID, MAX(FormStatusID) AS LatestFormStatusID
//         FROM FormStatus
//         GROUP BY TransactionID
//       ) latest_fs ON fs.FormStatusID = latest_fs.LatestFormStatusID
//     ) current_fs ON t.TransactionID = current_fs.TransactionID
//     LEFT JOIN TransactionStatus ts ON current_fs.TransactionStatusID = ts.TransactionStatusID
//     ${whereSQL}
//     GROUP BY
//       t.TransactionID, t.HopeFuelID,
//       c.Name, c.Email, c.CardID, c.ManyChatId, c.UserCountryID, bc.BaseCountryName,
//       t.TransactionDate, t.Amount, curr.CurrencyCode, t.Month,
//       ts.TransactionStatus, ts.TransactionStatusID, current_fs.FormStatusID,
//       n.Note
//     ORDER BY t.HopeFuelID DESC
//     LIMIT ? OFFSET ?;
//   `;

//   const [{ total }] = await db(countQuery, whereParams);
//   const rows = await db(dataQuery, [...whereParams, limit, offset]);

//   const result = rows.map((row) => ({
//     ...row,
//     ScreenShot:
//       typeof row.ScreenShot === "string" && row.ScreenShot
//         ? row.ScreenShot.split(",")
//         : [],
//   }));

//   return { result, total: Number(total) || 0 };
// }
// export async function GET(req) {
//   const url = new URL(req.url);
//   const p = url.searchParams;

//   const page = Number(p.get("page")) || 1;
//   const limit = Number(p.get("limit")) || 10;

//   // Single endpoint handles all:
//   const q = p.get("q") || ""; // optional search text
//   const statusId = p.get("statusId") || null; // 1..4
//   const currency = p.get("currency") || null; // e.g. "USD"
//   const agentId = p.get("agentId") || null; // numeric AgentID

//   try {
//     const { result, total } = await retrieveCurrentMonthHopeFuelCards(
//       page,
//       limit,
//       {
//         q,
//         statusId,
//         currency,
//         agentId,
//       }
//     );

//     return NextResponse.json(
//       { page, limit, total, data: result },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Items API Error:", error);
//     return NextResponse.json(
//       { error: "Error in retrieving data from the database." },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

function getCurrentMonthBounds() {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
  );
  const nextMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0)
  );
  return { start, nextMonth };
}

function buildWhere({ q, statusId, currency, formFillPerson, userCountryId }) {
  const { start, nextMonth } = getCurrentMonthBounds();

  const where = {
    TransactionDate: { gte: start, lt: nextMonth },
  };

  const or = [];
  if (q && q.trim()) {
    const like = q.trim();

    // numeric guesses
    const asNum = Number(like);
    if (Number.isFinite(asNum)) {
      or.push({ HopeFuelID: asNum });
      or.push({ Month: asNum });
      or.push({ Customer: { is: { CardID: asNum } } });
      // Amount can be float
      or.push({ Amount: asNum });
    }

    // string contains across relations  (NO `mode` for MySQL!)
    or.push(
      { Customer: { is: { Name: { contains: like } } } },
      { Customer: { is: { Email: { contains: like } } } },
      { Customer: { is: { ManyChatId: { contains: like } } } },

      // Wallet -> Currency
      {
        Wallet: {
          is: { Currency: { is: { CurrencyCode: { contains: like } } } },
        },
      },

      // Screenshots (1..many)
      { Screenshot: { some: { ScreenShotLink: { contains: like } } } },

      // Agents (1..many -> 1)
      {
        TransactionAgent: {
          some: { Agent: { is: { AwsId: { contains: like } } } },
        },
      },

      // Form statuses (1..many -> 1)
      {
        FormStatus: {
          some: {
            TransactionStatus: {
              is: { TransactionStatus: { contains: like } },
            },
          },
        },
      },

      // Note (1..1)
      { Note: { is: { Note: { contains: like } } } },

      // Country name via Customer -> BaseCountry (1..1)
      {
        Customer: {
          is: { BaseCountry: { is: { BaseCountryName: { contains: like } } } },
        },
      }
    );
  }
  if (or.length) where.OR = or;

  // structured filters
  if (statusId) {
    where.FormStatus = { some: { TransactionStatusID: Number(statusId) } };
  }
  if (currency) {
    where.Wallet = {
      is: { Currency: { is: { CurrencyCode: { equals: String(currency) } } } },
    };
  }
  if (formFillPerson) {
    where.TransactionAgent = {
      some: { Agent: { is: { Username: { equals: String(formFillPerson) } } } },
    };
  }
  if (userCountryId) {
    where.Customer = { is: { UserCountry: Number(userCountryId) } };
  }

  return where;
}

// Map one row to response shape
function mapRow(t) {
  const latestFS = (t.FormStatus && t.FormStatus[0]) || null;
  const txnStatusText = latestFS?.TransactionStatus?.TransactionStatus || null;
  const txnStatusId = latestFS?.TransactionStatusID || null;
  const formStatusId = latestFS?.FormStatusID || null;

  const firstTA = (t.TransactionAgent && t.TransactionAgent[0]) || null;
  const formFilledPerson = firstTA?.Agent?.Username || null;

  const screenShot = (t.Screenshot || [])
    .map((s) => s.ScreenShotLink)
    .filter(Boolean);

  return {
    Name: t.Customer?.Name || null,
    Email: t.Customer?.Email || null,
    CardID: t.Customer?.CardID || null,
    ManyChatId: t.Customer?.ManyChatId || null,

    UserCountryID: t.Customer?.UserCountry ?? null,
    UserCountryName: t.Customer?.BaseCountry?.BaseCountryName || null,

    HopeFuelID: t.HopeFuelID ?? null,
    TransactionDate: t.TransactionDate,
    Amount: t.Amount ?? null,
    Month: t.Month ?? null,

    CurrencyCode: t.Wallet?.Currency?.CurrencyCode || null,
    WalletName: t.Wallet?.WalletName || null,

    ScreenShot: screenShot,
    FormFilledPerson: formFilledPerson,

    TransactionStatus: txnStatusText,
    TransactionStatusID: txnStatusId,
    FormStatusID: formStatusId,

    Note: t.Note?.Note || null,
  };
}

// optional dropdown meta from same endpoint
async function getMeta() {
  const [currencies, persons, countries] = await Promise.all([
    prisma.currency.findMany({
      where: { CurrencyCode: { not: null } },
      distinct: ["CurrencyCode"],
      select: { CurrencyCode: true },
      orderBy: { CurrencyCode: "asc" },
    }),
    prisma.agent.findMany({
      where: { Username: { not: null } },
      distinct: ["Username"],
      select: { Username: true },
      orderBy: { Username: "asc" },
    }),
    prisma.baseCountry.findMany({
      select: { BaseCountryID: true, BaseCountryName: true },
      orderBy: { BaseCountryName: "asc" },
    }),
  ]);

  return {
    currencies: currencies.map((c) => c.CurrencyCode),
    formFillPersons: persons.map((p) => p.Username),
    countries: countries.map((c) => ({
      id: c.BaseCountryID,
      name: c.BaseCountryName,
    })),
  };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const page = Math.max(1, Number(p.get("page")) || 1);
    const limit = Math.max(1, Number(p.get("limit")) || 10);

    const q = p.get("q") || "";
    const statusId = p.get("statusId") || null;
    const currency = p.get("currency") || null;
    const formFillPerson = p.get("formFillPerson") || null;
    const userCountryId = p.get("userCountryId") || null;
    const includeMeta = p.get("includeMeta") === "1";

    const where = buildWhere({
      q,
      statusId,
      currency,
      formFillPerson,
      userCountryId,
    });

    const total = await prisma.transactions.count({ where });

    const rows = await prisma.transactions.findMany({
      where,
      orderBy: [{ HopeFuelID: "desc" }, { TransactionID: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        Customer: {
          select: {
            Name: true,
            Email: true,
            CardID: true,
            ManyChatId: true,
            UserCountry: true,
            BaseCountry: { select: { BaseCountryName: true } },
          },
        },
        Wallet: {
          select: {
            WalletName: true,
            Currency: { select: { CurrencyCode: true } },
          },
        },
        Note: { select: { Note: true } },
        Screenshot: { select: { ScreenShotLink: true } },
        TransactionAgent: {
          orderBy: [{ LogDate: "asc" }, { TransactionAgentID: "asc" }],
          take: 1,
          select: { Agent: { select: { Username: true } } },
        },
        FormStatus: {
          orderBy: { FormStatusID: "desc" },
          take: 1,
          select: {
            FormStatusID: true,
            TransactionStatusID: true,
            TransactionStatus: { select: { TransactionStatus: true } },
          },
        },
      },
    });

    const data = rows.map(mapRow);
    const meta = includeMeta ? await getMeta() : null;

    return NextResponse.json(
      { page, limit, total, data, meta },
      { status: 200 }
    );
  } catch (err) {
    console.error("Items API Error (Prisma):", err);
    return NextResponse.json(
      { error: "Error in retrieving data from the database." },
      { status: 500 }
    );
  }
}
