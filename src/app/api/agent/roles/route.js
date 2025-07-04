import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET() {
  try {
    const roles = await prisma.userRole.findMany({
      select: {
        UserRoleID: true,
        UserRole: true,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Roles fetched successfully.",
      data: roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const updates = await req.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid payload format", success: false },
        { status: 400 }
      );
    }

    const validUpdates = updates.filter((update) => {
      return update.agentId && typeof update.agentId === "number";
    });

    const updateResults = await Promise.all(
      validUpdates.map(async ({ agentId, userRoleId }) => {
        try {
          return await prisma.agent.update({
            where: { AgentId: agentId },
            data: { UserRoleId: userRoleId },
            select: {
              AgentId: true,
              Username: true,
              UserRoleId: true,
              UserRole: {
                select: { UserRole: true },
              },
            },
          });
        } catch (error) {
          console.error(`Failed to update agent ${agentId}:`, error);
          return null;
        }
      })
    );

    const results = updateResults.filter((result) => result !== null);

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No agents were updated successfully",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Roles updated successfully.",
      updatedCount: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error updating agent roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
