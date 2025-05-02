import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const {
      AgentId,
      CSVExportTransactionDateTime,
      CSVExportTransactionFileName,
    } = requestBody;

    const data = await prisma.CSVExportTransactionLogs.create({
      data: {
        AgentId,
        CSVExportTransactionDateTime: new Date(CSVExportTransactionDateTime),
        CSVExportTransactionFileName,
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
