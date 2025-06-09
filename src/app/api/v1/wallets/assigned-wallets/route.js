import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

// Create function
export async function POST(request) {
  try {
    const { walletId, agentId } = await request.json();

    const result = await prisma.AssignedWallet.create({
      data: {
        WalletId: walletId,
        AgentId: agentId,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Wallet assigned successfully",
      data: result,
    });
  } catch (error) {
    console.error("[POST] Error creating wallet assign:", error);
    return NextResponse.json(
      { message: "Error creating wallet assign" },
      { status: 500 }
    );
  }
}

// Get all function
export async function GET(request) {
  try {
    const agents = await prisma.agent.findMany({
      where: {
        UserRoleId: 3, // Support Agent
      },
      select: {
        AgentId: true,
        AwsId: true,
        Username: true,
      },
    });

    const assignedWallets = await prisma.assignedWallet.findMany({
      include: {
        Wallet: true,
      },
    });

    const walletMap = assignedWallets.reduce((acc, curr) => {
      const agentId = curr.AgentId;
      if (!acc[agentId]) acc[agentId] = [];
      acc[agentId].push(curr.Wallet);
      return acc;
    }, {});

    const result = agents.map((agent) => ({
      AgentId: agent.AgentId,
      AwsId: agent.AwsId,
      Username: agent.Username,
      wallets: walletMap[agent.AgentId] || [],
    }));

    return NextResponse.json({
      status: 200,
      message: "Assigned wallets grouped by agent fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("[GET] Error fetching assigned wallets:", error);
    return NextResponse.json(
      { message: "Error fetching assigned wallets" },
      { status: 500 }
    );
  }
}

// Update function
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("agentId"));

    if (!id) {
      return NextResponse.json(
        { message: "Missing agentId in query parameters" },
        { status: 400 }
      );
    }

    const { walletId } = await request.json();

    if (!Array.isArray(walletId)) {
      return NextResponse.json(
        { message: "walletId must be an array" },
        { status: 400 }
      );
    }

    const currentAssignments = await prisma.assignedWallet.findMany({
      where: { AgentId: id },
      select: { WalletId: true },
    });

    const currentWalletIds = currentAssignments.map((a) => a.WalletId);

    const walletsToAdd = walletId.filter((w) => !currentWalletIds.includes(w));
    const walletsToRemove = currentWalletIds.filter(
      (w) => !walletId.includes(w)
    );

    await Promise.all(
      walletsToAdd.map((walletId) =>
        prisma.assignedWallet.create({
          data: { AgentId: id, WalletId: walletId },
        })
      )
    );

    await prisma.assignedWallet.deleteMany({
      where: {
        AgentId: id,
        WalletId: { in: walletsToRemove },
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Assigned wallets updated successfully",
      added: walletsToAdd,
      removed: walletsToRemove,
    });
  } catch (error) {
    console.error("[PUT] Error updating assigned wallet(s):", error);
    return NextResponse.json(
      { message: "Error updating assigned wallet(s)" },
      { status: 500 }
    );
  }
}

// Delete by agentId function
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json(
        { message: "Missing agentId in query parameters" },
        { status: 400 }
      );
    }

    const deleted = await prisma.AssignedWallet.deleteMany({
      where: { agentId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "No assigned wallets found for this agent" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Assigned wallet(s) deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("[DELETE] Error deleting assigned wallet(s):", error);
    return NextResponse.json(
      { message: "Error deleting assigned wallet(s)" },
      { status: 500 }
    );
  }
}
