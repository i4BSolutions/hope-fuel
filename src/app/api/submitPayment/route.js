import moment from "moment-timezone";
import { NextResponse } from "next/server";
import calculateExpireDate from "../../utilites/calculateExpireDate";
import db from "../../utilites/db";
import prisma from "../../utilites/prisma";

const minimumAmounts = [
  { currencyCode: "USD", amount: 20 },
  { currencyCode: "MMK", amount: 30000 },
  { currencyCode: "THB", amount: 300 },
];

//Insert Into Customer Table
async function InsertCustomer(
  customerName,
  customerEmail,
  agentId,
  manyChatId,
  countryId,
  contactLink,
  month
) {
  let currentDay = new Date();
  let nextExpireDate = calculateExpireDate(currentDay, month, true);
  const query = `
    INSERT INTO Customer (Name, Email, AgentID, ManyChatID, UserCountry, ContactLink, ExpireDate ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  const values = [
    customerName,
    customerEmail,
    agentId,
    manyChatId,
    countryId,
    contactLink,
    nextExpireDate,
  ];

  try {
    const result = await db(query, values);
    return result.insertId; // Retrieve the inserted customer ID
  } catch (error) {
    console.error("Error inserting customer:", error);
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
    console.error("Error inserting note:", error);
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

  console.log(
    "From createScreenshotDB: with TransactionID" +
      transactionsID +
      " and  screenshot" +
      screenShot
  );

  const screenShotLink = screenShot.map(async (item) => {
    const query = `insert into ScreenShot (TransactionID , ScreenShotLink) values ( ?, ?)`;

    const key = item.key;
    const values = [transactionsID, key];

    try {
      const result = await db(query, values);
      return result.insertId;
    } catch (error) {
      console.error("Error inserting screenshot:", error);
      throw new Error("Failed to insert screenshot");
    }
  });
  return Promise.all(screenShotLink);
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
    console.log("result " + result);
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

  console.log(result);
  return result[0]["maxHopeFuelID"];
}

// get currency by wallet ID
async function getCurrencyByWalletId(walletId) {
  console.log("Wallet ID: ", walletId);
  const query = `
    SELECT 
      C.CurrencyId, C.CurrencyCode
    FROM 
      Wallet AS W
    JOIN 
      Currency AS C 
    ON
      W.CurrencyId = C.CurrencyId
    WHERE
      W.WalletId = ?;
  `;

  const values = [walletId];

  try {
    const result = await db(query, values);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error("[DB] Error getting currency by wallet ID");
  }
}

// get exchange rate by currency ID
async function getExchangeRateByCurrencyId(currencyId) {
  console.log("Currency ID: ", currencyId);
  const query = `
    SELECT
      *
    FROM
      ExchangeRates
    WHERE
      CurrencyId = ?;
  `;

  const values = [currencyId];

  try {
    const result = await db(query, values);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error("[DB] Error getting exchange rate by currency ID");
  }
}

function getMinimumAmountByCurrencyCode(currencyCode) {
  const minimumAmount = minimumAmounts.find(
    (item) => item.currencyCode === currencyCode
  );

  return minimumAmount ? minimumAmount.amount : 20;
}

function convertCurrency(amount, exchangeRate) {
  return amount / exchangeRate;
}

async function checkMinimumAmount(amount, month, currencyId, currencyCode) {
  let minimumAmountData = getMinimumAmountByCurrencyCode(currencyCode);

  const minimumAmountByMonth = minimumAmountData * month;

  console.log("Minimum amount by month: ", minimumAmountByMonth);

  // If currency is NOT MMK, THB, or USD, convert amount to USD before comparison
  if (
    currencyCode !== "MMK" &&
    currencyCode !== "THB" &&
    currencyCode !== "USD"
  ) {
    const exchangeRateData = await getExchangeRateByCurrencyId(currencyId);

    if (!exchangeRateData) {
      throw new Error("Exchange rate data not found");
    }

    const convertedAmount = convertCurrency(
      amount,
      exchangeRateData.ExchangeRate
    );
    return convertedAmount >= minimumAmountByMonth;
  }

  return amount >= minimumAmountByMonth;
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
      customerName,
      customerEmail,
      agentId,
      supportRegionId,
      manyChatId,
      countryId,
      contactLink,
      amount,
      month,
      note,
      walletId,
      screenShot,
    } = json;

    // Fetch currency by wallet ID
    const currency = await getCurrencyByWalletId(walletId);

    if (!currency) {
      return NextResponse.json(
        { error: "Currency not found" },
        { status: 404 }
      );
    }

    // Check if the amount is above the minimum requirement
    const isAmountValid = await checkMinimumAmount(
      amount,
      month,
      currency.CurrencyId,
      currency.CurrencyCode
    );

    if (!isAmountValid) {
      return NextResponse.json(
        {
          error: `Amount is less than the required minimum ${currency.CurrencyCode} for ${month} month(s).`,
        },
        { status: 400 }
      );
    }

    month = parseInt(month);

    if (!screenShot || screenShot.length === 0) {
      return NextResponse.json(
        { error: "You need to provide a screenshot" },
        { status: 400 }
      );
    }

    if (contactLink.trim() === "") {
      contactLink = null;
    }

    let noteId = null;
    noteId = await createNote(note, agentId);

    // if (note && note !== "") {
    // }

    const customerId = await InsertCustomer(
      customerName,
      customerEmail,
      agentId,
      manyChatId,
      countryId,
      contactLink,
      month
    );

    let nextHopeFuelID = await maxHopeFuelID();
    console.log("nextHopeFuelID", nextHopeFuelID);

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
      amount,
      supportRegionId,
      walletId,
      transactionDateWithThailandTimeZone,
      noteId,
      month,
      nextHopeFuelID,
    ];
    const result = await db(query, values);

    const subscriptionId = await InsertSubscription(customerId, month);
    const transactionId = result.insertId;
    const formStatusId = await InsertFormStatus(transactionId);
    const screenShotIds = await createScreenShot(screenShot, transactionId);
    const logId = await InsertTransactionLog(transactionId, agentId);

    return NextResponse.json({
      status: "success",
      transactionId,
      screenShotIds,
      formStatusId,
      subscriptionId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
