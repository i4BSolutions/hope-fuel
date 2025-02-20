import { NextResponse } from "next/server";
import db from "../../utilites/db";
import calculateExpireDate from "../../utilites/calculateExpireDate";
import moment from "moment-timezone";
//Insert Into Customer Table
async function InsertCustomer(
  customerName,
  customerEmail,
  agentId,
  manyChatId,
  contactLink,
  month
) {
  let currentDay = new Date();
  let nextExpireDate = calculateExpireDate(currentDay, month, true);
  const query = `
    INSERT INTO Customer (Name, Email, AgentID, ManyChatID, ContactLink, ExpireDate ) VALUES (?, ?, ?, ?, ?, ?)
    `;
  const values = [
    customerName,
    customerEmail,
    agentId,
    manyChatId,
    contactLink,
    nextExpireDate,
  ];
  try {
    const result = await db(query, values);
    return result.insertId; // Retrieve the inserted customer ID
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to insert customer" },
      { status: 500 }
    );
  }
}

//Insert Into Note Table
async function createNote(note, agentID) {
  const query = `insert into Note (Note, Date, AgentID) values ( ?, ?, ?)`;
  const values = [note, new Date(), agentID];
  try {
    const result = await db(query, values);
    return result.insertId;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to insert customer" },
      { status: 500 }
    );
  }
}

//Insert Into ScreenShot Table
async function createScreenShot(screenShot, transactionsID) {
  if (!screenShot || screenShot.length === 0) {
    throw new Error("You need to provide a screenshot");
  }

  let screenShotLink = screenShot.map(async (item) => {
    const query = `insert into ScreenShot (TransactionID , ScreenShotLink) values ( ?, ?)`;

    const path = String(item.url).substring(0, String(item.url).indexOf("?"));
    const values = [transactionsID, path];

    try {
      const result = await db(query, values);

      return result.insertId;
    } catch (error) {
      console.error("Error inserting screenshot:", error);
      throw new Error("Failed to insert screenshot");
    }
  });
  return screenShotLink;
}

//Insert Into TransactionAgent Table
async function InsertTransactionLog(transactionId, agentId) {
  const query = `INSERT INTO TransactionAgent(TransactionID, AgentID, LogDate) VALUES (?, ?, ?)`;

  let timeZone = "Asia/Bangkok";
  let transactionDateWithThailandTimeZone = moment()
    .tz(timeZone)
    .format("YYYY-MM-DD HH:mm:ss");

  const values = [transactionId, agentId, transactionDateWithThailandTimeZone];
  try {
    const result = await db(query, values);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting log", error);
    return;
  }
}
async function InsertFormStatus(transactionId) {
  const query = `INSERT INTO FormStatus (TransactionID, TransactionStatusID) VALUES (?, ?)`;
  const values = [transactionId, 1];
  try {
    const result = await db(query, values);
    console.log("result " + result);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting log", error);
    return;
  }
}

async function maxHopeFuelID() {
  const maxHopeFuelID_Query = `SELECT MAX(HopeFuelID) AS maxHopeFuelID FROM Transactions`;
  const result = await db(maxHopeFuelID_Query);
  return result[0]["maxHopeFuelID"];
}

export async function POST(req) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }
    let json = await req.json();

    let {
      CustomerName,
      CustomerEmail,
      AgentId,
      SupportRegionId,
      ManyChatId,
      ContactLink,
      Amount,
      Month,
      Notes,
      WalletId,
      ScreenShots,
    } = json;

  

    if (!ScreenShots || ScreenShots.length === 0) {
      return NextResponse.json(
        { error: "You need to provide a screenshot" },
        { status: 400 }
      );
    }
    if (ContactLink.trim() === "") {
      ContactLink = null;
    }

    let noteId = null;
    if (Notes && Notes !== "") {
      noteId = await createNote(Notes, AgentId);
    }

    const customerId = await InsertCustomer(
      CustomerName,
      CustomerEmail,
      AgentId,
      ManyChatId,
      ContactLink,
      Month
    );

    let nextHopeFuelID = await maxHopeFuelID();

    if (nextHopeFuelID === null) {
      nextHopeFuelID = 0;
    }
    nextHopeFuelID++;
    console.log("Incremented maxHopeFuelID:", nextHopeFuelID);
    let timeZone = "Asia/Bangkok";
    let transactionDateWithThailandTimeZone = moment()
      .tz(timeZone)
      .format("YYYY-MM-DD HH:mm:ss");

    //insert into transaction table
    const query = `
     INSERT INTO Transactions   
    (CustomerID, Amount,  SupportRegionID, WalletID, TransactionDate, NoteID, Month,HopeFuelID) 
      VALUES (?, ?, ?, ?,  ? , ?, ?, ?)

    `;
    const values = [
      customerId,
      Amount,
      SupportRegionId,
      WalletId,
      transactionDateWithThailandTimeZone,
      noteId,
      Month,
      nextHopeFuelID,
    ];
    const result = await db(query, values);

    const transactionId = result.insertId;
    const formStatusId = await InsertFormStatus(transactionId);

    const screenShotIds = await createScreenShot(ScreenShots, transactionId);
    await InsertTransactionLog(transactionId, AgentId);
    return NextResponse.json({
      status: "success",
      transactionId,
      screenShotIds,
      formStatusId,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
