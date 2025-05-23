import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";
import dayjs from "dayjs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("month"); // Format: "YYYY-MM"

  const [year, monthStr] = date.split("-");
  const monthNum = parseInt(monthStr);
  const startDate = new Date(`${year}-${monthStr}-01T00:00:00Z`);
  const endDate = new Date(new Date(startDate).setMonth(monthNum));

  try {
    // Get payment checkers (UserRoleId 3)
    const checkers = await prisma.Agent.findMany({
      where: { UserRoleId: 3 },
      select: { AgentId: true, AwsId: true, Username: true },
    });

    const checkerMap = new Map(checkers.map((c) => [c.AgentId, c.AwsId]));

    // Get assigned wallets (wallets assigned to agents)
    const assignedWallets = await prisma.assignedWallet.findMany();

    // Build AgentId → WalletID[] mapping
    const agentWalletMap = {};
    const walletMap = {};

    for (const aw of assignedWallets) {
      if (!agentWalletMap[aw.AgentId]) {
        agentWalletMap[aw.AgentId] = new Set();
      }
      agentWalletMap[aw.AgentId].add(aw.WalletId);
    }

    const wallets = await prisma.wallet.findMany({
      select: { WalletId: true, WalletName: true },
    });

    const walletNameMap = new Map(
      wallets.map((w) => [w.WalletId, w.WalletName])
    );

    for (const [agentId, walletSet] of Object.entries(agentWalletMap)) {
      walletMap[agentId] = [...walletSet]
        .map((walletId) => walletNameMap.get(walletId))
        .filter(Boolean);
    }

    // Get transaction agent assignments
    const txAgents = await prisma.TransactionAgent.findMany({
      orderBy: { LogDate: "desc" },
      select: {
        TransactionID: true,
        AgentID: true,
        LogDate: true,
      },
    });

    const latestAssignment = {};
    for (const ta of txAgents) {
      if (!latestAssignment[ta.TransactionID]) {
        latestAssignment[ta.TransactionID] = ta.AgentID;
      }
    }

    // Get transactions within date range
    const transactions = await prisma.Transactions.findMany({
      where: {
        TransactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        TransactionID: true,
        TransactionDate: true,
        PaymentCheckTime: true,
        PaymentCheck: true,
        WalletID: true,
      },
    });

    const grouped = {};

    for (const tx of transactions) {
      const agentId = latestAssignment[tx.TransactionID];
      if (!agentId || !checkerMap.has(agentId)) continue;

      const walletSet = agentWalletMap[agentId];
      if (!walletSet || !walletSet.has(tx.WalletID)) continue;

      if (!grouped[agentId]) {
        grouped[agentId] = {
          checkerId: agentId,
          name: checkerMap.get(agentId),
          checked: 0,
          pending: 0,
          durations: [],
          under48h: 0,
          over48h: 0,
        };
      }

      const record = grouped[agentId];

      if (tx.PaymentCheck === true && tx.PaymentCheckTime) {
        record.checked++;

        const duration = dayjs(tx.PaymentCheckTime).diff(
          dayjs(tx.TransactionDate),
          "hour",
          true
        );

        record.durations.push(duration);

        if (duration <= 48) {
          record.under48h++;
        } else {
          record.over48h++;
        }
      } else {
        record.pending++;
      }
    }

    const result = Object.values(grouped).map((checker) => {
      const totalChecked = checker.checked;
      const avgTime =
        totalChecked > 0
          ? (
              checker.durations.reduce((sum, t) => sum + t, 0) / totalChecked
            ).toFixed(2)
          : null;

      const underPct =
        totalChecked > 0
          ? ((checker.under48h / totalChecked) * 100).toFixed(1)
          : "0.0";

      const overPct =
        totalChecked > 0
          ? ((checker.over48h / totalChecked) * 100).toFixed(1)
          : "0.0";

      return {
        date: date,
        checkerId: checker.checkerId,
        name: checker.name,
        checked: totalChecked,
        pending: checker.pending,
        assignedWallet: walletMap[checker.checkerId] || [],
        averageTimeHours: avgTime ? `${avgTime}` : "N/A",
        under48hPercent: `${underPct}%`,
        over48hPercent: `${overPct}%`,
      };
    });

    return NextResponse.json({
      status: 200,
      message: "KPI data retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("KPI API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch KPI data" },
      { status: 500 }
    );
  }
}
