import { NextResponse } from "next/server";
import db from "../../utilites/db";
import moment from "moment-timezone";

import { addMonths, lastDayOfMonth, parseISO, format } from "date-fns";

function calculateNewExpiryDate(EED, CM, SM) {
  console.log(EED);
  console.log(CM);
  const existingExpiryDate = parseISO(EED); // Convert EED (Existing Expiry Date) to Date object

  const subscriptionMonths = SM; // Subscription Months

  // Get the last day of the current month
  const lastDayOfCurrentMonth = lastDayOfMonth(CM);

  let newExpiryDate; // Initialize NED (New Expiry Date)

  // Check if EED >= Last Day of CM
  if (existingExpiryDate >= lastDayOfCurrentMonth) {
    // EED is current: NED = Last day of (Month of EED + SM)
    const targetDate = addMonths(existingExpiryDate, subscriptionMonths);
    newExpiryDate = lastDayOfMonth(targetDate);
  } else {
    // EED has expired: NED = Last day of (CM + SM - 1)
    const targetDate = addMonths(CM, subscriptionMonths - 1);
    newExpiryDate = lastDayOfMonth(targetDate);
  }

  // Format the result as YYYY-MM-DD
  return format(newExpiryDate, "yyyy-MM-dd");
}

async function checkUserInAirtable(transactionId) {
  try {
    // Step 1: Fetch Customer Name and Email based on TransactionID
    const nameAndEmailQuery = `
      SELECT 
          C.Name AS CustomerName,
          C.Email AS CustomerEmail
      FROM 
          Transactions T
      JOIN 
          Customer C ON T.CustomerID = C.CustomerId
      WHERE 
          T.TransactionID = ?;
    `;

    const nameAndEmailValue = [transactionId];

    const [{ CustomerName, CustomerEmail }] = await db(
      nameAndEmailQuery,
      nameAndEmailValue
    );

    if (!CustomerName || !CustomerEmail) {
      throw new Error(
        "Customer name or email not found for the transaction ID."
      );
    }

    // Step 2: Create Request Options
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: CustomerName, email: CustomerEmail }),
    };

    // Step 3: Check if User Exists in Airtable
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkUser`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Airtable API request failed with status ${response.status}`
      );
    }

    const result = await response.json();
    return result; // Return the Airtable result for further use
  } catch (error) {
    console.error("Error in checkUserInAirtable:", error.message);
    throw error; // Propagate the error for the caller to handle
  }
}

async function recalculateExpireDate(transactionId) {
  // get all mysql Transaction
  let allTransactionDateAndMonthQuery = ` 
    SELECT 
    T.TransactionDate,
    T.Month
FROM 
    Transactions T
WHERE 
    T.CustomerID = (SELECT CustomerID FROM Transactions WHERE TransactionID = ?)
    AND (T.PaymentDenied IS NULL OR T.PaymentDenied <> 1); -- Include NULL and exclude 1`;

  let allTransactionDateAndMonthValue = [transactionId];

  let allTransactionDateAndMonthResult = await db(
    allTransactionDateAndMonthQuery,
    allTransactionDateAndMonthValue
  );
  console.log(allTransactionDateAndMonthResult);

  // get the username and email of the user

  const result = await checkUserInAirtable(transactionId);

  if (result.message == false) {
    // use first transactionDate as starting point
    let expireDate = "1970-01-01";

    // start from the second one
    for (let i = 0; i < allTransactionDateAndMonthResult.length; i++) {
      let currentItem = allTransactionDateAndMonthResult[i];
      console.log(i);
      expireDate = calculateNewExpiryDate(
        expireDate,
        currentItem.TransactionDate,
        currentItem.Month
      );
    }
    console.log(expireDate);
    return expireDate;
  } else if (result.message == true) {
    console.log("Hello");
    // determine between airtable ExpireDate or first TransactionDate in mysql
    let [expireDate] = result["expire_date"];
    for (let i = 0; i < allTransactionDateAndMonthResult.length; i++) {
      let currentItem = allTransactionDateAndMonthResult[i];
      expireDate = calculateNewExpiryDate(
        expireDate,
        currentItem.TransactionDate,
        currentItem.Month
      );
    }
    console.log(expireDate);
    return expireDate;
  }

  // (airtable ExpireDate ) >= last Day of ( first transaction Date in MySQL) => use ( airtable ExpireDate)
  // (airtable ExpireDate ) < last Day of ( first transaction Date in MySQL)  => use last Day of ( first transaction Date in MySQL)
}

async function updateDatabase(newExpireDate, transactionId, agentId) {
  // SQL queries
  const updateFormStatusQuery = `
      UPDATE FormStatus
      SET TransactionStatusID = ?
      WHERE TransactionID = ?;
    `;

  const updateTransactionAgentQuery = `INSERT INTO TransactionAgent (TransactionID, AgentID, LogDate)
    VALUES (?, ?, ?);`;

  const updateTransactionPaymentDenied = `UPDATE Transactions
    SET PaymentDenied = ?,
    PaymentCheckTime = ?,
    PaymentCheck = ?
    WHERE TransactionID = ?;`;
  const updateExpireDate = `UPDATE Customer
SET ExpireDate = ?;`;
  let updateExpireDateValue;
  if (newExpireDate == null) {
    updateExpireDateValue = [null];
  } else {
    updateExpireDateValue = [newExpireDate];
  }

  // values
  let timeZone = "Asia/Bangkok";
  let transactionDateWithThailandTimeZone = moment()
    .tz(timeZone)
    .format("YYYY-MM-DD HH:mm:ss");
  const formStatusValue = [4, transactionId];

  const transactionAgentValue = [
    transactionId,
    agentId,
    transactionDateWithThailandTimeZone,
  ];

  const transactionPaymentDeniedValue = [
    1,
    transactionDateWithThailandTimeZone,
    1,
    transactionId,
  ];

  // Execute queries sequentially
  const formStatusResult = await db(updateFormStatusQuery, formStatusValue);
  const transactionAgentResult = await db(
    updateTransactionAgentQuery,
    transactionAgentValue
  );
  const transactionPaymentDeniedResult = await db(
    updateTransactionPaymentDenied,
    transactionPaymentDeniedValue
  );

  const updateExpireDateResult = await db(
    updateExpireDate,
    updateExpireDateValue
  );
}

export async function POST(req) {
  let isOldUser;
  try {
    const json = await req.json();
    console.log("RequestBody from Confirm payment:", json);
    const { transactionId, agentId } = json;

    // check if this is an old user or new user

    const oldOrNewUserCheckingQuery = `SELECT 
    COUNT(*) AS NotDeniedTransactionCount
FROM 
    Transactions T
JOIN 
    Customer C ON T.CustomerID = C.CustomerId
WHERE 
    C.CustomerId = (SELECT CustomerID FROM Transactions WHERE TransactionID = ?)
    AND T.PaymentDenied = 0;`;

    const oldOrNewUserCheckingValue = [transactionId];

    const oldOrNewUserCheckingResult = await db(
      oldOrNewUserCheckingQuery,
      oldOrNewUserCheckingValue
    );

    if (oldOrNewUserCheckingResult.length > 0) {
      let [result] = oldOrNewUserCheckingResult;
      let transactionCount = result.NotDeniedTransactionCount;

      // this is a new user if the user has more than 1 transaction that has not been denied
      if (transactionCount > 1) {
        isOldUser = true;
      } else {
        let airtableChecking = await checkUserInAirtable(transactionId);

        if (airtableChecking.message == true) {
          isOldUser = true;
        } else {
          isOldUser = false;
        }
      }
    } else {
      throw Error("This is wrong");
    }
    console.log(isOldUser);
    if (isOldUser) {
      await updateDatabaseWithoutExpireDate(transactionId, agentId);
      let expireDate = await recalculateExpireDate(transactionId);
      expireDate = new Date(expireDate);
      await updateDatabase(expireDate, transactionId, agentId);
      const updateExpireDate = `UPDATE Customer
  SET ExpireDate = ?;`;
      let updateExpireDateValue = [expireDate];

      const updateExpireDateResult = await db(
        updateExpireDate,
        updateExpireDateValue
      );
    } else {
      // new user got null expireDate because he/she don't has expireDate anymore
      const expireDate = null;
      await updateDatabase(expireDate, transactionId, agentId);
    }

    // SQL queries

    // // Return success response
    return NextResponse.json(
      { status: 200 },
      {
        message: "Payment status updated successfully",
      }
    );
  } catch (error) {
    console.error("[Error] Failed to update payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
async function updateDatabaseWithoutExpireDate(transactionId, agentId) {
  // SQL queries
  const updateFormStatusQuery = `
      UPDATE FormStatus
      SET TransactionStatusID = ?
      WHERE TransactionID = ?;
    `;

  const updateTransactionAgentQuery = `INSERT INTO TransactionAgent (TransactionID, AgentID, LogDate)
    VALUES (?, ?, ?);`;

  const updateTransactionPaymentDenied = `UPDATE Transactions
    SET PaymentDenied = ?,
    PaymentCheckTime = ?,
    PaymentCheck = ?
    WHERE TransactionID = ?;`;

  // values
  let timeZone = "Asia/Bangkok";
  let transactionDateWithThailandTimeZone = moment()
    .tz(timeZone)
    .format("YYYY-MM-DD HH:mm:ss");
  const formStatusValue = [4, transactionId];

  const transactionAgentValue = [
    transactionId,
    agentId,
    transactionDateWithThailandTimeZone,
  ];

  const transactionPaymentDeniedValue = [
    1,
    transactionDateWithThailandTimeZone,
    1,
    transactionId,
  ];

  // Execute queries sequentially
  const formStatusResult = await db(updateFormStatusQuery, formStatusValue);
  const transactionAgentResult = await db(
    updateTransactionAgentQuery,
    transactionAgentValue
  );
  const transactionPaymentDeniedResult = await db(
    updateTransactionPaymentDenied,
    transactionPaymentDeniedValue
  );
}
