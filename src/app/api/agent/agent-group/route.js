import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function POST(request) {
  try {
    const { groupName, agentIds } = await request.json();

    if (groupName !== "Group A" && groupName !== "Group B") {
      return NextResponse.json(
        {
          status: 400,
          message:
            "Invalid group name. Only 'Group A' and 'Group B' are allowed.",
        },
        { status: 400 }
      );
    }

    const group = await prisma.agentGroup.findUnique({
      where: { GroupName: groupName },
    });

    if (!group) {
      return NextResponse.json(
        {
          status: 404,
          message: "Group not found. Only predefined groups are allowed.",
        },
        { status: 404 }
      );
    }

    const existingAssignments = await prisma.assignedAgent.findMany({
      where: {
        AgentId: { in: agentIds },
        AgentGroupID: { not: group.AgentGroupID },
      },
      include: { Agent: true },
    });

    if (existingAssignments.length > 0) {
      const conflicted = existingAssignments.map(
        (a) => a.Agent.Username || `AgentId: ${a.AgentId}`
      );
      return NextResponse.json(
        {
          status: 409,
          message: "These agent(s) are already assigned to another group.",
          conflictedAgents: conflicted,
        },
        { status: 409 }
      );
    }

    await prisma.assignedAgent.createMany({
      data: agentIds.map((id) => ({
        AgentId: id,
        AgentGroupID: group.AgentGroupID,
      })),
      skipDuplicates: true,
    });

    const assignedAgents = await prisma.agent.findMany({
      where: {
        AssignedAgents: {
          some: { AgentGroupID: group.AgentGroupID },
        },
      },
      select: {
        AgentId: true,
        Username: true,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Agent(s) group assigned successfully.",
      data: {
        group,
        assignedAgents,
      },
    });
  } catch (error) {
    console.error("[POST] Error creating agent group assign:", error);
    return NextResponse.json(
      { status: 500, message: "Error creating group assign" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
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
                _count: {
                  select: {
                    TransactionAgent: true,
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
        TransactionCount: a.Agent._count.TransactionAgent,
      }));

      const totalTransactionCount = agents.reduce(
        (sum, agent) => sum + agent.TransactionCount,
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

    const unassignedAgents = await prisma.agent.findMany({
      where: {
        AgentId: {
          notIn: assignedAgentIds,
        },
      },
      select: {
        AgentId: true,
        Username: true,
        _count: {
          select: {
            TransactionAgent: true,
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
        TransactionCount: a._count.TransactionAgent,
      })),
      TotalTransactionCount: unassignedAgents.reduce(
        (sum, a) => sum + a._count.TransactionAgent,
        0
      ),
    };

    const result = [...groupedResults, unassignedGroup];

    return NextResponse.json({
      status: 200,
      message: "Assigned agent groups retrieve successfully.",
      data: {
        result,
      },
    });
  } catch (error) {
    console.error("[GET] Error fetching agent groups:", error);
    return NextResponse.json(
      { status: 500, message: "Error fetching agent groups" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { groupName, agentIds } = await request.json();

    if (groupName === "Unassigned") {
      await prisma.assignedAgent.deleteMany({
        where: {
          AgentId: { in: agentIds },
        },
      });

      return NextResponse.json({
        status: 200,
        message: "Agents unassigned successfully.",
      });
    }

    if (!["Group A", "Group B"].includes(groupName)) {
      return NextResponse.json(
        {
          status: 400,
          message:
            "Invalid group name. Only 'Group A' and 'Group B' are allowed.",
        },
        { status: 400 }
      );
    }

    const group = await prisma.agentGroup.findUnique({
      where: { GroupName: groupName },
    });

    if (!group) {
      return NextResponse.json(
        { status: 404, message: "Group not found." },
        { status: 404 }
      );
    }

    await prisma.assignedAgent.deleteMany({
      where: {
        AgentId: { in: agentIds },
        AgentGroupID: { not: group.AgentGroupID },
      },
    });

    const currentAssignments = await prisma.assignedAgent.findMany({
      where: { AgentGroupID: group.AgentGroupID },
      select: { AgentId: true },
    });

    const alreadyAssigned = currentAssignments.map((a) => a.AgentId);
    const newAssignments = agentIds.filter(
      (id) => !alreadyAssigned.includes(id)
    );

    if (newAssignments.length > 0) {
      await prisma.assignedAgent.createMany({
        data: newAssignments.map((id) => ({
          AgentId: id,
          AgentGroupID: group.AgentGroupID,
        })),
        skipDuplicates: true,
      });
    }

    const assignedAgents = await prisma.agent.findMany({
      where: {
        AssignedAgents: {
          some: { AgentGroupID: group.AgentGroupID },
        },
      },
      select: {
        AgentId: true,
        Username: true,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Agent group updated successfully.",
      data: { group, assignedAgents },
    });
  } catch (error) {
    console.error("[PUT] Error updating group:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error." },
      { status: 500 }
    );
  }
}
