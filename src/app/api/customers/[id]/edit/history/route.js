import { NextResponse } from "next/server";
import db from "../../../../../utilites/db";

export async function EditHistoryByCustomerId(id) {
 const query = `
 SELECT 
    c.LogId,
    c.ChangeDate AS timestamp,
    a.AwsId AS editedBy,
    c.FieldChanged,
    c.NewValue,
    c.OldValue
FROM CustomerAuditLogs c
JOIN Agent a ON c.AgentId = a.AgentId
WHERE c.CustomerId = ?
ORDER BY c.ChangeDate DESC;`;
    const values = [id];

    try{
        const rows = await db(query, values);
        return rows;

    }catch(e){
        console.log(e);
        throw new Error("Error in EditHistoryByCustomerId query");
    }
}


export async function GET(req, { params }) {
 

  if (!params || !params.id) {
    return NextResponse.json(
      { message: "Missing customer ID in request" },
      { status: 400 }
    );
  }

  const { id } = params;
  try {
    const result = await EditHistoryByCustomerId(id);
    return NextResponse.json({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching edit history:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

