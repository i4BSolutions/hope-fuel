import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET() {
  try {
    const logs = await prisma.CSVExportTransactionLogs.findMany({
      include: {
        Agent: {
          select: {
            AgentId: true,
            AwsId: true,
          },
        },
      },
      orderBy: {
        CSVExportTransactionDateTime: "desc",
      },
    });

    return NextResponse.json({
      status: 200,
      message: "CSV Export Transaction logs retrieve successfully.",
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching CSV export logs:", error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
