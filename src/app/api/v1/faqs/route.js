import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = Number(categoryIdParam);

    if (!categoryId || Number.isNaN(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "categoryId is required and must be a number",
        },
        { status: 400 }
      );
    }

    const category = await prisma.FaqCategory.findUnique({
      where: { Id: categoryId },
      select: { Id: true, Name: true },
    });
    if (!category) {
      return NextResponse.json(
        { success: false, message: `Category ${categoryId} not found` },
        { status: 404 }
      );
    }

    const faqs = await prisma.Faq.findMany({
      where: { CategoryId: categoryId },
      orderBy: { Id: "asc" },
      include: {
        FaqCategory: {
          select: { Id: true, Name: true },
        },
        FaqImage: {
          select: { Id: true, ImageLink: true, Type: true },
        },
      },
    });

    const formattedFaqs = faqs.map((faq) => {
      const explanationImages = faq.FaqImage.filter(
        (img) => img.Type === "explanation"
      ).map((img) => img.ImageLink);

      const responseImages = faq.FaqImage.filter(
        (img) => img.Type === "response"
      ).map((img) => img.ImageLink);

      return {
        Id: faq.Id,
        Question: faq.Question,
        Explanation: faq.Explanation,
        Response: faq.Response,
        explanationImages,
        responseImages,
      };
    });

    return NextResponse.json({
      success: true,
      data: { category, faqs: formattedFaqs },
    });
  } catch (error) {
    console.error("FAQ LIST (BY CATEGORY) ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const categoryId = Number(body?.categoryId);
    const question = (body?.question || "").trim();
    const explanation = (body?.explanation || "").trim();
    const responseText = (body?.response || "").trim();
    const images = Array.isArray(body?.images) ? body.images : [];

    // Basic validation
    const errors = {};
    if (!categoryId || Number.isNaN(categoryId))
      errors.categoryId = "categoryId is required and must be a number";
    if (!question) errors.question = "question is required";
    if (!explanation) errors.explanation = "explanation is required";
    if (!responseText) errors.response = "response is required";

    if (Object.keys(errors).length) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Ensure the category exists
    const category = await prisma.FaqCategory.findUnique({
      where: { Id: categoryId },
      select: { Id: true },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: `Category ${categoryId} not found` },
        { status: 404 }
      );
    }

    // Create the FAQ
    const result = await prisma.$transaction(async (tx) => {
      const faq = await tx.Faq.create({
        data: {
          CategoryId: categoryId,
          Question: question,
          Explanation: explanation,
          Response: responseText,
        },
      });

      const sanitized =
        images
          .filter(
            (img) =>
              img &&
              typeof img.url === "string" &&
              img.url.length > 0 &&
              typeof img.type === "string"
          )
          .map((img) => ({
            FaqId: faq.Id,
            ImageLink: img.url,
            Type: img.type,
          })) ?? [];

      if (sanitized.length) {
        await tx.FaqImage.createMany({ data: sanitized });
      }

      return faq;
    });

    return NextResponse.json(
      {
        success: true,
        message: "FAQ created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("FAQ CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
