import { NextResponse } from "next/server";
import prisma from "../../../../utilites/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name")?.trim();
  const email = searchParams.get("email")?.trim();
  const cardId = searchParams.get("cardId")?.trim();
  const manyChatId = searchParams.get("manyChatId")?.trim();

  const whereClause = {
    AND: [
      name ? { Name: { contains: name, mode: "insensitive" } } : undefined,
      email ? { Email: { contains: email, mode: "insensitive" } } : undefined,
      cardId ? { CardID: parseInt(cardId, 10) } : undefined,
      manyChatId
        ? { ManyChatId: { contains: manyChatId, mode: "insensitive" } }
        : undefined,
    ].filter(Boolean),
  };

  const customers = await prisma.customer.findMany({
    where: whereClause,
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

  const result = customers.map((customer) => {
    const transaction = customer.Transactions[0];
    const agent = transaction?.TransactionAgent?.[0]?.Agent;
    const followUp = customer.FollowUpStatus[0];

    return {
      customerId: customer.CustomerId,
      name: customer.Name,
      email: customer.Email,
      cardId: customer.CardID,
      manyChatId: customer.ManyChatId,
      lastFormAgent: agent?.Username || null,
      note: transaction?.Note?.Note || null,
      followUpStatus: {
        statusId: followUp?.FollowUpStatusID ?? 1,
        followUpDate: followUp?.FollowUpDate ?? null,
      },
    };
  });

  return NextResponse.json({ results: result });
}
