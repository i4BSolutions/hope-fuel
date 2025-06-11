export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      select: {
        AgentId: true,
        Username: true,
        UserRoleId: true,
        UserRole: {
          select: {
            UserRole: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Agents retrieved successfully.",
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
