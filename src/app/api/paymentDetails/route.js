export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import db from "../../utilites/db";
import prisma from "../../utilites/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const HopeFuelID = searchParams.get("HopeFuelID");

  if (!HopeFuelID) {
    return NextResponse.json({ error: "Missing HopeFuelID" }, { status: 400 });
  }

  try {
    const transaction = await prisma.Transactions.findFirst({
      where: {
        HopeFuelID: parseInt(HopeFuelID, 10),
        FormStatus: {
          some: {},
        },
      },
      include: {
        Customer: {
          select: {
            ManyChatId: true,
            Name: true,
            Email: true,
            ExpireDate: true,
            CardID: true,
            Agent: {
              select: {
                AwsId: true,
                AgentId: true,
                Username: true,
              },
            },
          },
        },
        Wallet: {
          select: {
            WalletName: true,
            Currency: {
              select: {
                CurrencyCode: true,
              },
            },
          },
        },
        SupportRegion: {
          select: {
            Region: true,
          },
        },
        Note: {
          select: {
            Note: true,
          },
        },
        FormStatus: {
          select: {
            TransactionStatus: {
              select: {
                TransactionStatus: true,
              },
            },
          },
        },
        Screenshot: {
          select: {
            ScreenShotLink: true,
          },
        },
        TransactionAgent: {
          orderBy: {
            TransactionAgentID: "asc",
          },
          take: 1,
          select: {
            Agent: {
              select: {
                AwsId: true,
                Username: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json([], { status: 200 });
    }

    const firstAgent = transaction.TransactionAgent?.[0]?.Agent;

    const result = {
      TransactionID: transaction.TransactionID,
      HopeFuelID: transaction.HopeFuelID,
      WalletName: transaction.Wallet?.WalletName,
      Month: transaction.Month,
      Amount: transaction.Amount,
      NoteID: transaction.NoteID,
      TransactionDate: transaction.TransactionDate,
      CurrencyCode: transaction.Wallet?.Currency?.CurrencyCode,
      ManyChatId: transaction.Customer?.ManyChatId,
      Region: transaction.SupportRegion?.Region,
      Note: transaction.Note?.Note,
      Name: transaction.Customer?.Name,
      Email: transaction.Customer?.Email,
      ExpireDate: transaction.Customer?.ExpireDate,
      CardID: transaction.Customer?.CardID,
      AwsId: transaction.Customer?.Agent?.AwsId,
      AgentName: firstAgent?.Username,
      PrimaryAwsId: transaction.Customer?.Agent?.AgentId,
      LoggedAwsIds:
        transaction.TransactionAgent?.map((agent) => agent.Agent?.AwsId) || [],
      ScreenShotLinks:
        transaction.Screenshot?.map((ss) => ss.ScreenShotLink) || [],
      TransactionStatus:
        transaction.FormStatus?.[0]?.TransactionStatus?.TransactionStatus ??
        null,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const { HopeFuelID, Note, Status } = await request.json();

  if (!HopeFuelID) {
    return NextResponse.json({ error: "Missing HopeFuelID" }, { status: 400 });
  }

  const query = `
    UPDATE Transactions
    SET Note = ?, Status = ?
    WHERE HopeFuelID = ?;
  `;

  try {
    await db(query, [Note, Status, HopeFuelID]);
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
