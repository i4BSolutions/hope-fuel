import { NextResponse } from "next/server";
import db from "../../utilites/db"; 

export async function FormVisibility(AgentId, IsFormOpen) {
  const query = `INSERT INTO FormVisibilityStatus (AgentId, IsFormOpen, FormTimeStamp)
                 VALUES (?, ?, NOW());`;
  const values = [AgentId, IsFormOpen];

  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function fetchFormVisibilityStatus() {
  const query = `SELECT * FROM FormVisibilityStatus ORDER BY FormTimeStamp DESC`;

  try {
    const results = await db(query);
    console.log("Result from fetchFormVisibilityStatus:", results);
     if (!results.length) {
       return [];
     }
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function POST(req) {
  try {
    const { AgentId, IsFormOpen } = await req.json();

    // Ensure required fields exist
    if (!AgentId || IsFormOpen === undefined) {
      return NextResponse.json({
        status: 400,
        message: "Missing required fields: AgentId or IsFormOpen",
      });
    }

   
    const isFormOpen =
      IsFormOpen === "true"
        ? true
        : IsFormOpen === "false"
        ? false
        : IsFormOpen;

   
    await FormVisibility(AgentId, isFormOpen);

    return NextResponse.json({
      status: 200,
      message: "Form Visibility status updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: `Internal Server Error: ${error.message}`,
    });
  }
}


export async function GET() {
  try {
    const results = await fetchFormVisibilityStatus();

    if (!results.length) {
      return NextResponse.json({ status: 404, message: "No data found" });
    }

    return NextResponse.json({ status: 200, data: results }); 
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: `Internal Server Error: ${error.message}`,
    });
  }
}

