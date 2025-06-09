import { NextResponse } from "next/server";
import db from "../../utilites/db";

async function fetchCountries() {
  const query = `SELECT BaseCountryID,BaseCountryName from BaseCountry`;

  try {
    const result = await db(query);
    return result;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw new Error("[DB] Error fetching countries:");
  }
}

export async function GET(req) {
  try {
    const countries = await fetchCountries();
    return NextResponse.json(
      {
        status: 200,
        message: "Countries fetched successfully",
        Countries: countries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
