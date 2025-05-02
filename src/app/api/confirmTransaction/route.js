import { NextResponse } from "next/server";
import db from "../../utilites/db";
import moment from "moment-timezone";

// Handle POST request to update payment status
export async function POST(req) {
  try {
    const json = await req.json();
    console.log("RequestBody from Confirm payment:", json);
    const { transactionId, agentId } = json;

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
    const formStatusValue = [2, transactionId];

    const transactionAgentValue = [
      transactionId,
      agentId,
      transactionDateWithThailandTimeZone,
    ];

    const transactionPaymentDeniedValue = [
      0,
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

    // Return success response
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
