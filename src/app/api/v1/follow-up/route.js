import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const statusId = parseInt(searchParams.get("statusId") || "0", 10);
  const now = new Date();

  const currentYear = parseInt(searchParams.get("year"), 10);
  const currentMonth = parseInt(searchParams.get("month"), 10);

  const monthStart = new Date(Date.UTC(currentYear, currentMonth, 1));
  const monthEnd = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
  const twoMonthsAgoStart = new Date(
    Date.UTC(currentYear, currentMonth - 2, 1)
  );
  const oneMonthAgoEnd = new Date(Date.UTC(currentYear, currentMonth, 0));

  // Fetch all subscriptions
  const allSubscriptions = await prisma.subscription.findMany({
    select: {
      CustomerID: true,
      StartDate: true,
      EndDate: true,
    },
    orderBy: { StartDate: "asc" },
  });

  // Group subscriptions by customer
  const customerSubs = new Map();
  for (const { CustomerID, StartDate, EndDate } of allSubscriptions) {
    if (!customerSubs.has(CustomerID)) customerSubs.set(CustomerID, []);
    customerSubs.get(CustomerID).push({
      startDate: new Date(StartDate),
      endDate: new Date(EndDate),
    });
  }

  const followUpCustomerIDs = [];

  for (const [customerID, subs] of customerSubs.entries()) {
    const parsedSubs = subs.map(({ startDate, endDate }) => ({
      start: new Date(startDate),
      end: new Date(endDate),
    }));

    const isActiveInJune = parsedSubs.some(
      ({ end }) => end.getTime() >= monthStart.getTime()
    );

    const endedInAprOrMay = parsedSubs.some(
      ({ end }) =>
        end.getTime() >= twoMonthsAgoStart.getTime() &&
        end.getTime() <= oneMonthAgoEnd.getTime()
    );

    if (!isActiveInJune && endedInAprOrMay) {
      followUpCustomerIDs.push(customerID);
    }
  }

  // Fetch customer details
  const followUpCustomers = await prisma.customer.findMany({
    where: {
      CustomerId: { in: followUpCustomerIDs },
    },
    select: {
      CustomerId: true,
      Name: true,
      Email: true,
      CardID: true,
      ManyChatId: true,
      FollowUpStatus: {
        orderBy: { FollowUpDate: "desc" },
        take: 1,
        select: {
          FollowUpStatusID: true,
          FollowUpDate: true,
        },
      },
      Transactions: {
        orderBy: { TransactionDate: "desc" },
        take: 1,
        select: {
          Note: {
            select: { Note: true },
          },
          TransactionAgent: {
            orderBy: { LogDate: "desc" },
            take: 1,
            select: {
              Agent: {
                select: {
                  AgentId: true,
                  Username: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Format response
  const result = followUpCustomers
    .map((customer) => {
      const transaction = customer.Transactions[0];
      const agent = transaction?.TransactionAgent?.[0]?.Agent;
      const followUp = customer.FollowUpStatus?.[0];

      const status = followUp?.FollowUpStatusID ?? 1;

      return {
        customerId: customer.CustomerId,
        name: customer.Name,
        email: customer.Email,
        cardId: customer.CardID,
        manyChatId: customer.ManyChatId,
        lastFormAgent: agent ? agent.Username : null,
        note: transaction?.Note?.Note || null,
        followUpStatus: {
          statusId: status,
          followUpDate: followUp?.FollowUpDate ?? null,
        },
      };
    })
    .filter((c) => statusId === 0 || c.followUpStatus.statusId === statusId);

  return NextResponse.json({ success: true, data: result });
}
