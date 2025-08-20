export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import prisma from "@/app/utilites/prisma";
import { NextResponse } from "next/server";

async function fetchFundraisers() {
  try {
    const fundraisers = await prisma.fundraiser.findMany({
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

export async function GET() {
  try {
    const fundraisers = await fetchFundraisers();

    return NextResponse.json(
      {
        totalRecords: fundraisers.length,
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
