import { NextResponse } from "next/server";
import db from "../../../utilites/db";

// Create Query
async function CreateMinimumAmount(CurrencyId, Amount) {
    const query = `INSERT INTO MinimumAmount (CurrencyId, Amount) VALUES (?, ?)`;
    const values = [CurrencyId, Amount];

    try {
        const result = await db(query, values);
        const createdId = result.insertId;

        const fetchQuery = `
            SELECT
                *
            FROM
                MinimumAmount
            JOIN
                Currency
            ON
                MinimumAmount.CurrencyId = Currency.CurrencyId
            WHERE
                MinimumAmount.MinimumAmountId = ?
        `;

        const [createdData] = await db(fetchQuery, [createdId]);

        return {
            MinimumAmountId: createdData.MinimumAmountId,
            Currency: {
                CurrencyId: createdData.CurrencyId,
                CurrencyCode: createdData.CurrencyCode,
            },
            Amount: createdData.Amount
        };
    } catch (error) {
        throw new Error("[DB] Error creating minimum amount");
    }
}

// Get All Query
async function GetMinimumAmount() {
    const query = `
        SELECT
            *
        FROM
            MinimumAmount
        JOIN
            Currency
        ON
            MinimumAmount.CurrencyId = Currency.CurrencyId
    `;

    try {
        const results = await db(query);

        return results.map(row => ({
            MinimumAmountId: row.MinimumAmountId,
            Currency: {
                CurrencyId: row.CurrencyId,
                CurrencyCode: row.CurrencyCode,
            },
            Amount: row.Amount
        }));
    } catch (error) {
        throw new Error("[DB] Error getting minimum amount");
    }
}

// Create API
export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { CurrencyId, Amount } = reqBody;

        const missingFields = ["CurrencyId", "Amount"].filter(
            (field) => reqBody[field] == null
        );

        if (missingFields.length) {
            return NextResponse.json(
                { message: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        const data = await CreateMinimumAmount(CurrencyId, Amount);
        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Cannot create minimum amount"},
            { status: 500 }
        );
    }
}

// Get All API
export async function GET() {
    try {
        const data = await GetMinimumAmount();
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Cannot get minimum amount"},
            { status: 500 }
        );
    }
}
