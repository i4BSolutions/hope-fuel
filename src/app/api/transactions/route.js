import { NextResponse } from "next/server";
import db from "../../utilites/db";

export const dynamic = "force-dynamic";

// Function to fetch PaymentCheck data
async function PaymentCheckQuery(status) {
  const query = `
    SELECT 
      t.HopeFuelID,
      c.Name,           
      c.Email,                     
      t.Amount,           
      t.Month,                       
      GROUP_CONCAT(ss.ScreenShotLink SEPARATOR ';') AS ScreenShots,
      c.ManyChatID,
      w.WalletName,
      cu.CurrencyCode,
      a.AWSID 
    FROM 
      Transactions t
    LEFT JOIN 
      Customer c ON t.CustomerID = c.CustomerID
    LEFT JOIN 
      SupportRegion sr ON t.SupportRegionID = sr.SupportRegionID
    LEFT JOIN 
      ScreenShot ss ON t.TransactionID = ss.TransactionID
    LEFT JOIN 
      Wallet w ON t.WalletID = w.WalletID
    LEFT JOIN 
      Currency cu ON w.CurrencyID = cu.CurrencyID
    LEFT JOIN 
      TransactionAgent ta ON t.TransactionID = ta.TransactionID
    LEFT JOIN 
      Agent a ON ta.AgentID = a.AgentID 
    WHERE 
      t.PaymentCheck = ? OR t.PaymentCheck IS NULL
    GROUP BY 
      t.HopeFuelID, c.Name, c.Email, t.Amount, t.Month, c.ManyChatID, w.WalletName, cu.CurrencyCode, a.AWSID;
  `;

  try {
    const result = await db(query, [status]);

    if (Array.isArray(result) && result.length > 0) {
      result.forEach((trans) => {
        trans.ScreenShots = trans.ScreenShots
          ? trans.ScreenShots.split(";")
          : [];
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching PaymentCheck data:", error);
    throw new Error("Failed to fetch PaymentCheck data");
  }
}

// Function to fetch another transaction
async function getAnotherTransaction(customerEmail, customerName) {
  const query = `
    SELECT 
      Cust.Name,
      Cust.Email,
      T.TransactionDate,
      T.Amount,
      C.CurrencyCode
    FROM 
      Transactions T
    JOIN 
      Customer Cust ON Cust.CustomerID = T.CustomerID
    JOIN 
      Wallet W ON T.WalletID = W.WalletId
    JOIN 
      Currency C ON W.CurrencyId = C.CurrencyId
    WHERE 
      Cust.Name = ? 
      AND Cust.Email = ?;
  `;

  try {
    const result = await db(query, [customerName, customerEmail]);
    return result;
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    throw new Error("Failed to fetch transaction data");
  }
}

// GET API Handler
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("paymentCheckStatus");
    const customerName = url.searchParams.get("customerName");
    const customerEmail = url.searchParams.get("customerEmail");

    // Determine which function to call based on query parameters
    if (status) {
      const paymentData = await PaymentCheckQuery(status);
      return NextResponse.json({ paymentData });
    } else if (customerName && customerEmail) {
      const cardIssuedData = await getAnotherTransaction(
        customerEmail,
        customerName
      );
      return NextResponse.json({ cardIssuedData });
    } else {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[Error] Fetching data failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
