import { NextResponse } from "next/server";
import getScreenShotUrl from "../../utilites/getScreenShotUrl";
import prisma from "../../utilites/prisma";

// Function to fetch paginated data
async function getPaginatedData(page, selectedWallet) {
  const itemsPerPage = 10;
  const offset = (parseInt(page, 10) - 1) * itemsPerPage;

  // Get current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  try {
    const rows = await prisma.transactions.findMany({
      where: {
        FormStatus: {
          some: {
            TransactionStatusID: 1,
          },
        },
        Wallet: {
          WalletName: selectedWallet,
        },
        TransactionDate: {
          gte: firstDayOfMonth,
          lt: firstDayOfNextMonth,
        },
      },
      include: {
        Customer: {
          select: {
            Name: true,
          },
        },
        Wallet: {
          select: {
            Currency: {
              select: {
                CurrencyCode: true,
              },
            },
          },
        },
        Screenshot: {
          select: {
            ScreenShotLink: true,
          },
        },
      },
      orderBy: {
        TransactionDate: "asc",
      },
      skip: offset,
      take: itemsPerPage,
    });

    // Map it to match your expected structure
    const formattedRows = rows.map((row) => ({
      CurrencyCode: row.Wallet?.Currency?.CurrencyCode || null,
      CustomerName: row.Customer?.Name || null,
      HopeFuelID: row.HopeFuelID || null,
      ScreenShotLinks: row.ScreenShot?.map((s) => s.ScreenShotLink) || [],
    }));
    return formattedRows;
  } catch (error) {
    console.error("Error fetching paginated data:", error);
    throw new Error("Error fetching paginated data");
  }
}

// Function to search by HopeFuelID
async function searchByHopeFuelID(HopeFuelID) {
  try {
    const row = await prisma.Transactions.findFirst({
      where: {
        HopeFuelID: HopeFuelID,
      },
      include: {
        Customer: {
          select: {
            Name: true,
          },
        },
        Wallet: {
          select: {
            Currency: {
              select: {
                CurrencyCode: true,
              },
            },
          },
        },
        Screenshot: {
          select: {
            ScreenShotLink: true,
          },
        },
      },
    });

    if (!row) {
      return [];
    }

    const formattedRow = {
      CurrencyCode: row.Wallet.Currency.CurrencyCode,
      CustomerName: row.Customer.Name,
      HopeFuelID: row.HopeFuelID,
      ScreenShotLinks: row.Screenshot.map((s) => s.ScreenShotLink),
    };

    return [formattedRow];
  } catch (error) {
    console.error("Error fetching search data:", error);
    throw new Error("Error fetching search data");
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const HopeFuelID = searchParams.get("HopeFuelID");
  const page = parseInt(searchParams.get("page"), 10) || 1;
  const selectedWallet = searchParams.get("wallet") || " ";

  try {
    let data;
    if (HopeFuelID) {
      const id = parseInt(HopeFuelID, 10);
      data = await searchByHopeFuelID(id);
    } else {
      data = await getPaginatedData(page, selectedWallet);
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
