import { NextResponse } from "next/server";
import db from "../../../utilites/db";

async function CreateFundraiser(FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryID) {
    const query =`INSERT INTO Fundraiser (FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryID ) VALUES (?,?,?,?)`;
    const values = [FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryID];
    
    try {
        const result = await db(query, values);
       // console.log("result from DB when creating Fundraiser: ", result);
        return result;
    } catch (error) {
      //  console.error("Error creating fundraiser:", error);
        throw new Error("[DB] Error creating fundraiser:");
    }
}

async function CreateBaseCountryInFundraiser(BaseCountryName) {
    const query = `INSERT INTO BaseCountry (BaseCountryName) VALUES (?)`;
    const values = [BaseCountryName];

    try{
        const result = await db(query, values);
        return result.insertId;
    }catch (error) {
        console.error("Error creating BaseCountry:", error);
        throw new Error("[DB] Error creating BaseCountry:");
    }

}

export async function POST(req) {
    const { FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryName } = await req.json();

   const requiredFields = {FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryName};
   const missingFields = Object.keys(requiredFields).filter((field) => !requiredFields[field]);
  if (missingFields.length >0) {
    return NextResponse.json({
         status:400,
         message: `Missing required fields: ${missingFields.join(", ")}` },
          { status: 400 });
  }

    try {
        const BaseCountryID = await CreateBaseCountryInFundraiser(BaseCountryName);
        if(!BaseCountryID) {
            return NextResponse.json({ 
                status: 500,
                message: "Internal Server Error in Creating BaseCountry" }
                , { status: 500 });
        }
        const fundraiser = await CreateFundraiser(FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryID);
        return NextResponse.json(
          {
            status: 201,
            message: "Fundraiser created successfully",
            fundraiser: {
              id: fundraiser.insertId,
              name: FundraiserName,
              email: FundraiserEmail,
              logo: FundraiserLogo,
              baseCountry: BaseCountryName,
            },
          },
          { status: 201 }
        );

    } catch (error) {
        console.error("Error creating fundraiser:", error);
        return NextResponse.json({ 
            status: 500,
            message: "Internal Server Error" }, 
            { status: 500 });
    }
}