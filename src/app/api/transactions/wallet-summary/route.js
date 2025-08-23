export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("month");
    const rawWalletIds = searchParams.get("walletIds");

    const [year, monthStr] = date.split("-");
    const monthNum = parseInt(monthStr);
    const startDate = new Date(`${year}-${monthStr}-01T00:00:00Z`);
    const endDate = new Date(new Date(startDate).setMonth(monthNum));

    const transactions = await prisma.transactions.findMany({
      where: {
        TransactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        WalletID: true,
        Amount: true,
        PaymentCheck: true,
        PaymentDenied: true,
        Wallet: {
          select: {
            WalletId: true,
            WalletName: true,
            CurrencyId: true,
          },
        },
      },
    });

    let selectedWalletIds = rawWalletIds
      ? rawWalletIds
          .split(",")
          .map((id) => parseInt(id))
          .filter(Boolean)
      : [
          ...new Set(transactions.map((tx) => tx.WalletID).filter(Boolean)),
        ].slice(0, 5);

    const filtered = transactions.filter((tx) =>
      selectedWalletIds.includes(tx.WalletID)
    );

    const currencyIds = [
      ...new Set(filtered.map((tx) => tx.Wallet?.CurrencyId).filter(Boolean)),
    ];

    const exchangeRates = await prisma.exchangeRates.findMany({
      where: {
        CurrencyId: { in: currencyIds },
      },
    });

    const rateMap = {};
    for (const rate of exchangeRates) {
      rateMap[rate.CurrencyId] = parseFloat(rate.ExchangeRate);
    }

    const summary = {};

    for (const tx of filtered) {
      const walletId = tx.WalletID;
      if (!walletId) continue;

      const currencyId = tx.Wallet?.CurrencyId || null;
      const amount = tx.Amount || 0;
      const rate = currencyId ? rateMap[currencyId] : null;

      if (!summary[walletId]) {
        summary[walletId] = {
          walletId,
          walletName: tx.Wallet?.WalletName || `Wallet ${walletId}`,
          currencyId,
          count: 0,
          totalAmount: 0,
          checked: 0,
          pending: 0,
          totalAmountUSD: 0,
        };
      }

      summary[walletId].count += 1;

      if (tx.PaymentCheck === true && tx.PaymentDenied === true) {
        summary[walletId].checked += 1;
      } else if (tx.PaymentCheck === true && !tx.PaymentDenied) {
        summary[walletId].checked += 1;
        summary[walletId].totalAmount += amount;

        if (rate) {
          summary[walletId].totalAmountUSD += amount / rate;
        }
      } else {
        summary[walletId].pending += 1;
      }
    }

    const result = Object.values(summary).map((wallet) => ({
      ...wallet,
      totalAmount: parseFloat(wallet.totalAmount.toFixed(2)),
      totalAmountUSD: parseFloat(wallet.totalAmountUSD.toFixed(2)),
    }));

    return NextResponse.json({
      status: 200,
      message: "Wallet summary retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Wallet summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet summary" },
      { status: 500 }
    );
  }
}
