export const dynamic = "force-dynamic";
import prisma from "@/app/utilites/prisma";
import { NextResponse } from "next/server";

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

//     // Minimal validation
//     const required = {
//       FundraiserName,
//       FundraiserLogo,
//       FundraiserCentralID,
//       BaseCountryName,
//       AcceptedCurrencies,
//     };
//     const missing = Object.keys(required).filter(
//       (k) =>
//         !required[k] || (Array.isArray(required[k]) && required[k].length === 0)
//     );
//     if (missing.length) {
//       return NextResponse.json(
//         {
//           status: 400,
//           message: `Missing required fields: ${missing.join(", ")}`,
//         },
//         { status: 400 }
//       );
//     }

//     // Email uniqueness check — only if provided
//     if (FundraiserEmail?.trim()) {
//       const exists = await prisma.fundraiser.findFirst({
//         where: { FundraiserEmail: FundraiserEmail.trim() },
//         select: { FundraiserID: true },
//       });
//       if (exists) {
//         return NextResponse.json(
//           {
//             status: 409,
//             message: `A fundraiser with email "${FundraiserEmail}" already exists.`,
//           },
//           { status: 409 }
//         );
//       }
//     }

//     const created = await prisma.$transaction(async (tx) => {
//       // 1) BaseCountry (find or create)
//       let baseCountry = await tx.baseCountry.findFirst({
//         where: { BaseCountryName },
//       });
//       if (!baseCountry) {
//         baseCountry = await tx.baseCountry.create({
//           data: { BaseCountryName },
//         });
//       }

//       // 2) Create fundraiser
//       const fundraiser = await tx.fundraiser.create({
//         data: {
//           FundraiserName,
//           FundraiserEmail: FundraiserEmail?.trim() || "no@example.com",
//           FundraiserLogo,
//           FundraiserCentralID,
//           BaseCountryID: baseCountry.BaseCountryID,
//         },
//       });

//       // 3) Contact links
//       const contactLinks = [];
//       if (FacebookLink)
//         contactLinks.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 1,
//           ContactURL: FacebookLink,
//         });
//       if (TelegramLink)
//         contactLinks.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 2,
//           ContactURL: TelegramLink,
//         });
//       if (OtherLink1)
//         contactLinks.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 3,
//           ContactURL: OtherLink1,
//         });
//       if (OtherLink2)
//         contactLinks.push({
//           FundraiserID: fundraiser.FundraiserID,
//           PlatformID: 3,
//           ContactURL: OtherLink2,
//         });

//       if (contactLinks.length) {
//         await tx.fundraiser_ContactLinks.createMany({ data: contactLinks });
//       }

//       // 4) Accepted currencies
//       if (Array.isArray(AcceptedCurrencies) && AcceptedCurrencies.length) {
//         const currencies = await tx.currency.findMany({
//           where: { CurrencyCode: { in: AcceptedCurrencies } },
//           select: { CurrencyId: true, CurrencyCode: true },
//         });

//         const map = new Map(
//           currencies.map((c) => [c.CurrencyCode, c.CurrencyId])
//         );
//         const rows = AcceptedCurrencies.map((code) => {
//           const cid = map.get(code);
//           return cid
//             ? { FundraiserID: fundraiser.FundraiserID, CurrencyID: cid }
//             : null;
//         }).filter(Boolean);

//         if (rows.length) {
//           await tx.fundraiser_AcceptedCurrencies.createMany({ data: rows });
//         }
//       }

//       // 5) Re-read with includes to match GET shape
//       const fresh = await tx.fundraiser.findUnique({
//         where: { FundraiserID: fundraiser.FundraiserID },
//         include: {
//           BaseCountry: { select: { BaseCountryName: true } },
//           Fundraiser_AcceptedCurrencies: {
//             include: { Currency: { select: { CurrencyCode: true } } },
//           },
//           fundraiser_contactlinks: {
//             select: {
//               ContactID: true,
//               ContactURL: true,
//               Platform: { select: { PlatformName: true } },
//             },
//           },
//         },
//       });

//       const contactLinksObj = (fresh?.fundraiser_contactlinks ?? []).reduce(
//         (acc, cl) => {
//           const platform = cl.Platform?.PlatformName;
//           if (platform === "Facebook") acc.FacebookLink = cl.ContactURL;
//           else if (platform === "Telegram") acc.TelegramLink = cl.ContactURL;
//           return acc;
//         },
//         { FacebookLink: null }
//       );

//       return {
//         FundraiserID: fresh.FundraiserID,
//         FundraiserName: fresh.FundraiserName,
//         FundraiserEmail: fresh.FundraiserEmail,
//         FundraiserLogo: fresh.FundraiserLogo,
//         FundraiserCentralID: fresh.FundraiserCentralID,
//         BaseCountryID: fresh.BaseCountryID,
//         BaseCountryName: fresh.BaseCountry?.BaseCountryName ?? null,
//         AcceptedCurrencies: (fresh.Fundraiser_AcceptedCurrencies ?? [])
//           .map((ac) => ac.Currency?.CurrencyCode)
//           .filter(Boolean),
//         ContactLinks: contactLinksObj,
//       };
//     });

//     return NextResponse.json(
//       {
//         status: 201,
//         message: "Fundraiser created successfully",
//         fundraiser: created,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating fundraiser:", error);
//     return NextResponse.json(
//       {
//         status: 500,
//         message: "Internal Server Error in post request",
//         error: error?.message ?? "Unknown error",
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

    // Option 3: email uniqueness check (only if provided & non-empty)
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

      // 2) Create Fundraiser
      const fundraiser = await tx.fundraiser.create({
        data: {
          FundraiserName,
          FundraiserEmail: FundraiserEmail?.trim() || null,
          FundraiserLogo,
          FundraiserCentralID,
          BaseCountryID: baseCountry.BaseCountryID,
        },
      });

      // 3) Ensure Platforms exist and get their IDs by name
      const neededPlatformNames = new Set();
      if (FacebookLink) neededPlatformNames.add("Facebook");
      if (TelegramLink) neededPlatformNames.add("Telegram");
      if (OtherLink1 || OtherLink2) neededPlatformNames.add("Other");

      const needed = Array.from(neededPlatformNames);
      const existingPlatforms = needed.length
        ? await tx.platform.findMany({
            where: { PlatformName: { in: needed } },
            select: { PlatformID: true, PlatformName: true },
          })
        : [];

      const platformMap = new Map(
        existingPlatforms.map((p) => [p.PlatformName, p.PlatformID])
      );

      // Create any missing platforms
      for (const name of needed) {
        if (!platformMap.has(name)) {
          const createdPlat = await tx.platform.create({
            data: { PlatformName: name },
          });
          platformMap.set(name, createdPlat.PlatformID);
        }
      }

      // 4) Contact links (use resolved PlatformIDs)
      const contactLinks = [];
      if (FacebookLink && platformMap.get("Facebook"))
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: platformMap.get("Facebook"),
          ContactURL: FacebookLink,
        });
      if (TelegramLink && platformMap.get("Telegram"))
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: platformMap.get("Telegram"),
          ContactURL: TelegramLink,
        });
      if (OtherLink1 && platformMap.get("Other"))
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: platformMap.get("Other"),
          ContactURL: OtherLink1,
        });
      if (OtherLink2 && platformMap.get("Other"))
        contactLinks.push({
          FundraiserID: fundraiser.FundraiserID,
          PlatformID: platformMap.get("Other"),
          ContactURL: OtherLink2,
        });

      if (contactLinks.length) {
        await tx.fundraiser_ContactLinks.createMany({ data: contactLinks });
      }

      // 5) Accepted currencies
      if (Array.isArray(AcceptedCurrencies) && AcceptedCurrencies.length) {
        const currencies = await tx.currency.findMany({
          where: { CurrencyCode: { in: AcceptedCurrencies } },
          select: { CurrencyId: true, CurrencyCode: true },
        });

        const codeToId = new Map(
          currencies.map((c) => [c.CurrencyCode, c.CurrencyId])
        );
        const rows = AcceptedCurrencies.map((code) => {
          const cid = codeToId.get(code);
          return cid
            ? { FundraiserID: fundraiser.FundraiserID, CurrencyID: cid }
            : null;
        }).filter(Boolean);

        if (rows.length) {
          await tx.fundraiser_AcceptedCurrencies.createMany({ data: rows });
        }
      }

      // 6) Re-read with includes to match GET shape
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
        { FacebookLink: null, TelegramLink: null }
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
