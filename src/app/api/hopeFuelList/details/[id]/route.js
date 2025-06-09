import { NextResponse } from "next/server";
import db from "../../../../utilites/db";


async function HopeFuelDetailsByHopeFuelId(id) {

    const query = `
    SELECT
            t.HopeFuelID,
            c.Name,
            c.Email,
            c.CardID,
            t.TransactionDate,
            t.Amount,
            curr.CurrencyCode,
            t.Month,
            GROUP_CONCAT(DISTINCT ss.ScreenShotLink SEPARATOR ',') AS ScreenShot,
            c.ManyChatId ,
            GROUP_CONCAT(DISTINCT a.AwsId SEPARATOR ',') AS 'FormFilledPerson',
            ts.TransactionStatus,
            n.Note AS Note
        FROM Transactions t
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
          t.HopeFuelID = ?
        GROUP BY 
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
    n.Note;
    `;

    const values = [id];
    try{
    const result = await db(query, values);
    return result.map((row) => ({
      ...row,
      ScreenShot:
        typeof row.ScreenShot === "string" && row.ScreenShot ? row.ScreenShot.split(",") : [],
        
    }));
   
    }
    catch (error) {
        console.error("[DB] Error checking HopeFuelDetailsByHopeFuelId:", error);
        throw error;
    }
   
    
}

//Get the HopeFuelDetailsByHopeFuelId
export async function GET(req,{ params}) {
    try {
         const { id } = params;

         if (!id) {
           return NextResponse.json(
             { error: "Missing id query parameter" },
             { status: 400 }
           );
         }

         const data = await HopeFuelDetailsByHopeFuelId(id);
         // console.log("Data:", data); // Log the entire data array

         if (data.length === 0) {
           return NextResponse.json(
             { message: "HopeFuel Details does not exist", code: 0 },
             { status: 404 }
           );
         }

         return NextResponse.json(
           {
             message: `HopeFuel Details for ID: ${id}`,
             data: {
               HopeFuelID: data[0].HopeFuelID,
               Name: data[0].Name,
               Email: data[0].Email,
               CardID: data[0].CardID,
               CreateTime: data[0].TransactionDate,
               Amount: data[0].Amount,
               CurrencyCode: data[0].CurrencyCode,
               TimeLineInMonth: data[0].Month,
               ScreenShot: data[0].ScreenShot,
               ManyChatId: data[0].ManyChatId,
               FormFilledPerson: data[0].FormFilledPerson,
               TransactionStatus: data[0].TransactionStatus,
               Note: data[0].Note,
             },
           },
           {
             status: 200,
           }
         );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get HopeFuel Details" },
            { status: 500 }
          );
    }
  
}