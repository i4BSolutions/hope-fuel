export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";
import { endOfMonth, startOfMonth } from "date-fns";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const now = new Date();

    const year = parseInt(searchParams.get("year") || now.getFullYear(), 10);
    const month = parseInt(searchParams.get("month") || now.getMonth() + 1, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { message: "Invalid year or month" },
        { status: 400 }
      );
    }

    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const allTransactions = await prisma.Transactions.findMany({
      where: {
        TransactionDate: {
          gte: startDate,
          lte: endDate,
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
        tx.FormStatus?.[tx.FormStatus.length - 1]?.TransactionStatus
          ?.TransactionStatus;
      if (latestStatus && statusMap.hasOwnProperty(latestStatus)) {
        statusMap[latestStatus]++;
      }
    }

    const statusArray = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));

    return NextResponse.json({
      status: 200,
      message: "Transaction Status retrieved successfully.",
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
