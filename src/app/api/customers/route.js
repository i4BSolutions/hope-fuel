import { NextResponse } from "next/server";
import db from "../../utilites/db";

async function fetchCustomers({ limit, offset, term, unlimited = false }) {
  let query = `
    SELECT 
      c.CustomerId, 
      c.Name, 
      c.Email, 
      c.CardID,
      (
        SELECT t.HopeFuelID
        FROM Transactions t
        WHERE t.CustomerID = c.CustomerId
        ORDER BY t.TransactionDate DESC
        LIMIT 1
      ) AS HopeFuelID
    FROM Customer c
  `;

  const values = [];

  if (term) {
    query += ` WHERE c.Name LIKE ? OR c.Email LIKE ? OR c.CardID LIKE ? `;
    const likeTerm = `%${term}%`;
    values.push(likeTerm, likeTerm, likeTerm);
  }

  if (!unlimited) {
    query += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);
  }

  return db(query, values);
}

async function countCustomers(term) {
  let query = `SELECT COUNT(*) AS total FROM Customer`;
  const values = [];

  if (term) {
    query += ` WHERE Name LIKE ? OR Email LIKE ? OR CardID LIKE ?`;
    const likeTerm = `%${term}%`;
    values.push(likeTerm, likeTerm, likeTerm);
  }

  return db(query, values);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;
  const term = searchParams.get("term")?.trim() || null;

  try {
    const unlimited = !!term; // skip pagination if searching
    const [{ total }] = await countCustomers(term);
    const customers = await fetchCustomers({ limit, offset, term, unlimited });

    if (customers.length === 0) {
      return NextResponse.json(
        { status: 404, message: "No customers found", data: [] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Customers retrieved successfully.",
      totalRecords: total,
      totalPages: unlimited ? 1 : Math.ceil(total / limit),
      currentPage: unlimited ? 1 : page,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
