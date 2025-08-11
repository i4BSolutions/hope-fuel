import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerId = parseInt(searchParams.get("customerId") || "0", 10);

  // Fetch all comments
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
    orderBy: { CreatedAt: "asc" },
  });

  if (!comments || comments.length === 0) {
    return NextResponse.json(
      { message: "No comments found", data: [] },
      { status: 404 }
    );
  }

  return NextResponse.json(comments);
}

export async function POST(req) {
  const { customerId, agentId, comment } = await req.json();

  if (!customerId || !agentId || !comment) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // Create a new comment
  const newComment = await prisma.followUpComment.create({
    data: {
      CustomerID: customerId,
      AgentId: agentId,
      Comment: comment,
      Is_Resolved: false,
      CreatedAt: new Date(),
    },
  });

  return NextResponse.json(
    { message: "Comment added successfully", data: newComment },
    { status: 201 }
  );
}

export async function PATCH(req) {
  const { commentId, isResolved } = await req.json();

  if (commentId === undefined || isResolved === undefined) {
    return NextResponse.json(
      { message: "Missing required fields: commentId and isResolved" },
      { status: 400 }
    );
  }

  try {
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
      { message: "Comment status updated successfully", data: updatedComment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment status:", error);
    return NextResponse.json(
      { message: "Failed to update comment status" },
      { status: 500 }
    );
  }
}
