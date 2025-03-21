import { NextResponse } from "next/server";
import db from "../../../utilites/db";

 async function FetchAllCurrenciesCode() {
  const query = `SELECT CurrencyCode FROM Currency`;
  try {
    const result = await db(query);
    return result;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw new Error("[DB] Error fetching currencies:");
  }
}

export async function GET(){

    const currencies = await FetchAllCurrenciesCode();
    
    return NextResponse.json({
    status: 200,
    message: "success",
    data: currencies
    },{
        status:200});
}
