import { NextResponse } from "next/server";
import db from "../../utilites/db";
import moment from "moment-timezone";
import prisma from "../../utilites/prisma";
import { addMonths, lastDayOfMonth, parseISO, format } from "date-fns";

/**
 * Calculate new expiration date based on business logic.
 */
function calculateNewExpiryDate(
  existingExpiry,
  currentDate,
  subscriptionMonths
) {
  const existingExpiryDate = parseISO(existingExpiry);
  const lastDayOfCurrentMonth = lastDayOfMonth(currentDate);

  const targetDate =
    existingExpiryDate >= lastDayOfCurrentMonth
      ? addMonths(existingExpiryDate, subscriptionMonths)
      : addMonths(currentDate, subscriptionMonths - 1);

  return format(lastDayOfMonth(targetDate), "yyyy-MM-dd");
}

/**
 * Query MySQL for customer info and check Airtable presence.
 */
async function checkUserInAirtable(transactionId) {
  const query = `
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

  const [{ CustomerName, CustomerEmail }] = await db(query, [transactionId]);

  if (!CustomerName || !CustomerEmail) {
    throw new Error("Customer name or email not found.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkUser`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: CustomerName, email: CustomerEmail }),
    }
  );

  if (!response.ok) {
    throw new Error(`Airtable check failed: ${response.status}`);
  }

  return await response.json();
}

/**
 * Recalculate expiration date based on transaction history.
 */
async function recalculateExpireDate(transactionId) {
  const transaction = await prisma.Transactions.findFirst({
    where: { TransactionID: transactionId },
    select: { CustomerID: true },
  });

  if (!transaction?.CustomerID) {
    throw new Error("Customer not found.");
  }

  const history = await prisma.Transactions.findMany({
    where: { CustomerID: transaction.CustomerID },
    select: { TransactionDate: true, Month: true },
    orderBy: { TransactionDate: "desc" },
  });

  const airtableResult = await checkUserInAirtable(transactionId);

  let expireDate = airtableResult.message
    ? airtableResult["expire_date"][0]
    : null;

  const refDate = history[1]?.TransactionDate;
  const months = history[1]?.Month;

  if (!refDate || !months) {
    throw new Error("Not enough transaction data.");
  }

  return calculateNewExpiryDate(expireDate, refDate, months);
}

/**
 * Update the customer’s expiration date.
 */
async function updateExpireDate(customerId, date) {
  await prisma.customer.update({
    where: { CustomerId: customerId },
    data: { ExpireDate: date ?? null },
  });
}

/**
 * Log denial and update transaction status.
 */
async function handlePaymentDenial(transactionId, agentId) {
  const timeZone = "Asia/Bangkok";
  const transactionDateWithThailandTimeZone = moment()
    .tz(timeZone)
    .format("YYYY-MM-DD HH:mm:ss");

  // 1. Update FormStatus
  const updateFormStatusQuery = `
    UPDATE FormStatus
    SET TransactionStatusID = ?
    WHERE TransactionID = ?;
  `;
  await db(updateFormStatusQuery, [4, transactionId]);

  // 2. Insert into TransactionAgent
  const insertTransactionAgentQuery = `
    INSERT INTO TransactionAgent (TransactionID, AgentID, LogDate)
    VALUES (?, ?, ?);
  `;
  await db(insertTransactionAgentQuery, [
    transactionId,
    agentId,
    transactionDateWithThailandTimeZone,
  ]);

  // 3. Update Transactions
  const updateTransactionQuery = `
    UPDATE Transactions
    SET PaymentDenied = ?, PaymentCheckTime = ?, PaymentCheck = ?
    WHERE TransactionID = ?;
  `;
  await db(updateTransactionQuery, [
    true,
    transactionDateWithThailandTimeZone,
    true,
    transactionId,
  ]);
}

/**
 * Main request handler
 */
export async function POST(req) {
  const { transactionId, agentId } = await req.json();

  const transaction = await prisma.Transactions.findFirst({
    where: { TransactionID: transactionId },
    include: { Customer: true },
  });

  if (!transaction?.Customer) {
    return NextResponse.json(
      { error: "Transaction or customer not found." },
      { status: 400 }
    );
  }

  const customerId = transaction.Customer.CustomerId;

  try {
    const count = await prisma.Transactions.count({
      where: { CustomerID: customerId, PaymentDenied: false },
    });

    let isOldUser = count > 1;

    if (!isOldUser) {
      const airtable = await checkUserInAirtable(transactionId);
      isOldUser = airtable.message === true;
    }

    await handlePaymentDenial(transactionId, agentId);

    const expireDate = isOldUser
      ? new Date(await recalculateExpireDate(transactionId))
      : null;

    await updateExpireDate(customerId, expireDate);

    return NextResponse.json({
      status: 200,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error("POST /payment-denial error:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
