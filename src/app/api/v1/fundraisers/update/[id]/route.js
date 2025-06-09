import { NextResponse } from "next/server";
import db from "../../../../../utilites/db";

async function GetBaseCountryID(BaseCountryName){
  const query = `SELECT BaseCountryID FROM BaseCountry WHERE BaseCountryName = ?`;
  const values = [BaseCountryName];
  try{
    const result = await db(query,values);
    return result;
  }
  catch(error){
    console.error("Error getting BaseCountryID:",error);
    throw new Error("[DB] Error getting BaseCountryID:");
  }

}
async function DeleteOldFundraiser_AcceptedCurrencies(id){
    const query = `DELETE FROM Fundraiser_AcceptedCurrencies WHERE FundraiserID = ?`;
    const values = [id];
    try{
        const result = await db(query,values);
        return result;
    }
    catch(error){
        console.error("Error deleting old Fundraiser_AcceptedCurrencies:",error);
        throw new Error("[DB] Error deleting old Fundraiser_AcceptedCurrencies:");
    }
}
async function CreateFundraiser_AcceptedCurrencies(FundraiserID,AcceptedCurrencies){
    for (const currency of AcceptedCurrencies){
        const [currencyID]= await db(`SELECT CurrencyId FROM Currency WHERE CurrencyCode = ?`,[currency]);
        if(!currencyID){
            throw new Error(`Currency ${currency} not found`);
        }else{
            await db(`INSERT INTO Fundraiser_AcceptedCurrencies(FundraiserID,CurrencyID) VALUES (?,?)`,[FundraiserID,currencyID.CurrencyId]);
        }

    }

}
async function DeleteOldFundraiser_ContactLinks(id){
    const query = `DELETE FROM Fundraiser_ContactLinks WHERE FundraiserID = ?`;
    const values = [id];
    try{
        const result = await db(query,values);
        return result;
    }
    catch(error){
        console.error("Error deleting old Fundraiser_ContactLinks:",error);
        throw new Error("[DB] Error deleting old Fundraiser_ContactLinks:");
    }
}
async function CreateFundraiser_ContactLinks(FundraiserID,ContactLinks){
    for (const link of ContactLinks){
        const safeUrl = link.url ?? "";
        const [platformID] = await db(`SELECT PlatformID FROM Platform WHERE PlatformName = ?`,[link.platform]);
        if(!platformID){
            throw new Error(`Platform ${link.PlatformName} not found`);
        }else{
            await db(`INSERT INTO Fundraiser_ContactLinks(FundraiserID,PlatformID,ContactURL) VALUES (?,?,?)`,[FundraiserID,platformID.PlatformID,safeUrl]);
        }

    }

}
async function UpdateFundraiser(fundraiserID,data){
  const BaseCountryName = data.BaseCountryName;
  const DBBaseCountryName = await GetBaseCountryID(BaseCountryName);
    if(!DBBaseCountryName){ 
        throw new Error(`BaseCountry ${BaseCountryName} not found`);
    }
  const query = `UPDATE Fundraiser SET
    FundraiserName = ?,
    FundraiserEmail = ?,
    FundraiserLogo = ?, 
    BaseCountryID = ?, 
    FundraiserCentralID = ?
   WHERE FundraiserID = ?`;

 const values = [
   data.FundraiserName,
   data.FundraiserEmail,
   data.FundraiserLogo,
   DBBaseCountryName[0].BaseCountryID,
   data.FundraiserCentralID,
   fundraiserID,
 ];
    try{
        const result = await db(query, values);
        return result;
    }
    catch(error){
        throw new Error("[DB] Error updating fundraiser:");
    }
}

export async function PUT(req, {params}){
  const { id } = params;
  const data = await req.json();
  console.log("PUT::: ", data);
 
  const contactLinks = [
    { platform: "Facebook", url: data.FacebookLink },
    { platform: "Telegram", url: data.TelegramLink },
    { platform: "Others", url: data.OtherLink1 },
    { platform: "Others", url: data.OtherLink2 },
  ];

  try {
    await UpdateFundraiser(id, data);
    await DeleteOldFundraiser_AcceptedCurrencies(id);
    await CreateFundraiser_AcceptedCurrencies(id, data.AcceptedCurrencies);
    await DeleteOldFundraiser_ContactLinks(id);
    await CreateFundraiser_ContactLinks(id, contactLinks);

   return NextResponse.json({
     message: "Fundraiser updated successfully",
     status: 200,
   
   });

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update fundraiser", error: error.message },
      { status: 500 }
    );

  }
}