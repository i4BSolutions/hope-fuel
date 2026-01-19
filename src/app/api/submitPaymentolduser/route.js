import moment from "moment-timezone";
import { NextResponse } from "next/server";
import calculateExpireDate from "../../utilites/calculateExpireDate";
import db from "../../utilites/db";
import maxHopeFuelID from "../../utilites/maxHopeFuelID.js";
import prisma from "../../utilites/prisma";

async function InsertCustomer(
  customerName,
  customerEmail,
  agentId,
  manyChatId,
  contactLink,
  expireDate,
  cardId,
  month
) {
  let raw = {
    customerName,
    customerEmail,
    agentId,
    manyChatId,
    contactLink,
    expireDate,
    cardId,
    month,
  };

  let nextExpireDate = null;
  let lastDayOfthisMonth = calculateExpireDate(new Date(), 0, 0);
  console.log(lastDayOfthisMonth);
  console.log(expireDate);
  let isEedCurrent = expireDate.getTime() >= lastDayOfthisMonth.getTime();
  console.log(expireDate.getDate());
  console.log(lastDayOfthisMonth.getDate());
  console.log("isEedCurrent is ");
  console.log(isEedCurrent);

  if (isEedCurrent) {
    nextExpireDate = calculateExpireDate(
      expireDate,
      parseInt(month),
      !isEedCurrent
    );
    console.log(nextExpireDate);
  } else {
    nextExpireDate = calculateExpireDate(
      new Date(),
      parseInt(month),
      !isEedCurrent
    );
    console.log("The calcualte expire date is .");
    console.log(expireDate);
  }

  console.log(nextExpireDate);
  const query = `
    INSERT INTO Customer (Name, Email, AgentID, ManyChatID, ContactLink, ExpireDate, CardID ) VALUES (?, ?, ?, ?, ?, ? , ?)
    `;
  const values = [
    customerName,
    customerEmail,
    agentId,
    manyChatId,
    contactLink,
    nextExpireDate,
    cardId,
  ];
  try {
    const result = await db(query, values);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting customer:", error);
    return NextResponse.json(
      { error: "Failed to insert customer" },
      { status: 500 }
    );
  }
}

async function InsertSubscription(customerId, month) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1 + month, 0);
  try {
    const subscription = await prisma.subscription.create({
      data: {
        CustomerID: customerId,
        StartDate: startDate,
        EndDate: endDate,
      },
    });
    return subscription.SubscriptionID;
  } catch (error) {
    console.error("Error inserting subscription:", error);
  }
}

async function createNote(note, agentID) {
  const query = `insert into Note (Note, Date, AgentID) values ( ?, ?, ?)`;
  const values = [note, new Date(), agentID];
  try {
    const result = await db(query, values);
    // console.log("Result: ", result);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting customer:", error);
    return NextResponse.json(
      { error: "Failed to insert customer" },
      { status: 500 }
    );
  }
}

async function createScreenShot(screenShot, transactionsID) {
  console.log(transactionsID + "  " + screenShot);

  const screenShotLink = screenShot.map(async (item) => {
    const query = `insert into ScreenShot (TransactionID , ScreenShotLink) values ( ?, ?)`;
    const key = item.key;
    const values = [transactionsID, key];

    try {
      const result = await db(query, values);
      console.log("result " + result);
      return result.insertId;
    } catch (error) {
      console.error("Error inserting ScreenShot:", error);
      return;
    }
  });
  return Promise.all(screenShotLink);
}

export async function POST(req) {
  try {
    let json = await req.json();

    let {
      customerName,
      customerEmail,
      agentId,
      supportRegionId,
      manyChatId,
      contactLink,
      amount,
      month,
      note,
      walletId,
      screenShot,
      expireDate,
      cardId,
    } = json;
    month = parseInt(month);
    console.log(json);

    if (expireDate) {
      expireDate = new Date(expireDate);
    }

    if (!screenShot) {
      return NextResponse.json(
        { error: "You need to provide a screenshot" },
        { status: 400 }
      );
    }
    const customerId = await InsertCustomer(
      customerName,
      customerEmail,
      agentId,
      manyChatId,
      contactLink,
      expireDate,
      cardId,
      month
    );
    console.log("customerId: ", customerId);

    const noteId = await createNote(note, agentId);
    console.log("noteId: ", noteId);

    let nextHopeFuelID = await maxHopeFuelID();
    console.log("nextHopeFuelID", nextHopeFuelID);

    await InsertSubscription(customerId, month);

    if (nextHopeFuelID === null) {
      nextHopeFuelID = 0;
    }
    nextHopeFuelID++;
    console.log("Incremented maxHopeFuelID:", nextHopeFuelID);
    let timeZone = "Asia/Bangkok";
    let transactionDateWithThailandTimeZone = moment()
      .tz(timeZone)
      .format("YYYY-MM-DD HH:mm:ss");
    const query = `
     INSERT INTO Transactions   
    (CustomerID, Amount, SupportRegionID, WalletID, TransactionDate, NoteID, Month, PaymentCheck, HopeFuelID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      customerId,
      amount,
      supportRegionId,
      walletId,
      transactionDateWithThailandTimeZone,
      noteId,
      month,
      false,
      nextHopeFuelID,
    ];
    const result = await db(query, values);

    const transactionId = result.insertId;
    console.log("Transaction ID " + transactionId);

    // create the status of the form
    let queryStatus = `INSERT INTO FormStatus (TransactionID, TransactionStatusID) VALUES (?, ?)`;
    const valueStatus = [transactionId, 1];
    try {
      let result = await db(queryStatus, valueStatus);
    } catch (error) {
      console.error("Error inserting FormStatus:", error);
      return NextResponse.json(
        { error: "Failed to insert FormStatus" },
        { status: 500 }
      );
    }

    const screenShotIds = await createScreenShot(screenShot, transactionId);
    console.log("Screenshot ids are: " + screenShotIds);
    console.log("Result: ", result);

    await db(
      `INSERT INTO TransactionAgent (
          TransactionID, AgentID, LogDate
      ) VALUES (?, ?, ?)`,
      [transactionId, agentId, transactionDateWithThailandTimeZone]
    );
    return Response.json({ status: "success" });
  } catch (error) {
    console.log(error);
  }
}
