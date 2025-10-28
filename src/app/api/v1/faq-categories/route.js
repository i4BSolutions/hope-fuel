import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(req) {
  try {
    const faqCategories = await prisma.FaqCategory.findMany({
      orderBy: { CreatedAt: "desc" },
      include: {
        Faq: {
          select: {
            Id: true,
          },
        },
      },
    });

    const categoriesWithCount = faqCategories.map((category) => ({
      ...category,
      faqCount: category.Faq.length,
      Faq: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        {
          message: "Missing required field: name",
        },
        { status: 400 }
      );
    }

    const newCategory = await prisma.FaqCategory.create({
      data: {
        Name: name,
        CreatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("this error", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
