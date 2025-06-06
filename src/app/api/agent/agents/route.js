import { NextResponse } from "next/server";
import db from "../../../utilites/db";

export async function GET() {
  try {
    const agents = await db("SELECT AgentId, Username, UserRoleId FROM Agent");

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
