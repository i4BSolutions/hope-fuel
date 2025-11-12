// input : awsId
// output: {data: {AgentID: .. , AWSID: ... ,UserRoleID: }}

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import db from "../../utilites/db";

async function getCurrencies(awsId) {
  const query = `Select * FROM Currency`;

  try {
    const result = await db(query, []);
    return result; //return currencies
  } catch (error) {
    console.error("[DB] Error getting agent in DB:", error);
    throw error;
  }
}

export async function GET(req) {
  try {
    const result = await getCurrencies();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Error] Cannot get agentUser", error);
    return NextResponse.json(
      { error: "Cannot get agentUser" },
      { status: 500 }
    );
  }
}
