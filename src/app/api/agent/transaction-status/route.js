// app/api/dashboard/transaction-status/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";
import { startOfMonth } from "date-fns";

export async function GET() {
  try {
    const startDate = startOfMonth(new Date());

    const allTransactions = await prisma.Transactions.findMany({
      where: {
        TransactionDate: {
          gte: startDate,
        },
      },
      include: {
        FormStatus: {
          include: {
            TransactionStatus: true,
          },
        },
      },
    });

    const statusMap = {
      "Form Entry": 0,
      "Payment Checked": 0,
      "Card Issued": 0,
      Cancel: 0,
    };

    for (const tx of allTransactions) {
      const latestStatus =
        tx.FormStatus.at(-1)?.TransactionStatus?.TransactionStatus;
      if (latestStatus && statusMap[latestStatus] !== undefined) {
        statusMap[latestStatus]++;
      }
    }

    const statusArray = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));

    return NextResponse.json({
      status: 200,
      message: "Transaction Status retrieve successfully.",
      total: allTransactions.length,
      statusBreakdown: statusArray,
    });
  } catch (error) {
    console.error("Transaction Status API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
