import { NextResponse } from "next/server";
import db from "../../../utilites/db";

async function fetchCustomerDetails(customerId) {
  const query = `
    SELECT 
      c.CustomerId,
      c.Name,
      c.Email,
      c.ManyChatId,
      c.ExpireDate,
      c.ContactLink,
      c.CardID,
      sr.Region AS SupportRegion,
      a.AwsId,
      bc.BaseCountryID AS UserCountry,
      bc.BaseCountryName AS UserCountryName,
      (
        SELECT t.HopeFuelID 
        FROM Transactions t 
        WHERE t.CustomerID = c.CustomerId 
        ORDER BY t.TransactionDate DESC 
        LIMIT 1
      ) AS HopeFuelID
    FROM Customer c
    LEFT JOIN SupportRegion sr ON c.AgentId = sr.SupportRegionID
    LEFT JOIN Agent a ON c.AgentId = a.AgentId
    LEFT JOIN BaseCountry bc ON c.UserCountry = bc.BaseCountryID
    WHERE c.CustomerId = ?
  `;

  const values = [customerId];

  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw new Error("[DB] Error fetching customer details:");
  }
}

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Customer ID is required" },
      { status: 400 }
    );
  }

  try {
    const customer = await fetchCustomerDetails(id);

    if (customer.length === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        customer: customer[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error fetching customer details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
