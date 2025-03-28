import { NextResponse } from "next/server";
import db from "../../../../../utilites/db";

async function DeleteFundraiserByFundraiserID(id) {
  const query = `
        DELETE FROM Fundraiser WHERE FundraiserID = ?
    `;

  const values = [id];

  try {
    const result = await db(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("[DB] Error deleting fundraiser");
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const deletedFundraiser = await DeleteFundraiserByFundraiserID(id);
    if (!deletedFundraiser) {
      return NextResponse.json({
        status: 404,
        message: "Fundraiser not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Fundraiser deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Error deleting fundraiser",
    });
  }
}
