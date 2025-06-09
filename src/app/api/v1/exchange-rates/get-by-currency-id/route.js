import { NextResponse } from "next/server";
import db from "../../../../utilites/db";

// Get Exchange Rate by CurrencyID
async function GetExchangeRateByCurrency(currency) {
    const query = `
        SELECT
            *
        FROM 
            ExchangeRates 
        JOIN 
            BaseCountry ON ExchangeRates.BaseCountryId = BaseCountry.BaseCountryId
        JOIN 
            Currency ON ExchangeRates.CurrencyId = Currency.CurrencyId
        WHERE 
            Currency.CurrencyCode = ?
    `;

    try {
        return await db(query, [currency]);
    } catch (error) {   
        throw new Error("Error geting exchange rate by currency id");
    }
}

// Get Exchange Rate by CurrencyID API
export async function POST(req) {
    try {
        const payload = await req.json();
        const data = await GetExchangeRateByCurrency(payload.currency);

        if (!data) return NextResponse.json(
            {
                message: "Not found",
                status: 404 
            }
        );

        return NextResponse.json(
            { data: data[0] },
            {
                message: "Fetch exchange rate successfully.",
                status: 200
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Cannot fetch exchange rate",
                status: 500
            }
        );
    }
}
