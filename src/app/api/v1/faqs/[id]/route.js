import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

export async function PATCH(req, { params }) {
  try {
    const faqId = Number(params?.id);
    if (!faqId || Number.isNaN(faqId)) {
      return NextResponse.json(
        { success: false, message: "Invalid FAQ id." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updates = {};

    if (body?.categoryId != null) {
      const categoryId = Number(body.categoryId);
      if (!categoryId || Number.isNaN(categoryId)) {
        return NextResponse.json(
          { success: false, message: "categoryId must be a number." },
          { status: 400 }
        );
      }

      const cat = await prisma.FaqCategory.findUnique({
        where: { Id: categoryId },
        select: { Id: true },
      });

      if (!cat) {
        return NextResponse.json(
          { success: false, message: `Category ${categoryId} not found.` },
          { status: 404 }
        );
      }
      updates.CategoryId = categoryId;
    }

    if (typeof body?.question === "string")
      updates.Question = body.question.trim();
    if (typeof body?.explanation === "string")
      updates.Explanation = body.explanation.trim();
    if (typeof body?.response === "string")
      updates.Response = body.response.trim();

    const existing = await prisma.Faq.findUnique({
      where: { Id: faqId },
      select: { Id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: `FAQ ${faqId} not found.` },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      if (Object.keys(updates).length > 0) {
        await tx.Faq.update({ where: { Id: faqId }, data: updates });
      }

      if (Array.isArray(body?.images)) {
        await tx.FaqImage.deleteMany({ where: { FaqId: faqId } });

        const sanitized =
          body.images
            .filter(
              (img) =>
                img &&
                typeof img.url === "string" &&
                img.url.length > 0 &&
                typeof img.type === "string"
            )
            .map((img) => ({
              FaqId: faqId,
              ImageLink: img.url,
              Type: img.type,
            })) ?? [];

        if (sanitized.length) {
          await tx.FaqImage.createMany({ data: sanitized });
        }
      }

      const refreshed = await tx.Faq.findUnique({
        where: { Id: faqId },
        include: {
          FaqCategory: { select: { Id: true, Name: true } },
          FaqImage: { select: { Id: true, ImageLink: true, Type: true } },
        },
      });

      return refreshed;
    });

    const explanationImages = result.FaqImage.filter(
      (i) => i.Type === "explanation"
    ).map((i) => i.ImageLink);
    const responseImages = result.FaqImage.filter(
      (i) => i.Type === "response"
    ).map((i) => i.ImageLink);

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully",
      data: {
        Id: result.Id,
        Question: result.Question,
        Explanation: result.Explanation,
        Response: result.Response,
        Category: result.FaqCategory,
        explanationImages,
        responseImages,
      },
    });
  } catch (error) {
    console.error("FAQ UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const faqId = Number(params?.id);
    if (!faqId || Number.isNaN(faqId)) {
      return NextResponse.json(
        { success: false, message: "Invalid FAQ id." },
        { status: 400 }
      );
    }

    const exists = await prisma.Faq.findUnique({
      where: { Id: faqId },
      select: { Id: true },
    });
    if (!exists) {
      return NextResponse.json(
        { success: false, message: `FAQ ${faqId} not found.` },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.FaqImage.deleteMany({ where: { FaqId: faqId } });
      await tx.Faq.delete({ where: { Id: faqId } });
    });

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("FAQ DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
