import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

async function getTransactionsByCustomerID(customerId) {
  const transactions = await prisma.Transactions.findMany({
    where: {
      CustomerID: parseInt(customerId),
    },
    orderBy: {
      TransactionDate: "desc",
    },
    include: {
      Wallet: {
        include: {
          Currency: true,
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
    Amount: t.Amount,
    CurrencyCode: t.Wallet?.Currency?.CurrencyCode || null,
    TransactionDate: t.TransactionDate,
    TransactionStatus:
      t.FormStatus[0]?.TransactionStatus?.TransactionStatus || null,
  }));
}

export async function GET(req, { params }) {
  try {
    const { id: customerId } = params;

    if (!customerId || isNaN(customerId)) {
      return NextResponse.json({
        status: 400,
        error: "Invalid CustomerID provided.",
      });
    }

    const result = await getTransactionsByCustomerID(customerId);

    return NextResponse.json({
      status: 200,
      message: "All transactions for HopeFuelID retrieved successfully.",
      hopeFuelId: parseInt(customerId),
      data: result,
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return NextResponse.json({
      status: 500,
      error: "Server error",
    });
  }
}
