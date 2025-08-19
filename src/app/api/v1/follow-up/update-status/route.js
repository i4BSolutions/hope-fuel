import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

export async function POST(req) {
  try {
    const { customerId, statusId } = await req.json();

    if (!customerId || !statusId) {
      return NextResponse.json(
        { error: "Missing customerId or statusId" },
        { status: 400 }
      );
    }

    // Find the most recent status for this customer
    const existingStatus = await prisma.customerFollowUpStatus.findFirst({
      where: { CustomerID: customerId },
      orderBy: { FollowUpDate: "desc" },
    });

    let result;
    if (existingStatus) {
      // Update the latest record
      result = await prisma.customerFollowUpStatus.update({
        where: {
          CustomerFollowUpStatusID: existingStatus.CustomerFollowUpStatusID,
        },
        data: {
          FollowUpStatusID: statusId,
          FollowUpDate: new Date(),
        },
      });
    } else {
      // Insert new record
      result = await prisma.customerFollowUpStatus.create({
        data: {
          CustomerID: customerId,
          FollowUpStatusID: statusId,
          FollowUpDate: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Update follow-up status error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
