import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

async function retrieveHopeFuelList(hopeFuelId) {
  const where = {};

  if (hopeFuelId) {
    where.HopeFuelID = parseInt(hopeFuelId);
  }

  const transactions = await prisma.Transactions.findMany({
    where,
    orderBy: {
      HopeFuelID: "desc",
    },
    include: {
      Customer: {
        include: {
          BaseCountry: true,
        },
      },
      SupportRegion: true,
      Wallet: {
        include: {
          Currency: true,
        },
      },
      Note: true,
      TransactionAgent: {
        include: {
          Agent: true,
        },
      },
      FormStatus: {
        orderBy: {
          FormStatusID: "desc",
        },
        take: 1,
        include: {
          TransactionStatus: true,
        },
      },
    },
  });

  return transactions.map((t) => ({
    HopeFuelID: t.HopeFuelID,
    Name: t.Customer?.Name || null,
    Email: t.Customer?.Email || null,
    CardID: t.Customer?.CardID || null,
    UserCountry: t.Customer?.BaseCountry?.BaseCountryName || null,
    Region: t.SupportRegion?.Region || null,
    TransactionDate: t.TransactionDate,
    PaymentCheckTime: t.PaymentCheckTime,
    Amount: t.Amount,
    CurrencyCode: t.Wallet?.Currency?.CurrencyCode || null,
    Month: t.Month,
    ManyChatId: t.Customer?.ManyChatId || null,
    FormFilledPerson: t.TransactionAgent.map((ta) => ta.Agent?.AwsId).filter(
      Boolean
    ),
    TransactionStatus:
      t.FormStatus[0]?.TransactionStatus?.TransactionStatus || null,
    Note: t.Note?.Note || null,
  }));
}

export async function GET(req, { params }) {
  try {
    const hopeFuelId = params.id;

    const result = await retrieveHopeFuelList(hopeFuelId);
    return NextResponse.json({
      status: 200,
      message: "Hopefuel transaction retrieved successfully.",
      hopeFuelId: hopeFuelId || null,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
