import { NextResponse } from "next/server";
import prisma from "../../utilites/prisma";

export async function GET(request) {
  try {
    const data = await prisma.Wallet.findMany({
      select: {
        WalletId: true,
        WalletName: true,
        Currency: {
          select: {
            CurrencyCode: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      message: "All available wallets",
      data: data.map((wallet) => ({
        WalletID: wallet.WalletId,
        WalletName: wallet.WalletName,
        CurrencyCode: wallet.Currency.CurrencyCode,
      })),
    });
  } catch (error) {
    console.error("[Error] Can't show all available wallets:", error);
    return NextResponse.json(
      { error: "Can't show all available wallets" },
      { status: 500 }
    );
  }
}
