export const dynamic = "force-dynamic"; // defaults to force-static
import moment from "moment-timezone";
import { NextResponse } from "next/server";
import calculateExpireDate from "../../utilites/calculateExpireDate";
import db from "../../utilites/db";
import maxHopeFuelID from "../../utilites/maxHopeFuelID.js";
import prisma from "../../utilites/prisma";

async function createScreenShot(screenShot, transactionsID) {
  const screenShotLink = screenShot.map(async (item) => {
    const query = `insert into ScreenShot (TransactionID , ScreenShotLink) values ( ?, ?)`;
    const key = item.key;
    const values = [transactionsID, key];

    try {
      const result = await db(query, values);
      return result.insertId;
    } catch (error) {
      return;
    }
  });
  return Promise.all(screenShotLink);
}

async function InsertSubscription(customerId, month) {
  const currentDate = new Date();
  try {
    const subscription = await prisma.subscription.create({
      data: {
        CustomerID: customerId,
        StartDate: currentDate,
        EndDate: calculateExpireDate(currentDate, month, true),
      },
    });
    return subscription.SubscriptionID;
  } catch (error) {}
}

export async function POST(request) {
  const obj = await request.json();

  if (!obj["screenShot"]) {
    return NextResponse.json(
      { error: "You need to provide a screenshot" },
      { status: 400 }
    );
  }

  let [result] = await db(
    "Select ExpireDate from Customer where CustomerID=?",
    [obj["customerId"]]
  );

  let nextExpireDate = null;

  if (result["ExpireDate"]) {
    let currentExpireDate = new Date(result["ExpireDate"]);

    let lastDayOfthisMonth = calculateExpireDate(new Date(), 0, 0);

    let isEedCurrent =
      currentExpireDate.getTime() >= lastDayOfthisMonth.getTime();

    if (isEedCurrent) {
      nextExpireDate = calculateExpireDate(
        currentExpireDate,
        parseInt(obj["month"]),
        !isEedCurrent
      );
    } else {
      nextExpireDate = calculateExpireDate(
        new Date(),
        parseInt(obj["month"]),
        !isEedCurrent
      );
    }
  } else {
    nextExpireDate = calculateExpireDate(
      result["ExpireDate"],
      parseInt(obj["month"]),
      false
    );
  }

  let nextHopeFuelID = await maxHopeFuelID();

  if (nextHopeFuelID === null) {
    nextHopeFuelID = 0;
  }
  nextHopeFuelID++;

  let timeZone = "Asia/Bangkok";
  let transactionDateWithThailandTimeZone = moment()
    .tz(timeZone)
    .format("YYYY-MM-DD HH:mm:ss");
  const rows = await db(
    "INSERT INTO Transactions (CustomerID, SupportRegionID, WalletID, Amount, PaymentCheck, PaymentCheckTime, NoteID, TransactionDate, PaymentDenied, Month, HopeFuelID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
    [
      obj["customerId"],
      obj["supportRegionId"],
      obj["walletId"],
      obj["amount"],
      false,
      null,
      obj["noteId"],
      transactionDateWithThailandTimeZone,
      false,
      obj["month"],
      nextHopeFuelID,
    ]
  );
  const transactionId = rows.insertId;

  // create the status of the form
  const query = `INSERT INTO FormStatus (TransactionID, TransactionStatusID) VALUES (?, ?)`;
  const values = [transactionId, 1];
  try {
    let result = await db(query, values);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to insert FormStatus" },
      { status: 500 }
    );
  }

  // //update the expire date
  const value = [
    nextExpireDate,
    obj["manyChatId"],
    obj["agentId"],
    obj["countryId"],
    obj["customerId"],
  ];

  const sql = `UPDATE Customer 
                SET ExpireDate = ?, ManyChatId = ? ,AgentId = ?, UserCountry = ?
                WHERE CustomerID = ?`;
  try {
    let result = await db(sql, value);

    let timeZone = "Asia/Bangkok";
    let transactionDateWithThailandTimeZone = moment()
      .tz(timeZone)
      .format("YYYY-MM-DD HH:mm:ss");
    await db(
      `INSERT INTO TransactionAgent (
          TransactionID, AgentID, LogDate
      ) VALUES (?, ?, ?)`,
      [transactionId, obj["agentId"], transactionDateWithThailandTimeZone]
    );

    await InsertSubscription(obj["customerId"], obj["month"]);

    const screenShotIds = await createScreenShot(
      obj["screenShot"],
      transactionId
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to insert customer" },
      { status: 500 }
    );
  }
}
