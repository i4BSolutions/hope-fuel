import { NextResponse } from "next/server";
import db from "../../../utilites/db";

async function fetchFundraisers(limit, offset) {
  const query = `SELECT * FROM Fundraiser LIMIT ? OFFSET ?`;
  const values = [`${limit}`, `${offset}`];

  try {
    const result = await db(query, values);
    console.log("result from DB: ", result);
    return result;
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    throw new Error("[DB] Error fetching fundraisers:");
  }
}



export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  try {
    const [{ total }] = await db(`SELECT COUNT(*) AS total FROM Fundraiser`);

    const fundraisers = await fetchFundraisers(limit, offset);
    return NextResponse.json(
      {
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        fundraisers,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
