import { NextResponse } from "next/server";
import db from "../../../../utilites/db";

// Get Exchange Rate Query
async function GetExchangeRateById(id) {
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
            ExchangeRates.ExchangeRateId = ?
    `;
    
    try {
        const result = await db(query, [id]);

        // map the data into object
        return result.map(row => ({
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
        }))[0] || null;
    } catch (error) {
        throw new Error("Error fetching exchange rate");
    }
}

// Update Exchange Rate Query
async function UpdateExchangeRate(id, ExchangeRate) {
    const query = `UPDATE ExchangeRates SET ExchangeRate=? WHERE ExchangeRateId=?`;
    
    try {
        const result = await db(query, [ ExchangeRate, id]);
        return result.affectedRows > 0 ? { id, ExchangeRate } : null;
    } catch (error) {
        throw new Error("Error updating exchange rate");
    }
}

// Delete Exchange Rate Query
async function DeleteExchangeRate(id) {
    const query = `DELETE FROM ExchangeRates WHERE ExchangeRateId=?`;

    try {
        const result = await db(query, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error("Error deleting exchange rate");
    }
}

// Get Exchange Rate API
export async function GET(req, { params }) {
    try {
        const data = await GetExchangeRateById(params.id);
        if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Cannot fetch exchange rate" }, { status: 500 });
    }
}

// Update Exchange Rate API
export async function PUT(req, { params }) {
    try {
        const { ExchangeRate } = await req.json();
        const data = await UpdateExchangeRate(params.id, ExchangeRate);

        if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Cannot update exchange rate" }, { status: 500 });
    }
}

// Delete Exchange Rate API
export async function DELETE(req, { params }) {
    try {
        const success = await DeleteExchangeRate(params.id);
        if (!success) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Cannot delete exchange rate" }, { status: 500 });
    }
}