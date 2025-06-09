// input : awsId
// output: {data: {AgentID: .. , AWSID: ... ,UserRoleID: }}

import { NextResponse } from "next/server";
import db from "../../utilites/db";

export const dynamic = "force-dynamic";

async function getAgent(awsId) {
  const query = `SELECT 
    Agent.AgentId,
    Agent.AwsId,
    Agent.UserRoleId,
    UserRole.UserRole
FROM 
    Agent
JOIN 
    UserRole
ON 
    Agent.UserRoleId = UserRole.UserRoleID
WHERE 
    Agent.AwsId = ?;`;

  const values = [awsId];
  try {
    const result = await db(query, values);
    console.log(result);
    console.log("Agent information:", result[0]);
    return result[0]; //return AgentId
  } catch (error) {
    console.error("[DB] Error getting agent in DB:", error);
    throw error;
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const awsId = url.searchParams.get("awsId");

    const result = await getAgent(awsId);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[Error] Cannot get agentUser", error);
    return NextResponse.json(
      { error: "Cannot get agentUser" },
      { status: 500 }
    );
  }
}
