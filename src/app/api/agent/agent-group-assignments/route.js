import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function POST(req) {
  const { groupName, agentIds } = await req.json();

  const group = await prisma.agentGroup.findUnique({
    where: { GroupName: groupName },
  });
  if (!group)
    return NextResponse.json({ error: "Group not found" }, { status: 404 });

  await prisma.assignedAgent.createMany({
    data: agentIds.map((id) => ({
      AgentId: id,
      AgentGroupID: group.AgentGroupID,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ status: 201, message: "Agents assigned." });
}

export async function GET() {
  try {
    // Step 1: Get "Group A" and "Group B" IDs
    const agentGroups = await prisma.agentGroup.findMany({
      where: {
        GroupName: { in: ["Group A", "Group B"] },
      },
      select: {
        AgentGroupID: true,
        GroupName: true,
      },
    });

    const groupMap = Object.fromEntries(
      agentGroups.map((g) => [g.AgentGroupID, g.GroupName])
    );

    // Step 2: Get ALL agents with their group assignments
    const agents = await prisma.agent.findMany({
      select: {
        AgentId: true,
        Username: true,
        AssignedAgents: {
          select: {
            AgentGroupID: true,
          },
        },
      },
    });

    // Step 3: Group agents into Group A / B / Unassigned
    const resultMap = {
      "Group A": [],
      "Group B": [],
      Unassigned: [],
    };

    for (const agent of agents) {
      const groupId = agent.AssignedAgents[0]?.AgentGroupID;
      const groupName = groupMap[groupId] || "Unassigned";

      resultMap[groupName].push({
        AgentId: agent.AgentId,
        Username: agent.Username,
      });
    }

    // Step 4: Return structured result
    const result = Object.entries(resultMap).map(([GroupName, Agents]) => ({
      GroupName,
      Agents,
    }));

    return NextResponse.json({
      status: 200,
      message: "Agent group assignments retrieved successfully.",
      data: result,
    });
  } catch (error) {
    console.error("[GET] Error fetching agent group assignments:", error);
    return NextResponse.json(
      { status: 500, message: "Failed to fetch agent group assignments." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { groupName, agentIds } = await request.json();

    if (!groupName || !Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json(
        { message: "groupName and agentIds[] are required." },
        { status: 400 }
      );
    }

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

    const group = await prisma.agentGroup.findUnique({
      where: { GroupName: groupName },
    });

    if (!group) {
      return NextResponse.json(
        { message: `Group "${groupName}" not found.` },
        { status: 404 }
      );
    }

    await prisma.assignedAgent.deleteMany({
      where: {
        AgentId: { in: agentIds },
        AgentGroupID: { not: group.AgentGroupID },
      },
    });

    await prisma.assignedAgent.createMany({
      data: agentIds.map((id) => ({
        AgentId: id,
        AgentGroupID: group.AgentGroupID,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      status: 200,
      message: `Agents updated to ${groupName} successfully.`,
    });
  } catch (error) {
    console.error("[PUT] Error updating agent group:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { agentIds } = await req.json();

  await prisma.assignedAgent.deleteMany({
    where: {
      AgentId: { in: agentIds },
    },
  });

  return NextResponse.json({ status: 200, message: "Agents unassigned." });
}
