import { NextResponse } from "next/server";
import db from "../../../../../utilites/db";

async function FundraiserDetailsByFundraiserID(id) {
  const query = `
    SELECT 
        f.FundraiserID,
    f.FundraiserName,
    f.FundraiserEmail,
    f.FundraiserLogo,
    bc.BaseCountryName,
    f.FundraiserCentralID,
    c.CurrencyCode,
    p.PlatformName,
    fc.ContactURL
    FROM 
        Fundraiser f
    LEFT JOIN 
        BaseCountry bc ON f.BaseCountryID = bc.BaseCountryID
    LEFT JOIN 
        Fundraiser_AcceptedCurrencies fac ON f.FundraiserID = fac.FundraiserID
    LEFT JOIN 
        Currency c ON fac.CurrencyID = c.CurrencyID
    LEFT JOIN 
        Fundraiser_ContactLinks fc ON f.FundraiserID = fc.FundraiserID
    LEFT JOIN 
        Platform p ON fc.PlatformID = p.PlatformID
    WHERE 
        f.FundraiserID = ?
  `;

  const values = [id];
  try {
    const result = await db(query, values);

    if (!result || result.length === 0) return [];

    const base = result[0];

    const acceptedCurrencies = [];
    const contactLinks = {};
    let otherCount = 1;

    result.forEach((row) => {
      if (row.CurrencyCode && !acceptedCurrencies.includes(row.CurrencyCode)) {
        acceptedCurrencies.push(row.CurrencyCode);
      }

      if (row.PlatformName && row.ContactURL) {
        const platform = row.PlatformName.toLowerCase();
        if (platform === "facebook") {
          contactLinks["FacebookLink"] = row.ContactURL;
        } else if (platform === "telegram") {
          contactLinks["TelegramLink"] = row.ContactURL;
        } else {
          contactLinks[`OtherLink${otherCount}`] = row.ContactURL;
          otherCount++;
        }
      }
    });

    return [
      {
        FundraiserID: base.FundraiserID,
        FundraiserName: base.FundraiserName,
        FundraiserEmail: base.FundraiserEmail,
        FundraiserLogo: base.FundraiserLogo,
        BaseCountryName: base.BaseCountryName || null,
        FundraiserCentralID: base.FundraiserCentralID,
        AcceptedCurrencies: acceptedCurrencies,
        ContactLinks: contactLinks,
      },
    ];
  } catch (error) {
    console.error("[DB] Detailed Error:", error);
    throw error;
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const data = await FundraiserDetailsByFundraiserID(id);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "Fundraiser Details does not exist", code: 0 },
        { status: 404 }
      );
    }

    const fundraiser = data[0];

    return NextResponse.json(
      {
        message: `Fundraiser Details for ID: ${id}`,
        data: {
          FundraiserID: fundraiser.FundraiserID,
          FundraiserName: fundraiser.FundraiserName,
          FundraiserEmail: fundraiser.FundraiserEmail,
          FundraiserLogo: fundraiser.FundraiserLogo,
          BaseCountryName: fundraiser.BaseCountryName,
          FundraiserCentralID: fundraiser.FundraiserCentralID,
          AcceptedCurrencies: fundraiser.AcceptedCurrencies,
          ContactLinks: fundraiser.ContactLinks,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error in Fundraiser Details:", error);
    return NextResponse.json(
      {
        error: "Failed to get Fundraiser Details",
        details: process.env.NODE_ENV === "development" ? error.message : null,
      },
      { status: 500 }
    );
  }
}
