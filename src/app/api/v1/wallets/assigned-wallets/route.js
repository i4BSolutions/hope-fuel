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
    const assignedWallets = await prisma.AssignedWallet.findMany({
      include: {
        Wallet: true,
      },
    });

    const grouped = assignedWallets.reduce((acc, curr) => {
      const { AgentId, Wallet } = curr;
      const agentIdInt =
        typeof AgentId === "string" ? parseInt(AgentId, 10) : AgentId;
      if (!acc[agentIdInt]) {
        acc[agentIdInt] = [];
      }
      acc[agentIdInt].push(Wallet);
      return acc;
    }, {});

    const result = Object.entries(grouped).map(([AgentId, wallets]) => ({
      AgentId: parseInt(AgentId, 10),
      wallets,
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
    const id = searchParams.get("agentId");

    console.log("agentId", id);

    if (!id) {
      return NextResponse.json(
        { message: "Missing agentId in query parameters" },
        { status: 400 }
      );
    }

    const { walletId } = await request.json();

    const updatedAssignedWallet = await prisma.AssignedWallet.updateMany({
      where: { AgentId: id },
      data: {
        WalletId: walletId,
      },
    });

    if (updatedAssignedWallet.count === 0) {
      return NextResponse.json(
        { message: "No assigned wallets found for this agent" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Assigned wallet(s) updated successfully",
      data: updatedAssignedWallet,
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
