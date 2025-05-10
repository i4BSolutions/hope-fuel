import { NextResponse } from "next/server";
import db from "../../../../../utilites/db";

import moment from "moment-timezone";

async function SubscriptionMonthByHopeFuelId(id) {
  const query = `
   SELECT 
    t.HopeFuelID,
    t.Month,
    t.Amount,
    curr.CurrencyCode,
    t.TransactionDate
FROM 
    Transactions t
 
JOIN 
  Wallet w On t.WalletID = w.WalletId
JOIN
Currency curr On w.CurrencyId = curr.CurrencyId
    
WHERE 
    t.HopeFuelID = ?
       
    `;
  const values = [id];

  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing id query parameter" },
      { status: 400 }
    );
  }

  try {
    const result = await SubscriptionMonthByHopeFuelId(id);

    const subscriptionHistory = result.flatMap((row) => {
      const startDate = moment(row.TransactionDate); // original transaction date
      const totalMonths = row.Month;
      const amountPerMonth = row.Amount / totalMonths;

      let entries = [];
      let currentDate = moment(startDate);

      for (let i = 0; i < totalMonths; i++) {
        const validFromDate = moment(currentDate).startOf("month");
        const validThroughDate = moment(currentDate).endOf("month");

        entries.push({
          HopeFuelID: row.HopeFuelID,
          TransactionAmount: row.Amount,
          TimeLineInMonth: totalMonths,
          MonthlyAmount: amountPerMonth,
          CurrencyCode: row.CurrencyCode,
          TransactionDate: startDate.format("MMMM D, YYYY"),
          ValidFromDate: validFromDate.format("MMMM D, YYYY"),
          ValidThroughDate: validThroughDate.format("MMMM D, YYYY"),
        });

        currentDate.add(1, "month");
      }

      return entries;
    });

    return NextResponse.json({
      status: 200,
      message: "Retrieve subscription successfully.",
      data: subscriptionHistory,
    });
  } catch (error) {
    console.error("Error getting Subscription Month by HopeFuelId", error);
    return NextResponse.json(
      { error: "Failed to get Subscription Month by HopeFuelId" },
      { status: 500 }
    );
  }
}
