export const dynamic = "force-dynamic";
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

    // Minimal validation
    const required = {
      FundraiserName,
      FundraiserLogo,
      FundraiserCentralID,
      BaseCountryName,
      AcceptedCurrencies,
    };
    const missing = Object.keys(required).filter(
      (k) =>
        !required[k] || (Array.isArray(required[k]) && required[k].length === 0)
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

    // Email uniqueness check — only if provided
    if (FundraiserEmail?.trim()) {
      const exists = await prisma.fundraiser.findFirst({
        where: { FundraiserEmail: FundraiserEmail.trim() },
        select: { FundraiserID: true },
      });
      if (exists) {
        return NextResponse.json(
          {
            status: 409,
            message: `A fundraiser with email "${FundraiserEmail}" already exists.`,
          },
          { status: 409 }
        );
      }
    }

    const created = await prisma.$transaction(async (tx) => {
      // 1) BaseCountry (find or create)
      let baseCountry = await tx.baseCountry.findFirst({
        where: { BaseCountryName },
      });
      if (!baseCountry) {
        baseCountry = await tx.baseCountry.create({
          data: { BaseCountryName },
        });
      }

      // 2) Create fundraiser
      const fundraiser = await tx.fundraiser.create({
        data: {
          FundraiserName,
          FundraiserEmail: FundraiserEmail?.trim() || null,
          FundraiserLogo,
          FundraiserCentralID,
          BaseCountryID: baseCountry.BaseCountryID,
        },
      });

      // 3) Contact links
      const contactLinks = [];
      if (FacebookLink)
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: 1,
          ContactURL: FacebookLink,
        });
      if (TelegramLink)
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: 2,
          ContactURL: TelegramLink,
        });
      if (OtherLink1)
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: 3,
          ContactURL: OtherLink1,
        });
      if (OtherLink2)
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: 3,
          ContactURL: OtherLink2,
        });

      if (contactLinks.length) {
        await tx.fundraiser_ContactLinks.createMany({ data: contactLinks });
      }

      // 4) Accepted currencies
      if (Array.isArray(AcceptedCurrencies) && AcceptedCurrencies.length) {
        const currencies = await tx.currency.findMany({
          where: { CurrencyCode: { in: AcceptedCurrencies } },
          select: { CurrencyId: true, CurrencyCode: true },
        });

        const map = new Map(
          currencies.map((c) => [c.CurrencyCode, c.CurrencyId])
        );
        const rows = AcceptedCurrencies.map((code) => {
          const cid = map.get(code);
          return cid
            ? { FundraiserID: fundraiser.FundraiserID, CurrencyID: cid }
            : null;
        }).filter(Boolean);

        if (rows.length) {
          await tx.fundraiser_AcceptedCurrencies.createMany({ data: rows });
        }
      }

      // 5) Re-read with includes to match GET shape
      const fresh = await tx.fundraiser.findUnique({
        where: { FundraiserID: fundraiser.FundraiserID },
        include: {
          BaseCountry: { select: { BaseCountryName: true } },
          Fundraiser_AcceptedCurrencies: {
            include: { Currency: { select: { CurrencyCode: true } } },
          },
          fundraiser_contactlinks: {
            select: {
              ContactID: true,
              ContactURL: true,
              Platform: { select: { PlatformName: true } },
            },
          },
        },
      });

      const contactLinksObj = (fresh?.fundraiser_contactlinks ?? []).reduce(
        (acc, cl) => {
          const platform = cl.Platform?.PlatformName;
          if (platform === "Facebook") acc.FacebookLink = cl.ContactURL;
          else if (platform === "Telegram") acc.TelegramLink = cl.ContactURL;
          return acc;
        },
        { FacebookLink: null }
      );

      return {
        FundraiserID: fresh.FundraiserID,
        FundraiserName: fresh.FundraiserName,
        FundraiserEmail: fresh.FundraiserEmail,
        FundraiserLogo: fresh.FundraiserLogo,
        FundraiserCentralID: fresh.FundraiserCentralID,
        BaseCountryID: fresh.BaseCountryID,
        BaseCountryName: fresh.BaseCountry?.BaseCountryName ?? null,
        AcceptedCurrencies: (fresh.Fundraiser_AcceptedCurrencies ?? [])
          .map((ac) => ac.Currency?.CurrencyCode)
          .filter(Boolean),
        ContactLinks: contactLinksObj,
      };
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Fundraiser created successfully",
        fundraiser: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating fundraiser:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error in post request",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
