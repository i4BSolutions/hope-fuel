import prisma from "@/app/utilites/prisma";
import { NextResponse } from "next/server";

async function fetchFundraisers(limit, offset) {
  try {
    const fundraisers = await prisma.fundraiser.findMany({
      skip: offset,
      take: limit,
      include: {
        BaseCountry: {
          select: { BaseCountryName: true },
        },
        Fundraiser_AcceptedCurrencies: {
          include: {
            Currency: {
              select: { CurrencyCode: true },
            },
          },
        },
        fundraiser_contactlinks: {
          select: {
            ContactID: true,
            ContactURL: true,
            Platform: {
              select: {
                PlatformName: true,
              },
            },
          },
        },
      },
    });

    return fundraisers.map((f) => {
      const contactLinks = f.fundraiser_contactlinks.reduce(
        (acc, cl) => {
          const platform = cl.Platform?.PlatformName;
          if (platform === "Facebook") acc.FacebookLink = cl.ContactURL;
          else if (platform === "Telegram") acc.TelegramLink = cl.ContactURL;
          return acc;
        },
        {
          FacebookLink: null,
          TelegramLink: null,
        }
      );

      return {
        FundraiserID: f.FundraiserID,
        FundraiserName: f.FundraiserName,
        FundraiserEmail: f.FundraiserEmail,
        FundraiserLogo: f.FundraiserLogo,
        FundraiserCentralID: f.FundraiserCentralID,
        BaseCountryID: f.BaseCountryID,
        BaseCountryName: f.BaseCountry?.BaseCountryName || null,
        AcceptedCurrencies: f.Fundraiser_AcceptedCurrencies.map(
          (ac) => ac.Currency?.CurrencyCode
        ).filter(Boolean),
        ContactLinks: contactLinks,
      };
    });
  } catch (error) {
    console.error("Prisma error fetching fundraisers:", error);
    throw new Error("Failed to fetch fundraisers");
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  try {
    const total = await prisma.fundraiser.count();
    const fundraisers = await fetchFundraisers(limit, offset);

    return NextResponse.json(
      {
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        fundraisers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /fundraisers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
