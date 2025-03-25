import { NextResponse } from "next/server";
import db from "../../../../utilites/db";
async function CreateFundraiserContactLink(FundraiserID,PlatformID,ContactURL){
  const query = ` Insert into Fundraiser_ContactLinks(FundraiserID,PlatformID,ContactURL) values (?,?,?)`;
  const values=[FundraiserID,PlatformID,ContactURL];
  try{
    const result = await db(query,values);
    return result;
  }
  catch(error){
    console.error("Error creating FundraiserContactLink:",error);
    throw new Error("[DB] Error creating Fundraiser Contact Link:");
  }

}
async function CreateBaseCountryInFundraiser(BaseCountryName) {
  const query = `INSERT INTO BaseCountry (BaseCountryName) VALUES (?)`;
  const values = [BaseCountryName];

  try {
    const result = await db(query, values);
    return result.insertId;
  } catch (error) {
    console.error("Error creating BaseCountry:", error);
    throw new Error("[DB] Error creating BaseCountry:");
  }
}
async function CheckExistingBaseCountry(BaseCountryName) {
  const query = `SELECT BaseCountryID FROM BaseCountry WHERE BaseCountryName = ?`;
  const values = [BaseCountryName];

  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    console.error("Error checking existing BaseCountry:", error);
    throw new Error("[DB] Error checking existing BaseCountry:");
  }
}
async function CreateFundraiser(
  FundraiserName,
  FundraiserEmail,
  FundraiserLogo,
  FundraiserCentralID,
  BaseCountryID,
 
) {
  const query = `INSERT INTO Fundraiser (FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryID,FundraiserCentralID ) 
                  VALUES (?,?,?,?,?)`;
  const values = [
    FundraiserName,
    FundraiserEmail,
    FundraiserLogo,
    BaseCountryID,
    FundraiserCentralID,

  ];

  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    throw new Error("[DB] Error creating fundraiser:");
  }
}

async function CreateAcceptedCurrencies(fundraiserCurrencies) {
  const query = `INSERT INTO Fundraiser_AcceptedCurrencies (FundraiserID, CurrencyID) VALUES ?`;
  const values = [fundraiserCurrencies];
  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    console.log("Error creating AcceptedCurrencies:", error);
    throw new Error("[DB] Error creating AcceptedCurrencies:");
  }
}

export async function POST(req) {
  const {
    FundraiserName,
    FundraiserEmail,
    FundraiserLogo,
    FundraiserCentralID,
    BaseCountryName,
    AcceptedCurrencies,
    FacebookLink,
    TelegramLink,
    OtherLink1,
    OtherLink2
  } = await req.json();

  const requiredFields = {
    FundraiserName,
    FundraiserEmail,
    FundraiserLogo,
    FundraiserCentralID,
    BaseCountryName,
    AcceptedCurrencies,
  };
  const missingFields = Object.keys(requiredFields).filter(
    (field) => !requiredFields[field]
  );
  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      },
      { status: 400 }
    );
  }

  try {
    //BaseCountry

    let BaseCountryID = null;
    const existingBaseCountry = await CheckExistingBaseCountry(BaseCountryName);
    if (existingBaseCountry.length > 0) {
      BaseCountryID = existingBaseCountry[0].BaseCountryID;
    } else {
      BaseCountryID = await CreateBaseCountryInFundraiser(BaseCountryName);
      if (!BaseCountryID) {
        return NextResponse.json(
          {
            status: 500,
            message: "Internal Server Error in Creating BaseCountry",
          },
          { status: 500 }
        );
      }
    }
    //Fundraiser
    const fundraiser = await CreateFundraiser(
      FundraiserName,
      FundraiserEmail,
      FundraiserLogo,
      FundraiserCentralID,
      BaseCountryID,
    );

    //Fundraiser Contact Links
   const contactLinks = [];

   if (FacebookLink) {
     contactLinks.push([fundraiser.insertId, 1, FacebookLink]);
   }
   if (TelegramLink) {
     contactLinks.push([fundraiser.insertId, 2, TelegramLink]);
   }
   if (OtherLink1) {
     contactLinks.push([fundraiser.insertId, 3, OtherLink1]);
   }
   if (OtherLink2) {
     contactLinks.push([fundraiser.insertId, 3, OtherLink2]);
   }
   
   // Insert each contact link
   for (const [fundraiserId, platformId, url] of contactLinks) {
     await CreateFundraiserContactLink(fundraiserId, platformId, url);
   }

    //Accepted Currencies

    if (!AcceptedCurrencies || AcceptedCurrencies.length === 0) {
      return NextResponse.json(
        {
          status: 400,
          message: "AcceptedCurrencies array is missing or empty",
        },
        { status: 400 }
      );
    }

    if (
      fundraiser.insertId &&
      AcceptedCurrencies &&
      AcceptedCurrencies.length > 0
    ) {
      const placeholders = AcceptedCurrencies.map(() => "?").join(",");

      //fetch all currencyID in one query
      const currencyResults = await db(
        `SELECT CurrencyID, CurrencyCode FROM Currency WHERE CurrencyCode IN (${placeholders})`,
        AcceptedCurrencies
      );
      if (!currencyResults || !Array.isArray(currencyResults)) {
        console.error("currencyResults is not valid:", currencyResults);
        return NextResponse.json(
          {
            status: 500,
            message: "Internal Server Error fetching currencies",
          },
          { status: 500 }
        );
      }
      //Map the currencyCode to each currencyID
      const currencyMap = new Map(
        currencyResults.map((currency) => [
          currency.CurrencyCode,
          currency.CurrencyID,
        ])
      );

      //Map the currencyID to the fundraiserID
      const fundraiserCurrencies = AcceptedCurrencies.map((currency) => {
        const currencyID = currencyMap.get(currency);
        return currencyID ? [fundraiser.insertId, currencyID] : null;
      }).filter((currency) => currency !== null);

      //console.log("AcceptedCurrencies::::", fundraiserCurrencies);

      const acceptedCurrencies = await CreateAcceptedCurrencies(
        fundraiserCurrencies
      );
      if (!acceptedCurrencies) {
        return NextResponse.json(
          {
            status: 500,
            message: "Internal Server Error in Creating AcceptedCurrencies",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        status: 201,
        message: "Fundraiser created successfully",
        fundraiser: {
          id: fundraiser.insertId,
          name: FundraiserName,
          email: FundraiserEmail,
          logo: FundraiserLogo,
          centralID: FundraiserCentralID,
          baseCountry: BaseCountryName,
          acceptedCurrencies: AcceptedCurrencies,
          ContactLinks: {
            ...(FacebookLink && { FacebookLink }),
            ...(TelegramLink && { TelegramLink }),
            ...(OtherLink1 && { OtherLink1 }),
            ...(OtherLink2 && { OtherLink2 }),
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating fundraiser:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error in post request",
        error: error.sqlMessage,
      },
      { status: 500 }
    );
  }
}
