export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import db from "../../utilites/db";

export async function POST(request) {
  let json = await request.json();
  const { name, email } = json;

  try {
    // Fetch the latest transaction for the customer
    const transaction = await db(
      `SELECT t.*
         FROM Transactions t
         INNER JOIN Customer c ON t.CustomerID = c.CustomerID
         WHERE c.Name = ?
           AND c.Email = ?
           AND (t.PaymentDenied IS NULL OR t.PaymentDenied IN (0,1))
         ORDER BY t.TransactionDate DESC
         LIMIT 1;`,
      [name, email]
    );

    // If a transaction exists, check current month/year
    if (transaction.length > 0) {
      const latest = transaction[0];
      const paymentDenied = latest.PaymentDenied;
      const latestDate = new Date(latest.TransactionDate);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // If PaymentDenied is 1 → return true
      if (paymentDenied === 1) {
        return NextResponse.json(true);
      }

      // If PaymentDenied is null or 0 → check month/year
      const isOutsideCurrentMonth =
        latestDate.getFullYear() < currentYear ||
        (latestDate.getFullYear() === currentYear &&
          latestDate.getMonth() < currentMonth);

      // Return true if transaction is outside current month, else false
      return NextResponse.json(isOutsideCurrentMonth);
    }

    // If no transaction exists in DB, check Airtable permission
    const answer = await checkPermission(name, email);
    return NextResponse.json(answer);
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ message: "error checking user" });
  }
}

// Airtable permission fallback
async function checkPermission(name, email) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.AIRTABLE_TOKEN}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const userNameURL = encodeURIComponent(name);
  const emailURL = encodeURIComponent(email);

  let response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_APP_ID}/${process.env.HQID_TABLE}?fields%5B%5D=notion_create_time&fields%5B%5D=Create+Time&filterByFormula=IF(AND(%22${userNameURL}%22+%3D+TRIM(Name)%2C+%22${emailURL}%22+%3D+TRIM(Email)%2C'%E1%80%95%E1%80%9A%E1%80%BA%E1%80%96%E1%80%BB%E1%80%80%E1%80%BA'+!%3D+Status)%2CTRUE()%2C+FALSE()+)&maxRecords=1&sort%5B0%5D%5Bfield%5D=Create+Time&sort%5B0%5D%5Bdirection%5D=desc`,
    requestOptions
  );

  const json = await response.json();
  if (!json.records || json.records.length === 0) return true;

  const record = json.records[0].fields;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const latest = new Date(record.notion_create_time || record["Create Time"]);
  const isOutsideCurrentMonth =
    latest.getFullYear() < currentYear ||
    (latest.getFullYear() === currentYear && latest.getMonth() < currentMonth);

  return isOutsideCurrentMonth;
}
