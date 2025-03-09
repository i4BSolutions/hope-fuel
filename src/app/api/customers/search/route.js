import { NextResponse } from "next/server";
import db from "../../../utilites/db";

async function SearchCustomers(searchTerm){


    const query = `SELECT c.* ,t.HopeFuelID
    FROM Customer c
    LEFT JOIN Transactions t ON c.CustomerId = t.CustomerID
    WHERE 
    c.Name LIKE CONCAT('%', ?, '%') 
    OR c.Email LIKE CONCAT('%', ?, '%') 
    OR t.HopeFuelID LIKE CONCAT('%', ?, '%') 
    OR c.CardID LIKE CONCAT('%', ?, '%') 
    OR c.ManyChatId LIKE CONCAT('%', ?, '%') 
`;
const values = [
  `${searchTerm}`,
  `${searchTerm}`,
  `${searchTerm}`,
  `${searchTerm}`,
  `${searchTerm}`];

    try{
        console.log("Query:",query);
        const result = await db(query, values);
        return result;

    }catch(error){
        console.error("Error fetching customers:", error);
        throw new Error("[DB] Error fetching customers");

    }
}

export async function GET(req){
    const searchTerm = new URL(req.url).searchParams.get("term");

    if(!searchTerm){
        return NextResponse.json(
            { message: "Missing search term" },
            { status: 400 }
          );
    }
    
    try{
        const customers = await SearchCustomers(searchTerm);
        return NextResponse.json({
            result: customers
        }, {status: 200});
    }
    catch(error){
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
    }

}