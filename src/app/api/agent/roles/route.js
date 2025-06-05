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

    console.log("Received updates:", JSON.stringify(updates, null, 2));

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 }
      );
    }

    const validUpdates = updates.filter((update) => {
      const isValid = update.agentId && typeof update.agentId === "number";
      if (!isValid) {
        console.log("Invalid update:", update);
      }
      return isValid;
    });

    console.log("Valid updates:", JSON.stringify(validUpdates, null, 2));

    const updatePromises = validUpdates.map(async ({ agentId, userRoleId }) => {
      const parsedRoleId =
        userRoleId === null || userRoleId === "" ? null : Number(userRoleId);
      console.log(`Updating agent ${agentId} with role ${userRoleId}`);

      if (parsedRoleId !== null && isNaN(parsedRoleId)) {
        throw new Error(`Invalid userRoleId value: ${userRoleId}`);
      }

      const result = await prisma.agent.update({
        where: { AgentId: agentId },
        data: {
          UserRoleId: parsedRoleId,
        },
      });

      console.log(`Updated agent ${agentId}:`, result);
      return result;
    });

    const results = await Promise.all(updatePromises);
    console.log("All updates completed:", results);

    return NextResponse.json({
      success: true,
      message: "Roles updated successfully.",
      updatedCount: results.length,
    });
  } catch (error) {
    console.error("Error updating agent roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
