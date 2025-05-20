import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function POST(request) {
  try {
    const { groupName, agentIds } = await request.json();

    let group = await prisma.agentGroup.findUnique({
      where: { GroupName: groupName },
    });

    if (!group) {
      group = await prisma.agentGroup.create({
        data: { GroupName: groupName },
      });
    }

    const existingAssignments = await prisma.assignedAgent.findMany({
      where: {
        AgentId: { in: agentIds },
        AgentGroupID: { not: group.AgentGroupID },
      },
      include: {
        Agent: true,
        AgentGroup: true,
      },
    });

    if (existingAssignments.length > 0) {
      const conflictedAgents = existingAssignments.map(
        (assign) => assign.Agent.Username || `Agent ID: ${assign.AgentId}`
      );
      return NextResponse.json(
        {
          status: 409,
          message: `These agent(s) are already assigned to a different group.`,
          conflictedAgents,
        },
        { status: 409 }
      );
    }

    const assignments = agentIds.map((id) => ({
      AgentId: id,
      AgentGroupID: group.AgentGroupID,
    }));

    await prisma.assignedAgent.createMany({
      data: assignments,
      skipDuplicates: true,
    });

    const assignedAgents = await prisma.agent.findMany({
      where: {
        AssignedAgents: {
          some: {
            AgentGroupID: group.AgentGroupID,
          },
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

    const result = groups.map((group) => {
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

    if (!groupName || !Array.isArray(agentIds)) {
      return NextResponse.json(
        { status: 400, message: "GroupName and agentIds are required." },
        { status: 400 }
      );
    }

    const group = await prisma.agentGroup.findUnique({
      where: { GroupName: groupName },
    });

    if (!group) {
      return NextResponse.json(
        { status: 404, message: "Agent group not found." },
        { status: 404 }
      );
    }

    await prisma.assignedAgent.deleteMany({
      where: {
        AgentId: { in: agentIds },
        AgentGroupID: { not: group.AgentGroupID },
      },
    });

    const existingAssignments = await prisma.assignedAgent.findMany({
      where: {
        AgentGroupID: group.AgentGroupID,
      },
      select: { AgentId: true },
    });

    const existingAgentIds = existingAssignments.map((a) => a.AgentId);

    const addToExistingAgents = agentIds.filter(
      (id) => !existingAgentIds.includes(id)
    );

    if (addToExistingAgents.length > 0) {
      await prisma.assignedAgent.createMany({
        data: addToExistingAgents.map((id) => ({
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
      data: {
        group,
        assignedAgents,
      },
    });
  } catch (error) {
    console.error("[PUT] Error updating agent group assign:", error);
    return NextResponse.json(
      { status: 500, message: "Error updating agent group assign" },
      { status: 500 }
    );
  }
}
