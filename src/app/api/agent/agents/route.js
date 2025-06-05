import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      select: {
        AgentId: true,
        Username: true,
        UserRoleId: true,
      },
    });

    const rawDbInfo = await prisma.$queryRawUnsafe(`
  SELECT DATABASE() as db, VERSION() as version
`);

    console.log("Connected to DB:", rawDbInfo);
    console.log("DATABASE_URL at runtime:", process.env.DATABASE_URL);

    return NextResponse.json({
      status: 200,
      message: "Agents retrieve successfully.",
      data: agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
