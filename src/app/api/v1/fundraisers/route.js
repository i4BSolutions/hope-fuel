import { NextResponse } from "next/server";
import db from "../../../utilites/db";

async function fetchFundraisers(limit, offset) {
  const query = `SELECT 
      f.*,
      bc.BaseCountryName,
      GROUP_CONCAT(DISTINCT c.CurrencyCode) AS AcceptedCurrencies
    FROM 
      Fundraiser f
    LEFT JOIN 
      BaseCountry bc ON f.BaseCountryID = bc.BaseCountryID
    LEFT JOIN 
      Fundraiser_AcceptedCurrencies fac ON f.FundraiserID = fac.FundraiserID
    LEFT JOIN 
      Currency c ON fac.CurrencyID = c.CurrencyId
    GROUP BY 
      f.FundraiserID
    LIMIT ? OFFSET ?`;
  const values = [limit, offset];

  try {
    const result = await db(query, values);

    const processedResult = result.map((fundraiser) => {
      return {
        ...fundraiser,
        AcceptedCurrencies: fundraiser.AcceptedCurrencies
          ? fundraiser.AcceptedCurrencies.split(",")
          : [],
      };
    });
    console.log("result from DB: ", result);
    return processedResult;
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    throw new Error("[DB] Error fetching fundraisers:");
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  try {
    const [{ total }] = await db(`SELECT COUNT(*) AS total FROM Fundraiser`);

    const fundraisers = await fetchFundraisers(limit, offset);
    return NextResponse.json(
      {
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        fundraisers,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
