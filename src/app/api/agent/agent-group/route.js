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
              },
            },
          },
        },
      },
    });

    const result = groups.map((group) => ({
      AgentGroupID: group.AgentGroupID,
      GroupName: group.GroupName,
      AssignedAgents: group.AssignedAgents.map((a) => a.Agent),
    }));

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
