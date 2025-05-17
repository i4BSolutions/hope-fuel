// app/api/dashboard/agent-rates/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";
import { endOfMonth, startOfMonth } from "date-fns";

export async function GET() {
  try {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    // Fetch only Group A and Group B
    const agentGroups = await prisma.agentGroup.findMany({
      where: {
        GroupName: {
          in: ["Group A", "Group B"],
        },
      },
      include: {
        Agents: {
          include: {
            TransactionAgent: {
              where: {
                Transactions: {
                  TransactionDate: {
                    gte: start,
                    lte: end,
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
    });

    // Map raw results
    const rawGroups = agentGroups.map((group) => {
      const agents = group.Agents.map((agent) => ({
        agentName: agent.AwsId ?? "Unnamed Agent",
        count: agent.TransactionAgent.length,
      }));

      const total = agents.reduce((sum, a) => sum + a.count, 0);

      return {
        groupName: group.GroupName,
        total,
        agents,
      };
    });

    // Deduplicate same groupName entries
    const mergedGroups = Object.values(
      rawGroups.reduce((acc, group) => {
        if (!acc[group.groupName]) {
          acc[group.groupName] = {
            groupName: group.groupName,
            total: group.total,
            agents: [...group.agents],
          };
        } else {
          acc[group.groupName].total += group.total;
          acc[group.groupName].agents.push(...group.agents);
        }
        return acc;
      }, {})
    );

    return NextResponse.json({
      status: 200,
      message: "Agent rates retrieved successfully.",
      data: mergedGroups,
    });
  } catch (error) {
    console.error("❌ Error fetching agent rates:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
