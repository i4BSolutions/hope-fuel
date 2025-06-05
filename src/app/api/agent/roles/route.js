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

export async function PUT(req) {
  try {
    const updates = await req.json();

    if (req.method !== "PUT") {
      res.setHeader("Allow", ["PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 }
      );
    }

    const updatePromises = updates.map(({ agentId, userRoleId }) =>
      prisma.agent.update({
        where: { AgentId: agentId },
        data: { UserRoleId: userRoleId ?? null },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Roles updated successfully.",
    });
  } catch (error) {
    console.error("Error updating agent roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
