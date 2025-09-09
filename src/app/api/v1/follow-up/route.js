import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const statusId = parseInt(searchParams.get("statusId") || "0", 10);

  // NEW: Parse multi-agent list (?agentIds=1,2,3)
  const agentIdsRaw = (searchParams.get("agentIds") || "").trim();
  const agentIds =
    agentIdsRaw.length > 0
      ? agentIdsRaw
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !Number.isNaN(n) && n > 0)
      : [];

  const currentYear = parseInt(searchParams.get("year") || "0", 10);
  const currentMonth = parseInt(searchParams.get("month") || "0", 10);

  // Pagination
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const offset = (page - 1) * pageSize;

  // Search
  const rawQ = (searchParams.get("q") || "").trim();
  const likeQ = `%${rawQ}%`;

  const monthStart = new Date(Date.UTC(currentYear, currentMonth, 1));
  const monthEnd = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
  const twoMonthsAgoStart = new Date(
    Date.UTC(currentYear, currentMonth - 2, 1)
  );
  const oneMonthAgoEnd = new Date(Date.UTC(currentYear, currentMonth, 0));

  try {
    // Dynamic agent filter
    const agentFilterSql =
      agentIds.length > 0
        ? `AND (LastAgentId IN (${agentIds.map(() => "?").join(",")}))`
        : "";

    // 1) Get eligible IDs
    const eligibleCustomerIdsQuery = `
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
      ),
      CustomerWithLatestData AS (
        SELECT DISTINCT
          c.CustomerId,
          c.Name,
          c.Email,
          c.CardID,
          c.ManyChatId,
          fuStatus.FollowUpStatusID,
          fuStatus.FollowUpDate,
          t.TransactionID,
          n.Note,
          ta.AgentID as LastAgentId,
          a.Username as LastAgentUsername,
          (SELECT COUNT(*) FROM FollowUpComment fc WHERE fc.CustomerID = c.CustomerId) as CommentCount
        FROM EligibleCustomers ec
        JOIN Customer c ON c.CustomerId = ec.CustomerID
        LEFT JOIN (
          SELECT 
            CustomerID, 
            FollowUpStatusID, 
            FollowUpDate,
            ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY FollowUpDate DESC) as rn
          FROM CustomerFollowUpStatus
        ) fuStatus ON fuStatus.CustomerID = c.CustomerId AND fuStatus.rn = 1
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
        LEFT JOIN (
          SELECT 
            TransactionID,
            AgentID,
            ROW_NUMBER() OVER (PARTITION BY TransactionID ORDER BY LogDate DESC) as rn
          FROM TransactionAgent
        ) latestAgentRanked ON latestAgentRanked.TransactionID = t.TransactionID AND latestAgentRanked.rn = 1
        LEFT JOIN TransactionAgent ta ON ta.TransactionID = t.TransactionID AND ta.AgentID = latestAgentRanked.AgentID
        LEFT JOIN Agent a ON a.AgentId = ta.AgentID
      )
      SELECT CustomerId
      FROM CustomerWithLatestData
      WHERE (? = 0 OR COALESCE(FollowUpStatusID, 1) = ?)
        ${agentFilterSql}
        AND (? = '' OR (
          Name       LIKE ?
          OR Email   LIKE ?
          OR CardID  LIKE ?
          OR ManyChatId LIKE ?
          OR Note    LIKE ?
        ))
      ORDER BY Name
    `;

    const eligibleIdsParams = [
      twoMonthsAgoStart,
      oneMonthAgoEnd,
      monthStart,
      // status filter
      statusId,
      statusId,
      // dynamic agent IDs
      ...agentIds,
      // search params
      rawQ,
      likeQ,
      likeQ,
      likeQ,
      likeQ,
      likeQ,
    ];

    const allEligibleIds = await prisma.$queryRawUnsafe(
      eligibleCustomerIdsQuery,
      ...eligibleIdsParams
    );

    const total = allEligibleIds.length;

    // 2) Paginate
    const paginatedIds = allEligibleIds
      .slice(offset, offset + pageSize)
      .map((row) => row.CustomerId);

    if (paginatedIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }

    // 3) Fetch data for paginated IDs
    const placeholders = paginatedIds.map(() => "?").join(",");
    const followUpCustomersQuery = `
      WITH CustomerWithLatestData AS (
        SELECT DISTINCT
          c.CustomerId,
          c.Name,
          c.Email,
          c.CardID,
          c.ManyChatId,
          fuStatus.FollowUpStatusID,
          fuStatus.FollowUpDate,
          t.TransactionID,
          n.Note,
          ta.AgentID as LastAgentId,
          a.Username as LastAgentUsername,
          (SELECT COUNT(*) FROM FollowUpComment fc WHERE fc.CustomerID = c.CustomerId) as CommentCount
        FROM Customer c
        LEFT JOIN (
          SELECT 
            CustomerID, 
            FollowUpStatusID, 
            FollowUpDate,
            ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY FollowUpDate DESC) as rn
          FROM CustomerFollowUpStatus
        ) fuStatus ON fuStatus.CustomerID = c.CustomerId AND fuStatus.rn = 1
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
        LEFT JOIN (
          SELECT 
            TransactionID,
            AgentID,
            ROW_NUMBER() OVER (PARTITION BY TransactionID ORDER BY LogDate DESC) as rn
          FROM TransactionAgent
        ) latestAgentRanked ON latestAgentRanked.TransactionID = t.TransactionID AND latestAgentRanked.rn = 1
        LEFT JOIN TransactionAgent ta ON ta.TransactionID = t.TransactionID AND ta.AgentID = latestAgentRanked.AgentID
        LEFT JOIN Agent a ON a.AgentId = ta.AgentID
      )
      SELECT *
      FROM CustomerWithLatestData
      WHERE CustomerId IN (${placeholders})
      ORDER BY Name
    `;

    const customers = await prisma.$queryRawUnsafe(
      followUpCustomersQuery,
      ...paginatedIds
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

      allComments.forEach((comment) => {
        if (!commentsMap.has(comment.CustomerID)) {
          commentsMap.set(comment.CustomerID, []);
        }
        commentsMap?.get(comment.CustomerID)?.push({
          id: comment.Id,
          comment: comment.Comment,
          isResolved: comment.Is_Resolved,
          agentUsername: comment.Agent?.Username ?? null,
          agentId: comment.Agent?.AgentId ?? null,
          createdAt: comment.CreatedAt,
        });
      });
    }

    // Format final response (dedupe)
    const customerMap = new Map();
    customers.forEach((customer) => {
      const customerId = customer.CustomerId;
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
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
        });
      }
    });

    const result = Array.from(customerMap.values());

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Follow-up API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
