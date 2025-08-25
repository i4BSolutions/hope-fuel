import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerId = parseInt(searchParams.get("customerId") || "0", 10);

  if (!customerId) {
    return NextResponse.json(
      { message: "Missing customerId parameter", data: [] },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.followUpComment.findMany({
      where: {
        CustomerID: customerId,
      },
      include: {
        Agent: {
          select: {
            AgentId: true,
            Username: true,
          },
        },
      },
      orderBy: { CreatedAt: "desc" }, // Most recent first for better UX
    });

    if (!comments || comments.length === 0) {
      return NextResponse.json(
        { message: "No comments found", data: [] },
        { status: 200 } // Changed to 200 for better API consistency
      );
    }

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { customerId, agentId, comment } = await req.json();

    if (!customerId || !agentId || !comment?.trim()) {
      return NextResponse.json(
        {
          message: "Missing required fields: customerId, agentId, and comment",
        },
        { status: 400 }
      );
    }

    // Validate that customer and agent exist (optional but recommended)
    const [customerExists, agentExists] = await Promise.all([
      prisma.customer.findUnique({
        where: { CustomerId: customerId },
        select: { CustomerId: true },
      }),
      prisma.agent.findUnique({
        where: { AgentId: agentId },
        select: { AgentId: true },
      }),
    ]);

    if (!customerExists) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    if (!agentExists) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 });
    }

    // Create a new comment with agent info included in response
    const newComment = await prisma.followUpComment.create({
      data: {
        CustomerID: customerId,
        AgentId: agentId,
        Comment: comment.trim(),
        Is_Resolved: false,
        CreatedAt: new Date(),
      },
      include: {
        Agent: {
          select: {
            AgentId: true,
            Username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
        data: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const { commentId, isResolved } = await req.json();

    if (commentId === undefined || isResolved === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: commentId and isResolved" },
        { status: 400 }
      );
    }

    // Check if comment exists first
    const existingComment = await prisma.followUpComment.findUnique({
      where: { Id: commentId },
      select: { Id: true },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Update the comment's resolved status
    const updatedComment = await prisma.followUpComment.update({
      where: {
        Id: commentId,
      },
      data: {
        Is_Resolved: isResolved,
      },
      include: {
        Agent: {
          select: {
            AgentId: true,
            Username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment status updated successfully",
        data: updatedComment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
