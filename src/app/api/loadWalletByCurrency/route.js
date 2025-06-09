import { NextResponse } from "next/server";
import db from "../../utilites/db";

export const dynamic = "force-dynamic";

async function loadWallet(currencyCode) {
  const query = `
  SELECT Wallet.WalletID, Wallet.WalletName 
  FROM Wallet 
  JOIN Currency ON Wallet.CurrencyID = Currency.CurrencyID 
  WHERE Currency.CurrencyCode = ?
`;
  const values= [currencyCode];
  try {
    const result = await db(query,values);
    console.log("Result for available wallet for currency ", result);
    return result;
  } catch (error) {
    console.error(
      "[DB] Can't show all available wallet for currency From DB Query:",
      error
    );
    throw error;
  }
}

async function loadAllWallets() {
  const query = `
 Select WalletName from Wallet;
`;

  try {
    const result = await db(query);
    console.log("Result for available wallet in DB", result);
    return result;
  } catch (error) {
    console.error(
      "[DB] Can't show all available wallet From DB Query:",
      error
    );
    throw error;
  }
}


export async function GET(req) {
  try {
    const url = new URL(req.url);
   
    const currencyCode = url.searchParams.get("currencyCode");
     let data;

     if (currencyCode) {
       // Fetch wallets filtered by currencyCode
       data = await loadWallet(currencyCode);
       if (data.length === 0) {
         return NextResponse.json(
           { message: `No wallets found for currency code: ${currencyCode}` },
           { status: 404 }
         );
       }
     } else {
       // If currencyCode is not provided, return all wallets
       data = await loadAllWallets();
       if (data.length === 0) {
         return NextResponse.json(
           { message: "No wallets available in the database" },
           { status: 404 }
         );
       }
     }
   
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Error] Cannot load existing wallet", error);
    return NextResponse.json(
      { error: "Cannot load existing wallet" },
      { status: 500 }
    );
  }
}