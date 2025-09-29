import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

// TODO: if request status is payment checked or cancel, trigger the PaymentCheck, PaymentCheckTime, and Cancel
export async function PUT(request) {
  const { statusId, formStatusId } = await request.json();

  if (!formStatusId) {
    return NextResponse.json(
      { error: "Missing FormStatusID" },
      { status: 400 }
    );
  }

  if (!statusId) {
    return NextResponse.json({ error: "Missing Status ID" }, { status: 400 });
  }

  try {
    const result = await prisma.formStatus.update({
      where: { FormStatusID: formStatusId },
      data: { TransactionStatusID: statusId },
    });

    return NextResponse.json(
      { message: "Form status updated successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Error updating transaction status" },
      { status: 500 }
    );
  }
}
