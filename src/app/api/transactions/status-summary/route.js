import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("month");

  const [year, monthStr] = date.split("-");
  const monthNum = parseInt(monthStr);
  const startDate = new Date(`${year}-${monthStr}-01T00:00:00Z`);
  const endDate = new Date(new Date(startDate).setMonth(monthNum));

  try {
    const transactions = await prisma.Transactions.findMany({
      where: {
        TransactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        PaymentCheck: true,
      },
    });

    let checked = 0;
    let pending = 0;

    for (const txn of transactions) {
      if (txn.PaymentCheck === true) {
        checked++;
      } else {
        pending++;
      }
    }

    const result = {
      date: date,
      total: checked + pending,
      checked,
      pending,
    };

    return NextResponse.json({
      status: 200,
      message: "Transaction summary by payment status retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch transaction summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction summary" },
      { status: 500 }
    );
  }
}
