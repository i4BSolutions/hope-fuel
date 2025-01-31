import { NextResponse } from "next/server";
import db from "../../../utilites/db";


async function searchHopeFuelList(searchText) {
  const query = `
SELECT
    t.HopeFuelID AS 'Hope Fuel ID',
    c.Name,
    c.Email,
    c.CardID AS 'Card ID',
    t.TransactionDate AS 'Create time',
    t.Amount,
    curr.CurrencyCode AS Currency,
    t.Month,
    GROUP_CONCAT(DISTINCT ss.ScreenShotLink SEPARATOR ', ') AS ScreenShot,
    c.ManyChatId AS 'Manychat ID',
    GROUP_CONCAT(DISTINCT a.AwsId SEPARATOR ', ') AS 'Form filled Person',
    ts.TransactionStatus AS 'Current Status',
    n.Note AS Note
FROM
    Transactions t
LEFT JOIN Customer c ON t.CustomerID = c.CustomerId
LEFT JOIN Wallet w ON t.WalletID = w.WalletId
LEFT JOIN Currency curr ON w.CurrencyId = curr.CurrencyId
LEFT JOIN Note n ON t.NoteID = n.NoteID
LEFT JOIN ScreenShot ss ON t.TransactionID = ss.TransactionID
LEFT JOIN TransactionAgent ta ON t.TransactionID = ta.TransactionID
LEFT JOIN Agent a ON ta.AgentID = a.AgentId
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
    t.HopeFuelID LIKE ? OR
    c.Name LIKE ? OR
    c.Email LIKE ? OR
    c.CardID LIKE ? OR
    t.TransactionDate LIKE ? OR
    t.Amount LIKE ?  OR
    curr.CurrencyCode LIKE ? OR
    t.Month LIKE ? OR
	ss.ScreenShotLink LIKE ? OR
	c.ManyChatId LIKE ? OR
	a.AwsId LIKE ? OR
    ts.TransactionStatus LIKE ? OR
    n.Note LIKE ?
GROUP BY
    t.TransactionID,
    t.HopeFuelID,
    c.Name,
    c.Email,
    c.CardID,
    t.TransactionDate,
    t.Amount,
    curr.CurrencyCode,
    t.Month,
    c.ManyChatId,
    ts.TransactionStatus,
    n.Note

`;
  const searchPattern = `%${searchText}%`;
  const params = Array(13).fill(searchPattern);
  try {
    const result = await db(query, params);
     return result.map(row => ({
      ...row,
      ScreenShot: row.ScreenShot ? row.ScreenShot.split(', ') : [],
    }));
  } catch (error) {
    console.error("Error searching in Hope Fuel List", error);
    throw new Error("Failed to search in Hope Fuel List");
  }
}

export async function GET(req){
    const {searchParams} = new URL(req.url);
    const searchText = searchParams.get('q').trim();

 if (!searchText) {
   return NextResponse.json(
     { message: "Missing search query parameter" },
     { status: 400 }
   );
 }

    try {
    const result = await searchHopeFuelList(searchText);
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
