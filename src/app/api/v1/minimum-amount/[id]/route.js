import { NextResponse } from "next/server";
import db from "../../../../utilites/db";

// Get Query
async function GetMinimumAmountById(Id) {
    const query = `
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

    const values = [Id];

    try {
        const results = await db(query, values);

        return results.map(row => ({
            MinimumAmountId: row.MinimumAmountId,
            Currency: {
                CurrencyId: row.CurrencyId,
                CurrencyCode: row.CurrencyCode,
            },
            Amount: row.Amount
        }));
    } catch (error) {
        throw new Error("[DB] Error getting minimum amount by Id");
    }
}

// Update Query
async function UpdateMinimumAmount(Id, Amount) {
    const query = `UPDATE MinimumAmount SET Amount = ? WHERE MinimumAmountId = ?`;
    const values = [Amount, Id];

    try {
        const result = await db(query, values);
        return result.affectedRows > 0 ? { Id, Amount } : null;
    } catch (error) {
        throw new Error("[DB] Error updating minimum amount");
    }
}

// Delete Query
async function DeleteMinimumAmount(Id) {
    const query = `DELETE FROM MinimumAmount WHERE MinimumAmountId = ?`;
    const values = [Id];

    try {
        const result = await db(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error("[DB] Error deleting minimum amount");
    }
}

// Get API
export async function GET(req, { params }) {
    try {
        const data = await GetMinimumAmountById(params.id);
        if (!data.length) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Cannot get minimum amount" }, { status: 500 });
    }
}

// Update API
export async function PUT(req, { params }) {
    try {
        const { Amount } = await req.json();
        if (Amount == null) return NextResponse.json({ message: "Amount is required" }, { status: 400 });

        const data = await UpdateMinimumAmount(params.id, Amount);
        if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({ message: "Minimum Amount Updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Cannot update minimum amount" }, { status: 500 });
    }
}

// Delete API
export async function DELETE(req, { params }) {
    try {
        const data = await DeleteMinimumAmount(params.id);
        if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({ message: "Minimum Amount Deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Cannot delete minimum amount" }, { status: 500 });
    }
}
