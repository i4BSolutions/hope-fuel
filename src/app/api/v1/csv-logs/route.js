import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const {
      AgentId,
      CSVExportTransactionDateTime,
      CSVExportTransactionFileName,
      StartDate,
      EndDate,
      TransactionIDs,
    } = requestBody;

    await prisma.FormStatus.updateMany({
      where: {
        TransactionID: {
          in: TransactionIDs,
        },
      },
      data: {
        TransactionStatusID: 3,
      },
    });

    const data = await prisma.CSVExportTransactionLogs.create({
      data: {
        AgentId,
        CSVExportTransactionDateTime: new Date(CSVExportTransactionDateTime),
        CSVExportTransactionFileName,
        FromDate: new Date(StartDate),
        ToDate: new Date(EndDate),
      },
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error(
      "Error in POST /api/v1/transactions/export-confirm-payments",
      error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const logs = await prisma.CSVExportTransactionLogs.findMany();
    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/v1/csv-logs", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
