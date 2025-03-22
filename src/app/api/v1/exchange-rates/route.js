import { NextResponse } from "next/server";
import db from "../../../utilites/db";

// Check for existing data
async function ExchangeRateExist(BaseCountryId, CurrencyId) {
    const query = `
        SELECT COUNT(*) AS count FROM ExchangeRates
        WHERE BaseCountryId = ? AND CurrencyId = ?
    `;

    const values = [BaseCountryId, CurrencyId];

    try {
        const [result] = await db(query, values);
        return result.count > 0;
    } catch (error) {
        console.error("[DB] Error checking exchange rate existence:", error.message);
        throw new Error("Database error during validation");
    }
}

// Create Query
async function CreateExchangeRate(BaseCountryId, CurrencyId, ExchangeRate) {
    const query = `INSERT INTO ExchangeRates (BaseCountryId, CurrencyId, ExchangeRate) VALUES (?,?,?)`;
    const values = [BaseCountryId, CurrencyId, ExchangeRate];

    try {
        const result = await db(query, values);
        const createdId = result.insertId;

        const fetchQuery = `
            SELECT 
                *
            FROM 
                ExchangeRates
            JOIN 
                BaseCountry ON ExchangeRates.BaseCountryId = BaseCountry.BaseCountryId
            JOIN 
                Currency ON ExchangeRates.CurrencyId = Currency.CurrencyId
            WHERE 
                ExchangeRates.ExchangeRateId = ?
        `;
        const [createdData] = await db(fetchQuery, [createdId]);

        // map the data into object
        return {
            ExchangeRateId: createdData.ExchangeRateId,
            BaseCountry: {
                BaseCountryId: createdData.BaseCountryId,
                BaseCountryName: createdData.BaseCountryName,
            },
            Currency: {
                CurrencyId: createdData.CurrencyId,
                CurrencyCode: createdData.CurrencyCode,
            },
            ExchangeRate: createdData.ExchangeRate,
            CreateAt: createdData.CreateAt,
            UpdatedAt: createdData.UpdatedAt,
        };
    } catch (error) {
        throw new Error("[DB] Error creating exchange rate:");
    }
}

// Get All Exchange Rates Query
async function GetExchangeRates(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
        SELECT 
            *
        FROM 
            ExchangeRates
        JOIN 
            BaseCountry ON ExchangeRates.BaseCountryId = BaseCountry.BaseCountryId
        JOIN 
            Currency ON ExchangeRates.CurrencyId = Currency.CurrencyId
        LIMIT ? OFFSET ?
    `;

    const values = [limit, offset];

    try {
        const results = await db(query, values);

        // map the data into object
        return results.map(row => ({
            ExchangeRateId: row.ExchangeRateId,
            BaseCountry: {
                BaseCountryId: row.BaseCountryId,
                BaseCountryName: row.BaseCountryName,
            },
            Currency: {
                CurrencyId: row.CurrencyId,
                CurrencyCode: row.CurrencyCode,
            },
            ExchangeRate: row.ExchangeRate,
            CreateAt: row.CreateAt,
            UpdatedAt: row.UpdatedAt,
        }));

    } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
        throw new Error("Error fetching exchange rates");
    }
}

// Create Exchange Rate API
export async function POST(req) {
    try {
        const { BaseCountryId, CurrencyId, ExchangeRate } = await req.json();

        const requiredFields = { BaseCountryId, CurrencyId, ExchangeRate };
        const missingFields = Object.keys(requiredFields).filter((field) => !requiredFields[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(", ")}`
            },
            { status: 400 });
        }

        const exists = await ExchangeRateExist(BaseCountryId, CurrencyId);

        if (exists) {
            return NextResponse.json({
                message: "Exchange rate for this Base Country and Currency already exists",
            }, { status: 409 });
        }

        const data = await CreateExchangeRate(BaseCountryId, CurrencyId, ExchangeRate);
        return NextResponse.json({ data },{status: 201});
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Cannot create exchange rate" },
            { status: 500 }
        );
    }
}

// Get All Exchange Rates API
export async function GET(req) {
    try {
        const [{ total }] = await db(`SELECT COUNT(*) AS total FROM ExchangeRates`);

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;

        if (isNaN(page) || page < 1) throw new Error("Invalid page number");
        if (isNaN(limit) || limit < 1) throw new Error("Invalid limit value");

        const data = await GetExchangeRates(page, limit);

        return NextResponse.json(
            {
                totalRecords: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET handler:", error.message);
        return NextResponse.json(
            { message: "Cannot fetch exchange rates", error: error.message },
            { status: 500 }
        );
    }
}