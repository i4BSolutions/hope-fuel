export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const now = new Date();
    const year = parseInt(searchParams.get("year") || now.getFullYear(), 10);
    const month = parseInt(searchParams.get("month") || now.getMonth() + 1, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { message: "Invalid year or month" },
        { status: 400 }
      );
    }

    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    // Fetch groups with filtered TransactionAgent
    const groups = await prisma.agentGroup.findMany({
      where: {
        GroupName: { in: ["Group A", "Group B"] },
      },
      include: {
        AssignedAgents: {
          include: {
            Agent: {
              select: {
                AgentId: true,
                Username: true,
                TransactionAgent: {
                  where: {
                    Transactions: {
                      TransactionDate: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                  },
                  select: {
                    TransactionID: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const groupedResults = groups.map((group) => {
      const agents = group.AssignedAgents.map((a) => ({
        AgentId: a.Agent.AgentId,
        Username: a.Agent.Username,
        TransactionCount: a.Agent.TransactionAgent.length,
      }));

      const totalTransactionCount = agents.reduce(
        (sum, a) => sum + a.TransactionCount,
        0
      );

      return {
        AgentGroupID: group.AgentGroupID,
        GroupName: group.GroupName,
        AssignedAgents: agents,
        TotalTransactionCount: totalTransactionCount,
      };
    });

    const assignedAgentIds = groups.flatMap((g) =>
      g.AssignedAgents.map((a) => a.Agent.AgentId)
    );

    // Fetch unassigned agents with filtered transactions
    const unassignedAgents = await prisma.agent.findMany({
      where: {
        AgentId: { notIn: assignedAgentIds },
        UserRoleId: 1,
      },
      select: {
        AgentId: true,
        Username: true,
        TransactionAgent: {
          where: {
            Transactions: {
              TransactionDate: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          select: {
            TransactionID: true,
          },
        },
      },
    });

    const unassignedGroup = {
      AgentGroupID: null,
      GroupName: "Unassigned",
      AssignedAgents: unassignedAgents.map((a) => ({
        AgentId: a.AgentId,
        Username: a.Username,
        TransactionCount: a.TransactionAgent.length,
      })),
      TotalTransactionCount: unassignedAgents.reduce(
        (sum, a) => sum + a.TransactionAgent.length,
        0
      ),
    };

    const result = [...groupedResults, unassignedGroup];

    return NextResponse.json({
      status: 200,
      message: "Assigned agent groups retrieved successfully.",
      data: { result },
    });
  } catch (error) {
    console.error("[GET] Error fetching agent groups:", error);
    return NextResponse.json(
      { status: 500, message: "Error fetching agent groups" },
      { status: 500 }
    );
  }
}
