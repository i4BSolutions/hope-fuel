import { NextResponse } from "next/server";
import db from "../../../utilites/db";

async function searchHopeFuelList(searchText) {
  let params = [];
  let query = `
    
SELECT
    t.HopeFuelID,
    c.Name,
    c.Email,
    c.CardID,
    t.TransactionDate,
    t.Amount,
    curr.CurrencyCode,
    t.Month,
    GROUP_CONCAT(DISTINCT ss.ScreenShotLink SEPARATOR ', ') AS ScreenShot,
    c.ManyChatId,
    MAX(a.Username) AS FormFilledPerson,
    ts.TransactionStatus,
    n.Note AS Note
FROM Transactions t
LEFT JOIN Customer c ON t.CustomerID = c.CustomerId
LEFT JOIN Wallet w ON t.WalletID = w.WalletId
LEFT JOIN Currency curr ON w.CurrencyId = curr.CurrencyId
LEFT JOIN Note n ON t.NoteID = n.NoteID
LEFT JOIN ScreenShot ss ON t.TransactionID = ss.TransactionID
LEFT JOIN (
      SELECT ta1.TransactionID, ta1.AgentID
      FROM TransactionAgent ta1
      INNER JOIN (
        SELECT TransactionID, MIN(TransactionAgentID) AS FirstTAID
        FROM TransactionAgent
        GROUP BY TransactionID
      ) first_ta ON ta1.TransactionID = first_ta.TransactionID AND ta1.TransactionAgentID = first_ta.FirstTAID
    ) ta ON t.TransactionID = ta.TransactionID
LEFT JOIN Agent a ON ta.AgentID = a.AgentID
LEFT JOIN (
    SELECT 
        fs.TransactionID,
        fs.TransactionStatusID
    FROM FormStatus fs
    INNER JOIN (
        SELECT 
            TransactionID,
            MAX(FormStatusID) AS LatestFormStatusID
        FROM FormStatus
        GROUP BY TransactionID
    ) latest_fs ON fs.FormStatusID = latest_fs.LatestFormStatusID
) current_fs ON t.TransactionID = current_fs.TransactionID
LEFT JOIN TransactionStatus ts ON current_fs.TransactionStatusID = ts.TransactionStatusID
WHERE 
    -- Filter for current month
    MONTH(t.TransactionDate) = MONTH(CURRENT_DATE())
    AND YEAR(t.TransactionDate) = YEAR(CURRENT_DATE())
    -- Optional search text filtering
    AND (
        t.HopeFuelID LIKE ? OR
        c.Name LIKE ? OR
        c.Email LIKE ? OR
        c.CardID LIKE ? OR
        t.TransactionDate LIKE ? OR
        t.Amount LIKE ? OR
        curr.CurrencyCode LIKE ? OR
        t.Month LIKE ? OR
        ss.ScreenShotLink LIKE ? OR
        c.ManyChatId LIKE ? OR
        a.AwsId LIKE ? OR
        ts.TransactionStatus LIKE ? OR
        n.Note LIKE ?
    )
GROUP BY 
    t.TransactionID, t.HopeFuelID, c.Name, c.Email, c.CardID,
    t.TransactionDate, t.Amount, curr.CurrencyCode, t.Month,
    c.ManyChatId, ts.TransactionStatus, n.Note;

    `;

  params = Array(13).fill(`%${searchText}%`);

  try {
    const result = await db(query, params);
    return result.map((row) => ({
      ...row,
      ScreenShot:
        typeof row.ScreenShot === "string" && row.ScreenShot
          ? row.ScreenShot.split(", ")
          : [],
    }));
  } catch (error) {
    console.error("Error searching in Hope Fuel List", error);
    throw new Error("Failed to search in Hope Fuel List");
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const searchText = searchParams.get("q").trim();

  if (!searchText) {
    return NextResponse.json(
      { error: "Search text is required" },
      { status: 400 }
    );
  }

  try {
    const result = await searchHopeFuelList(searchText);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "No matching records found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Successfully searched in Hope Fuel List",
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search in Hope Fuel List" },
      { status: 500 }
    );
  }
}
