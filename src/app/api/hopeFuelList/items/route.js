import { NextResponse } from "next/server";

import db from "../../../utilites/db";

async function retrieveCurrentMonthHopeFuelCards(page, limit, filters = {}) {
  const { q, statusId, currency, agentId } = filters;
  const offset = (page - 1) * limit;

  // Base WHERE (current month)
  const whereParts = [
    `t.TransactionDate >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
    `t.TransactionDate < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)`,
  ];
  const whereParams = [];

  // Optional text search (same fields used in your prior search API)
  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    whereParts.push(`(
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
    )`);
    whereParams.push(
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      like
    );
  }

  // Optional filters
  if (statusId) {
    whereParts.push(`current_fs.TransactionStatusID = ?`);
    whereParams.push(Number(statusId));
  }
  if (currency) {
    whereParts.push(`curr.CurrencyCode = ?`);
    whereParams.push(String(currency));
  }
  if (agentId) {
    // First form-filling agent (matches your ta/a join)
    whereParts.push(`a.Username = ?`);
    whereParams.push(Number(agentId));
  }

  const whereSQL = `WHERE ${whereParts.join(" AND ")}`;

  // COUNT query mirrors joins used in the data query for correctness
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT DISTINCT t.TransactionID
      FROM Transactions t
      LEFT JOIN Customer c    ON t.CustomerID = c.CustomerId
      LEFT JOIN Wallet w      ON t.WalletID   = w.WalletId
      LEFT JOIN Currency curr ON w.CurrencyId = curr.CurrencyId
      LEFT JOIN Note n        ON t.NoteID     = n.NoteID
      LEFT JOIN ScreenShot ss ON t.TransactionID = ss.TransactionID
      LEFT JOIN (
        SELECT ta1.TransactionID, ta1.AgentID
        FROM TransactionAgent ta1
        INNER JOIN (
          SELECT TransactionID, MIN(TransactionAgentID) AS FirstTAID
          FROM TransactionAgent
          GROUP BY TransactionID
        ) first_ta ON ta1.TransactionID = first_ta.TransactionID
                   AND ta1.TransactionAgentID = first_ta.FirstTAID
      ) ta ON t.TransactionID = ta.TransactionID
      LEFT JOIN Agent a ON ta.AgentID = a.AgentID
      LEFT JOIN (
        SELECT fs.TransactionID, fs.TransactionStatusID, fs.FormStatusID
        FROM FormStatus fs
        INNER JOIN (
          SELECT TransactionID, MAX(FormStatusID) AS LatestFormStatusID
          FROM FormStatus
          GROUP BY TransactionID
        ) latest_fs ON fs.FormStatusID = latest_fs.LatestFormStatusID
      ) current_fs ON t.TransactionID = current_fs.TransactionID
      LEFT JOIN TransactionStatus ts ON current_fs.TransactionStatusID = ts.TransactionStatusID
      ${whereSQL}
    ) x;
  `;

  const dataQuery = `
    SELECT
      c.Name,
      c.Email,
      c.CardID,
      c.ManyChatId,
      t.HopeFuelID,
      t.TransactionDate,
      t.Amount,
      t.Month,
      curr.CurrencyCode,
      GROUP_CONCAT(DISTINCT ss.ScreenShotLink SEPARATOR ',') AS ScreenShot,
      MAX(a.Username) AS FormFilledPerson,
      ts.TransactionStatus,
      ts.TransactionStatusID,
      current_fs.FormStatusID,
      n.Note AS Note
    FROM Transactions t
    LEFT JOIN Customer c    ON t.CustomerID = c.CustomerId
    LEFT JOIN Wallet w      ON t.WalletID   = w.WalletId
    LEFT JOIN Currency curr ON w.CurrencyId = curr.CurrencyId
    LEFT JOIN Note n        ON t.NoteID     = n.NoteID
    LEFT JOIN ScreenShot ss ON t.TransactionID = ss.TransactionID
    LEFT JOIN (
      SELECT ta1.TransactionID, ta1.AgentID
      FROM TransactionAgent ta1
      INNER JOIN (
        SELECT TransactionID, MIN(TransactionAgentID) AS FirstTAID
        FROM TransactionAgent
        GROUP BY TransactionID
      ) first_ta ON ta1.TransactionID = first_ta.TransactionID
                 AND ta1.TransactionAgentID = first_ta.FirstTAID
    ) ta ON t.TransactionID = ta.TransactionID
    LEFT JOIN Agent a ON ta.AgentID = a.AgentID
    LEFT JOIN (
      SELECT fs.TransactionID, fs.TransactionStatusID, fs.FormStatusID
      FROM FormStatus fs
      INNER JOIN (
        SELECT TransactionID, MAX(FormStatusID) AS LatestFormStatusID
        FROM FormStatus
        GROUP BY TransactionID
      ) latest_fs ON fs.FormStatusID = latest_fs.LatestFormStatusID
    ) current_fs ON t.TransactionID = current_fs.TransactionID
    LEFT JOIN TransactionStatus ts ON current_fs.TransactionStatusID = ts.TransactionStatusID
    ${whereSQL}
    GROUP BY 
      t.TransactionID, t.HopeFuelID, c.Name, c.Email, c.CardID, t.TransactionDate, 
      t.Amount, curr.CurrencyCode, t.Month, c.ManyChatId, ts.TransactionStatus,
      ts.TransactionStatusID, current_fs.FormStatusID, n.Note
    ORDER BY t.HopeFuelID DESC
    LIMIT ? OFFSET ?;
  `;

  const [{ total }] = await db(countQuery, whereParams);
  const rows = await db(dataQuery, [...whereParams, limit, offset]);

  const result = rows.map((row) => ({
    ...row,
    ScreenShot:
      typeof row.ScreenShot === "string" && row.ScreenShot
        ? row.ScreenShot.split(",")
        : [],
  }));

  return { result, total: Number(total) || 0 };
}
export async function GET(req) {
  const url = new URL(req.url);
  const p = url.searchParams;

  const page = Number(p.get("page")) || 1;
  const limit = Number(p.get("limit")) || 10;

  // Single endpoint handles all:
  const q = p.get("q") || ""; // optional search text
  const statusId = p.get("statusId") || null; // 1..4
  const currency = p.get("currency") || null; // e.g. "USD"
  const agentId = p.get("agentId") || null; // numeric AgentID

  try {
    const { result, total } = await retrieveCurrentMonthHopeFuelCards(
      page,
      limit,
      {
        q,
        statusId,
        currency,
        agentId,
      }
    );

    return NextResponse.json(
      { page, limit, total, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Items API Error:", error);
    return NextResponse.json(
      { error: "Error in retrieving data from the database." },
      { status: 500 }
    );
  }
}
