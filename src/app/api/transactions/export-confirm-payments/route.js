import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";
import moment from "moment-timezone";

async function retrieveHopeFuelList(startDate, endDate, transactionStatus) {
  const where = {
    TransactionDate: {},
  };

  const whereTransactionStatus = {
    TransactionStatus: {
      TransactionStatusID: {},
    },
  };

  if (startDate) {
    where.TransactionDate.gte = new Date(startDate);
  }

  if (endDate) {
    where.TransactionDate.lte = new Date(endDate);
  }

  if (!startDate && !endDate) {
    const firstDay = moment().startOf("month").toDate();
    const firstDayNextMonth = moment()
      .add(1, "month")
      .startOf("month")
      .toDate();
    where.TransactionDate.gte = firstDay;
    where.TransactionDate.lt = firstDayNextMonth;
  }

  if (transactionStatus) {
    const transactionStatusId = await prisma.TransactionStatus.findFirst({
      where: {
        TransactionStatus: transactionStatus,
      },
      select: {
        TransactionStatusID: true,
      },
    });

    if (!transactionStatusId) {
      throw new Error("Transaction status not found.");
    }

    whereTransactionStatus.TransactionStatus.TransactionStatusID.equals =
      transactionStatusId.TransactionStatusID;
  }

  if (transactionStatus) {
    where.FormStatus = {
      some: whereTransactionStatus,
    };
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
    TransactionID: t.TransactionID,
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

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
  let startDate = null;
  let endDate = null;
  const startDateParam = params.get("startDate");
  if (startDateParam) {
    startDate = moment(startDateParam).isValid() ? startDateParam : null;
  }
  const endDateParam = params.get("endDate");
  if (endDateParam) {
    endDate = moment(endDateParam).isValid() ? endDateParam : null;
  }
  const transactionStatus = params.get("transactionStatus") || null;
  try {
    const result = await retrieveHopeFuelList(
      startDate,
      endDate,
      transactionStatus
    );
    return NextResponse.json({
      status: 200,
      message: "Hopefuel list retrieve successfully.",
      startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
      endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
      transactionStatus,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
