import { NextResponse } from "next/server";
import db from "../../utilites/db"; 

async function fetchCustomers(limit,offset) {
    const query = `SELECT CustomerId, Name, Email, ManyChatId FROM Customer LIMIT ? OFFSET ?`;
    const values =[limit, offset];
  try {

    const result = await db(query, values);
    console.log("result from DB: ", result);
    return result;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("[DB] Error fetching customers:");
  }
}
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  try {
   
    const  [{total}] = await db(`SELECT COUNT(*) AS total FROM Customer`);
   // console.log("totalPages::", total);


    const customers = await fetchCustomers(limit, offset);

    return NextResponse.json({
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      customers,
    },
    {status: 200});

  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
