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
        { error: "Invalid payload format" },
        { status: 400 }
      );
    }

    const validUpdates = updates.filter((update) => {
      return update.agentId && typeof update.agentId === "number";
    });

    const updatePromises = validUpdates.map(async ({ agentId, userRoleId }) => {
      const parsedRoleId =
        userRoleId === null || userRoleId === "" ? null : Number(userRoleId);

      if (parsedRoleId !== null) {
        const role = await prisma.userRole.findUnique({
          where: { UserRoleID: parsedRoleId },
        });

        if (!role) {
          console.warn(
            `Skipping update for agent ${agentId}: role ${parsedRoleId} not found`
          );
          return null;
        }
      }

      const updated = await prisma.agent.update({
        where: { AgentId: agentId },
        data: {
          UserRoleId: parsedRoleId,
        },
      });

      return updated;
    });

    const results = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Roles updated successfully.",
      updatedCount: results.filter(Boolean).length,
    });
  } catch (error) {
    console.error("Error updating agent roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
