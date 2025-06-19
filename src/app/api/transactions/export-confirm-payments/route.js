import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";
import dayjs from "dayjs";

async function retrieveHopeFuelList(
  startDate,
  endDate,
  transactionStatus,
  page = 1,
  limit = 10
) {
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
    const firstDay = dayjs().startOf("month").toDate();
    const firstDayNextMonth = dayjs().add(1, "month").startOf("month").toDate();
    where.TransactionDate.gte = firstDay;
    where.TransactionDate.lt = firstDayNextMonth;
  }

  if (transactionStatus) {
    const status = await prisma.TransactionStatus.findFirst({
      where: {
        TransactionStatus: transactionStatus,
      },
      select: {
        TransactionStatusID: true,
      },
    });

    if (!status) {
      throw new Error("Transaction status not found.");
    }

    where.FormStatus = {
      some: {
        TransactionStatus: {
          TransactionStatusID: status.TransactionStatusID,
        },
      },
    };
  } else {
    where.FormStatus = {
      some: {
        TransactionStatus: {
          TransactionStatusID: 2,
        },
      },
    };
  }

  const skip = (page - 1) * limit;

  const totalCount = await prisma.Transactions.count({
    where,
  });

  const transactions = await prisma.Transactions.findMany({
    where,
    orderBy: {
      HopeFuelID: "desc",
    },
    skip: skip,
    take: limit,
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

  const mappedTransactions = transactions.map((t) => ({
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

  return {
    data: mappedTransactions,
    totalCount: totalCount,
  };
}

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;

  let startDate = null;
  let endDate = null;

  const startDateParam = params.get("startDate");
  if (startDateParam) {
    startDate = dayjs(startDateParam).isValid() ? startDateParam : null;
  }
  const endDateParam = params.get("endDate");
  if (endDateParam) {
    endDate = dayjs(endDateParam).isValid() ? endDateParam : null;
  }
  const transactionStatus = params.get("transactionStatus") || null;

  const pageParam = params.get("page");
  const limitParam = params.get("limit");

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const limit = limitParam
    ? Math.max(1, Math.min(100, parseInt(limitParam, 10)))
    : 10;

  try {
    const result = await retrieveHopeFuelList(
      startDate,
      endDate,
      transactionStatus,
      page,
      limit
    );
    console.log("Result:", JSON.stringify(result, null, 2));
    return NextResponse.json({
      status: 200,
      message: "Hopefuel list retrieve successfully.",
      startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      transactionStatus,
      totalCount: result.totalCount,
      data: result.data,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
