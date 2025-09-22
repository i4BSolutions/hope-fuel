import { NextResponse } from "next/server";
import prisma from "../../../../../utilites/prisma";

// GET /api/agents/wallets?agentId=123
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const agentId = parseInt(searchParams.get("agentId"), 10);

  if (!agentId) {
    return NextResponse.json(
      { message: "Missing agentId in query parameters" },
      { status: 400 }
    );
  }

  try {
    // Fetch agent's role
    const agent = await prisma.agent.findUnique({
      where: { AgentId: agentId },
      select: { UserRoleId: true },
    });

    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 });
    }

    let data;

    if (agent.UserRoleId === 2) {
      // Admin: return all wallets with transaction counts
      const wallets = await prisma.wallet.findMany();

      // Get transaction counts for all wallets
      const walletIds = wallets.map((wallet) => wallet.WalletId);

      // Get current month date range
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

      const transactionCounts = await prisma.transactions.groupBy({
        by: ["WalletID"],
        where: {
          WalletID: {
            in: walletIds,
          },
          FormStatus: {
            some: { TransactionStatusID: 1 },
          },
          TransactionDate: {
            gte: firstDayOfMonth,
            lte: firstDayOfNextMonth,
          },
        },
        _count: {
          WalletID: true,
        },
      });

      // Create a map for quick lookup
      const countMap = transactionCounts.reduce((acc, item) => {
        acc[item.WalletID] = item._count.WalletID;
        return acc;
      }, {});

      // Add transaction count to each wallet
      data = wallets.map((wallet) => ({
        ...wallet,
        transactionCount: countMap[wallet.WalletId] || 0,
      }));
    } else {
      // Non-admin: return only assigned wallets with transaction counts
      const assignedWallets = await prisma.assignedWallet.findMany({
        where: {
          AgentId: agentId,
        },
        include: {
          Wallet: true,
        },
      });

      const wallets = assignedWallets.map((item) => item.Wallet);

      // Get transaction counts for assigned wallets
      const walletIds = wallets.map((wallet) => wallet.WalletId);

      // Get current month date range
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

      const transactionCounts = await prisma.transactions.groupBy({
        by: ["WalletID"],
        where: {
          WalletID: {
            in: walletIds,
          },
          PaymentCheck: null,
          TransactionDate: {
            gte: firstDayOfMonth,
            lte: firstDayOfNextMonth,
          },
          FormStatus: {
            some: { TransactionStatusID: 1 },
          },
        },
        _count: {
          WalletID: true,
        },
      });

      // Create a map for quick lookup
      const countMap = transactionCounts.reduce((acc, item) => {
        acc[item.WalletID] = item._count.WalletID;
        return acc;
      }, {});

      // Add transaction count to each wallet
      data = wallets.map((wallet) => ({
        ...wallet,
        transactionCount: countMap[wallet.WalletId] || 0,
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      { message: "Error fetching wallets!" },
      { status: 500 }
    );
  }
}
