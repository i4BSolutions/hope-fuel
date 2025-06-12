import { NextResponse } from "next/server";
import prisma from "../../utilites/prisma";

// Function to fetch paginated data
async function getPaginatedData(page, selectedWallet, agentId) {
  const itemsPerPage = 10;
  const offset = (parseInt(page, 10) - 1) * itemsPerPage;

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  // Fetch agent role
  const agent = await prisma.agent.findUnique({
    where: { AgentId: agentId },
    select: { UserRoleId: true },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  let walletFilter = {};

  // If agent is not admin, get assigned wallets
  if (agent.UserRoleId !== 2) {
    const assignedWallets = await prisma.assignedWallet.findMany({
      where: { AgentId: agentId },
      select: { WalletId: true },
    });

    const assignedWalletIds = assignedWallets.map((w) => w.WalletId);

    if (assignedWalletIds.length === 0) {
      return {
        items: [],
        totalItems: 0,
        itemsPerPage,
        currentPage: page,
        totalPages: 1,
      };
    }

    walletFilter = { WalletID: { in: assignedWalletIds } };
  }

  const baseWhere = {
    FormStatus: {
      some: { TransactionStatusID: 1 },
    },
    TransactionDate: {
      gte: firstDayOfMonth,
      lt: firstDayOfNextMonth,
    },
    ...walletFilter,
  };

  if (selectedWallet && selectedWallet !== "All Wallets") {
    baseWhere["Wallet"] = {
      WalletName: selectedWallet,
    };
  }

  try {
    const [rows, totalCount] = await Promise.all([
      prisma.Transactions.findMany({
        where: baseWhere,
        include: {
          Customer: { select: { Name: true } },
          Wallet: { select: { Currency: { select: { CurrencyCode: true } } } },
          Screenshot: { select: { ScreenShotLink: true } },
        },
        orderBy: { TransactionDate: "asc" },
        skip: offset,
        take: itemsPerPage,
      }),
      prisma.Transactions.count({ where: baseWhere }),
    ]);

    const formattedRows = rows.map((row) => ({
      CurrencyCode: row.Wallet?.Currency?.CurrencyCode || null,
      CustomerName: row.Customer?.Name || null,
      HopeFuelID: row.HopeFuelID || null,
      ScreenShotLinks: row.Screenshot?.map((s) => s.ScreenShotLink) || [],
    }));

    return {
      items: formattedRows,
      totalItems: totalCount,
      itemsPerPage,
      currentPage: page,
      totalPages: Math.ceil(totalCount / itemsPerPage),
    };
  } catch (error) {
    console.error("Error fetching paginated data:", error);
    throw new Error("Error fetching paginated data");
  }
}

// Function to search by HopeFuelID, limited to assigned wallets
async function searchByHopeFuelID(HopeFuelID, agentId) {
  try {
    // Fetch agent role
    const agent = await prisma.agent.findUnique({
      where: { AgentId: agentId },
      select: { UserRoleId: true },
    });

    if (!agent) throw new Error("Agent not found");

    let walletFilter = {};

    // If not admin, restrict to assigned wallets
    if (agent.UserRoleId !== 2) {
      const assignedWallets = await prisma.assignedWallet.findMany({
        where: { AgentId: agentId },
        select: { WalletId: true },
      });
      const assignedWalletIds = assignedWallets.map((w) => w.WalletId);
      if (assignedWalletIds.length === 0) return [];

      walletFilter = { WalletID: { in: assignedWalletIds } };
    }

    const row = await prisma.Transactions.findFirst({
      where: {
        HopeFuelID: HopeFuelID,
        ...walletFilter,
      },
      include: {
        Customer: { select: { Name: true } },
        Wallet: { select: { Currency: { select: { CurrencyCode: true } } } },
        Screenshot: { select: { ScreenShotLink: true } },
      },
    });

    if (!row) return [];

    const formattedRow = {
      CurrencyCode: row.Wallet?.Currency?.CurrencyCode || null,
      CustomerName: row.Customer?.Name || null,
      HopeFuelID: row.HopeFuelID || null,
      ScreenShotLinks: row.Screenshot?.map((s) => s.ScreenShotLink) || [],
    };

    return [formattedRow];
  } catch (error) {
    console.error("Error fetching search data:", error);
    throw new Error("Error fetching search data");
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const HopeFuelID = searchParams.get("HopeFuelID");
  const page = parseInt(searchParams.get("page"), 10) || 1;
  const selectedWallet = searchParams.get("wallet") || " ";
  const agentId = parseInt(searchParams.get("agentId"), 10);

  try {
    if (HopeFuelID) {
      const id = parseInt(HopeFuelID, 10);
      const found = await searchByHopeFuelID(id, agentId);

      if (found.length === 0) {
        return NextResponse.json({
          items: [],
          totalItems: 0,
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: 1,
        });
      }

      return NextResponse.json({
        items: found,
        totalItems: 1,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 1,
      });
    } else {
      const data = await getPaginatedData(page, selectedWallet, agentId);
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
