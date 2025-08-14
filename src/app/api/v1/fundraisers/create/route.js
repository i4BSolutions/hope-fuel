import prisma from "@/app/utilites/prisma";
import { NextResponse } from "next/server";

// async function CreateFundraiserContactLink(
//   FundraiserID,
//   PlatformID,
//   ContactURL
// ) {
//   const query = `Insert into Fundraiser_ContactLinks(FundraiserID,PlatformID,ContactURL) values (?,?,?)`;
//   const values = [FundraiserID, PlatformID, ContactURL];
//   try {
//     const result = await db(query, values);
//     return result;
//   } catch (error) {
//     console.error("Error creating FundraiserContactLink:", error);
//     throw new Error("[DB] Error creating Fundraiser Contact Link:");
//   }
// }

// async function CreateBaseCountryInFundraiser(BaseCountryName) {
//   const query = `INSERT INTO BaseCountry (BaseCountryName) VALUES (?)`;
//   const values = [BaseCountryName];

//   try {
//     const result = await db(query, values);
//     return result.insertId;
//   } catch (error) {
//     console.error("Error creating BaseCountry:", error);
//     throw new Error("[DB] Error creating BaseCountry:");
//   }
// }

// async function CheckExistingBaseCountry(BaseCountryName) {
//   const query = `SELECT BaseCountryID FROM BaseCountry WHERE BaseCountryName = ?`;
//   const values = [BaseCountryName];

//   try {
//     const result = await db(query, values);
//     return result;
//   } catch (error) {
//     console.error("Error checking existing BaseCountry:", error);
//     throw new Error("[DB] Error checking existing BaseCountry:");
//   }
// }
// async function CreateFundraiser(
//   FundraiserName,
//   FundraiserEmail,
//   FundraiserLogo,
//   FundraiserCentralID,
//   BaseCountryID
// ) {
//   const query = `INSERT INTO Fundraiser (FundraiserName, FundraiserEmail, FundraiserLogo, BaseCountryID,FundraiserCentralID )
//                   VALUES (?,?,?,?,?)`;
//   const values = [
//     FundraiserName,
//     FundraiserEmail,
//     FundraiserLogo,
//     BaseCountryID,
//     FundraiserCentralID,
//   ];

//   try {
//     const result = await db(query, values);
//     return result;
//   } catch (error) {
//     throw new Error("[DB] Error creating fundraiser:");
//   }
// }

// async function CreateAcceptedCurrencies(fundraiserCurrencies) {
//   const query = `INSERT INTO Fundraiser_AcceptedCurrencies (FundraiserID, CurrencyID) VALUES ?`;
//   const values = [fundraiserCurrencies];
//   try {
//     const result = await db(query, values);
//     return result;
//   } catch (error) {
//     console.log("Error creating AcceptedCurrencies:", error);
//     throw new Error("[DB] Error creating AcceptedCurrencies:");
//   }
// }

// export async function POST(req) {
//   try {
//     const {
//       FundraiserName,
//       FundraiserEmail,
//       FundraiserLogo,
//       FundraiserCentralID,
//       BaseCountryName,
//       AcceptedCurrencies,
//       FacebookLink,
//       TelegramLink,
//       OtherLink1,
//       OtherLink2,
//     } = await req.json();

//     // Validation
//     const requiredFields = {
//       FundraiserName,
//       FundraiserLogo,
//       FundraiserCentralID,
//       BaseCountryName,
//       AcceptedCurrencies,
//     };
//     const missingFields = Object.keys(requiredFields).filter(
//       (field) =>
//         !requiredFields[field] ||
//         (Array.isArray(requiredFields[field]) &&
//           requiredFields[field].length === 0)
//     );
//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         {
//           status: 400,
//           message: `Missing required fields: ${missingFields.join(", ")}`,
//         },
//         { status: 400 }
//       );
//     }

//     const createdData = await prisma.$transaction(async (tx) => {
//       // 1. BaseCountry (find or create)
//       let baseCountry = await tx.baseCountry.findUnique({
//         where: { BaseCountryName },
//       });
//       if (!baseCountry) {
//         baseCountry = await tx.baseCountry.create({
//           data: { BaseCountryName },
//         });
//       }

//       // 2. Create fundraiser
//       const fundraiser = await tx.fundraiser.create({
//         data: {
//           FundraiserName,
//           FundraiserEmail,
//           FundraiserLogo,
//           FundraiserCentralID,
//           BaseCountryID: baseCountry.BaseCountryID,
//         },
//       });

//       // 3. Contact links
//       const contactLinksData = [];
//       if (FacebookLink)
//         contactLinksData.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 1,
//           ContactURL: FacebookLink,
//         });
//       if (TelegramLink)
//         contactLinksData.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 2,
//           ContactURL: TelegramLink,
//         });
//       if (OtherLink1)
//         contactLinksData.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 3,
//           ContactURL: OtherLink1,
//         });
//       if (OtherLink2)
//         contactLinksData.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 3,
//           ContactURL: OtherLink2,
//         });

//       if (contactLinksData.length > 0) {
//         await tx.fundraiser_ContactLinks.createMany({
//           data: contactLinksData,
//         });
//       }

//       // 4. Accepted currencies
//       if (AcceptedCurrencies.length > 0) {
//         const currencies = await tx.currency.findMany({
//           where: { CurrencyCode: { in: AcceptedCurrencies } },
//           select: { CurrencyId: true, CurrencyCode: true },
//         });

//         const currencyMap = new Map(
//           currencies.map((c) => [c.CurrencyCode, c.CurrencyId])
//         );

//         const fundraiserCurrencies = AcceptedCurrencies.map((code) => {
//           const currencyID = currencyMap.get(code);
//           return currencyID
//             ? { FundraiserID: fundraiser.FundraiserID, CurrencyID: currencyID }
//             : null;
//         }).filter(Boolean);

//         if (fundraiserCurrencies.length > 0) {
//           await tx.fundraiser_AcceptedCurrencies.createMany({
//             data: fundraiserCurrencies,
//           });
//         }
//       }

//       return fundraiser;
//     });

//     return NextResponse.json(
//       {
//         status: 201,
//         message: "Fundraiser created successfully",
//         fundraiser: createdData,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating fundraiser:", error);
//     return NextResponse.json(
//       {
//         status: 500,
//         message: "Internal Server Error in post request",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
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
      OtherLink2,
    } = await req.json();

    // Validate required fields
    const requiredFields = {
      FundraiserName,
      FundraiserLogo,
      FundraiserCentralID,
      BaseCountryName,
      AcceptedCurrencies,
    };
    const missing = Object.keys(requiredFields).filter(
      (key) =>
        !requiredFields[key] ||
        (Array.isArray(requiredFields[key]) && requiredFields[key].length === 0)
    );
    if (missing.length) {
      return NextResponse.json(
        {
          status: 400,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const fundraiser = await prisma.$transaction(async (tx) => {
      // Find or create base country
      let baseCountry = await tx.baseCountry.findUnique({
        where: { BaseCountryName },
      });
      if (!baseCountry) {
        baseCountry = await tx.baseCountry.create({
          data: { BaseCountryName },
        });
      }

      // Create fundraiser
      const createdFundraiser = await tx.fundraiser.create({
        data: {
          FundraiserName,
          FundraiserEmail,
          FundraiserLogo,
          FundraiserCentralID,
          BaseCountryID: baseCountry.BaseCountryID,
        },
      });

      // Contact links
      const links = [];
      if (FacebookLink)
        links.push({
          FundraiserID: createdFundraiser.FundraiserID,
          PlatformID: 1,
          ContactURL: FacebookLink,
        });
      if (TelegramLink)
        links.push({
          FundraiserID: createdFundraiser.FundraiserID,
          PlatformID: 2,
          ContactURL: TelegramLink,
        });
      if (OtherLink1)
        links.push({
          FundraiserID: createdFundraiser.FundraiserID,
          PlatformID: 3,
          ContactURL: OtherLink1,
        });
      if (OtherLink2)
        links.push({
          FundraiserID: createdFundraiser.FundraiserID,
          PlatformID: 3,
          ContactURL: OtherLink2,
        });

      if (links.length) {
        await tx.fundraiser_ContactLinks.createMany({ data: links });
      }

      // Accepted currencies
      if (AcceptedCurrencies?.length) {
        const currencies = await tx.currency.findMany({
          where: { CurrencyCode: { in: AcceptedCurrencies } },
          select: { CurrencyId: true, CurrencyCode: true },
        });

        const currencyMap = new Map(
          currencies.map((c) => [c.CurrencyCode, c.CurrencyId])
        );
        const fundraiserCurrencies = AcceptedCurrencies.map((code) => {
          const cid = currencyMap.get(code);
          return cid
            ? { FundraiserID: createdFundraiser.FundraiserID, CurrencyID: cid }
            : null;
        }).filter(Boolean);

        if (fundraiserCurrencies.length) {
          await tx.fundraiser_AcceptedCurrencies.createMany({
            data: fundraiserCurrencies,
          });
        }
      }

      return createdFundraiser;
    });

    return NextResponse.json(
      { status: 201, message: "Fundraiser created successfully", fundraiser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating fundraiser:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error in post request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
