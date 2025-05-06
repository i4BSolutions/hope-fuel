import { NextResponse } from "next/server";
import db from "../../../utilites/db";

async function SearchCustomers(searchTerm) {
  const query = `SELECT DISTINCT c.*
    FROM Customer c
    LEFT JOIN Transactions t ON c.CustomerId = t.CustomerID
    WHERE 
      c.Name LIKE ? 
      OR c.Email LIKE ? 
      OR t.HopeFuelID LIKE ? 
      OR c.CardID LIKE ? 
      OR c.ManyChatId LIKE ?
  `;

  const searchPattern = `%${searchTerm}%`;
  const values = Array(5).fill(searchPattern);

  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("[DB] Error fetching customers");
  }
}

export async function GET(req) {
  const searchTerm = new URL(req.url).searchParams.get("term");

  if (!searchTerm) {
    return NextResponse.json(
      { message: "Missing search term" },
      { status: 400 }
    );
  }

  try {
    const result = await SearchCustomers(searchTerm);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "No matching records found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Successfully searched in Customer List",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
