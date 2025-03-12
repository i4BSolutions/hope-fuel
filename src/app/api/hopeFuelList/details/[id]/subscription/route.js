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
    const startDate = new Date(row.TransactionDate); 
    const totalMonths = row.Month;
    const amountPerMonth = row.Amount / totalMonths;

    let entries = [];

    let validFromDate= new Date(startDate); 

    for (let i = 0; i < totalMonths; i++) {
      let endDate = new Date(validFromDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); //last day of the month

      entries.push({
        HopeFuelID: row.HopeFuelID,
        TransactionAmount: row.Amount,
        TimeLineInMonth: totalMonths,
        MonthlyAmount: amountPerMonth,
        CurrencyCode: row.CurrencyCode,
        TransactionDate: moment(startDate).format("DD-MM-YYYY"),
        ValidFromDate: moment(validFromDate).format("DD-MM-YYYY"),
        ValidThroughDate: moment(endDate).format("DD-MM-YYYY"),
      });

      validFromDate.setMonth(endDate.getMonth() + 1);//start date of next month
      validFromDate.setDate(1);//first day of the month
    }

    return entries;
  });


    return NextResponse.json(
      {
        data: subscriptionHistory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting Subscription Month by HopeFuelId", error);
    return NextResponse.json(
      { error: "Failed to get Subscription Month by HopeFuelId" },
      { status: 500 }
    );
  }
}
