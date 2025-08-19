import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const statusId = parseInt(searchParams.get("statusId") || "0", 10);
  const agentId = parseInt(searchParams.get("agentId") || "0", 10);

  const currentYear = parseInt(searchParams.get("year"), 10);
  const currentMonth = parseInt(searchParams.get("month"), 10);

  const monthStart = new Date(Date.UTC(currentYear, currentMonth, 1));
  const monthEnd = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
  const twoMonthsAgoStart = new Date(
    Date.UTC(currentYear, currentMonth - 2, 1)
  );
  const oneMonthAgoEnd = new Date(Date.UTC(currentYear, currentMonth, 0));

  try {
    // Optimized query: Find customers who need follow-up using a single database query
    const followUpCustomersQuery = `
      WITH CustomerLastSubscription AS (
        SELECT 
          CustomerID,
          MAX(EndDate) as LastEndDate,
          COUNT(*) as SubscriptionCount
        FROM Subscription 
        GROUP BY CustomerID
      ),
      EligibleCustomers AS (
        SELECT DISTINCT cls.CustomerID
        FROM CustomerLastSubscription cls
        WHERE cls.LastEndDate >= ? 
          AND cls.LastEndDate <= ?
          AND NOT EXISTS (
            SELECT 1 FROM Subscription s2 
            WHERE s2.CustomerID = cls.CustomerID 
              AND s2.EndDate >= ?
          )
      )
      SELECT 
        c.CustomerId,
        c.Name,
        c.Email,
        c.CardID,
        c.ManyChatId,
        
        -- Latest follow-up status (optimized with window function)
        fuStatus.FollowUpStatusID,
        fuStatus.FollowUpDate,
        
        -- Latest transaction and agent info
        t.TransactionID,
        n.Note,
        ta.AgentID as LastAgentId,
        a.Username as LastAgentUsername,
        
        -- Comment count for efficient loading
        (SELECT COUNT(*) FROM FollowUpComment fc WHERE fc.CustomerID = c.CustomerId) as CommentCount
        
      FROM EligibleCustomers ec
      JOIN Customer c ON c.CustomerId = ec.CustomerID
      
      -- Latest follow-up status (optimized)
      LEFT JOIN (
        SELECT 
          CustomerID, 
          FollowUpStatusID, 
          FollowUpDate,
          ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY FollowUpDate DESC) as rn
        FROM CustomerFollowUpStatus
      ) fuStatus ON fuStatus.CustomerID = c.CustomerId AND fuStatus.rn = 1
      
      -- Latest transaction with agent (optimized)
      LEFT JOIN (
        SELECT 
          CustomerID,
          TransactionID,
          NoteID,
          ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY TransactionDate DESC) as rn
        FROM Transactions
      ) latestTx ON latestTx.CustomerID = c.CustomerId AND latestTx.rn = 1
      
      LEFT JOIN Transactions t ON t.TransactionID = latestTx.TransactionID
      LEFT JOIN Note n ON n.NoteID = t.NoteID
      
      -- Latest agent for transaction
      LEFT JOIN (
        SELECT 
          TransactionID,
          AgentID,
          ROW_NUMBER() OVER (PARTITION BY TransactionID ORDER BY LogDate DESC) as rn
        FROM TransactionAgent
      ) latestAgent ON latestAgent.TransactionID = t.TransactionID AND latestAgent.rn = 1
      
      LEFT JOIN TransactionAgent ta ON ta.TransactionID = t.TransactionID AND ta.AgentID = latestAgent.AgentID
      LEFT JOIN Agent a ON a.AgentId = ta.AgentID
      
      WHERE (? = 0 OR COALESCE(fuStatus.FollowUpStatusID, 1) = ?)
        AND (? = 0 OR ta.AgentID = ?)
      
      ORDER BY c.Name
    `;

    const queryParams = [
      twoMonthsAgoStart,
      oneMonthAgoEnd,
      monthStart,
      statusId,
      statusId,
      agentId,
      agentId,
    ];

    // Execute the optimized query
    const customers = await prisma.$queryRawUnsafe(
      followUpCustomersQuery,
      ...queryParams
    );

    // Batch fetch comments only for customers that have them
    const customersWithComments = customers.filter((c) => c.CommentCount > 0);
    const customerIds = customersWithComments.map((c) => c.CustomerId);

    let commentsMap = new Map();
    if (customerIds.length > 0) {
      const allComments = await prisma.followUpComment.findMany({
        where: {
          CustomerID: { in: customerIds },
        },
        include: {
          Agent: {
            select: {
              AgentId: true,
              Username: true,
            },
          },
        },
        orderBy: { CreatedAt: "desc" },
      });

      // Group comments by customer
      allComments.forEach((comment) => {
        if (!commentsMap.has(comment.CustomerID)) {
          commentsMap.set(comment.CustomerID, []);
        }
        commentsMap.get(comment.CustomerID).push({
          id: comment.Id,
          comment: comment.Comment,
          isResolved: comment.Is_Resolved,
          agentUsername: comment.Agent?.Username ?? null,
          agentId: comment.Agent?.AgentId ?? null,
          createdAt: comment.CreatedAt,
        });
      });
    }

    // Format the final response
    const result = customers.map((customer) => ({
      customerId: customer.CustomerId,
      name: customer.Name,
      email: customer.Email,
      cardId: customer.CardID,
      manyChatId: customer.ManyChatId,
      lastFormAgent: customer.LastAgentUsername,
      agentId: customer.LastAgentId,
      note: customer.Note,
      followUpStatus: {
        statusId: customer.FollowUpStatusID ?? 1,
        followUpDate: customer.FollowUpDate,
      },
      comments: commentsMap.get(customer.CustomerId) || [],
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Follow-up API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
