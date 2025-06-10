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
      // Admin: return all wallets
      data = await prisma.wallet.findMany();
    } else {
      // Non-admin: return only assigned wallets
      const assignedWallets = await prisma.assignedWallet.findMany({
        where: {
          AgentId: agentId,
        },
        include: {
          Wallet: true,
        },
      });

      data = assignedWallets.map((item) => item.Wallet);
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
