import { NextResponse } from "next/server";
import prisma from "../../../utilites/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const now = new Date();

  const currentYear = parseInt(
    searchParams.get("year") || now.getFullYear(),
    10
  );
  const currentMonth = parseInt(
    searchParams.get("month") || now.getMonth() + 1,
    10
  );

  const allSubscriptions = await prisma.subscription.findMany({
    select: {
      CustomerID: true,
      StartDate: true,
      EndDate: true,
    },
    orderBy: { StartDate: "asc" },
  });

  const customerSubs = new Map();
  for (const { CustomerID, StartDate, EndDate } of allSubscriptions) {
    if (!customerSubs.has(CustomerID)) customerSubs.set(CustomerID, []);
    customerSubs.get(CustomerID).push({
      startDate: new Date(StartDate),
      endDate: new Date(EndDate),
    });
  }

  function computeStats(year, month) {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    const twoMonthsAgoStart = new Date(year, month - 3, 1);
    const oneMonthAgoEnd = new Date(year, month - 1, 0);

    let newActive = 0;
    let oldActive = 0;
    let followUp = 0;

    for (const subs of customerSubs.values()) {
      const activeInTarget = subs.some(
        ({ startDate, endDate }) =>
          startDate <= monthEnd && endDate >= monthStart
      );

      const activeInRecentPast = subs.some(
        ({ startDate, endDate }) =>
          startDate <= oneMonthAgoEnd && endDate >= twoMonthsAgoStart
      );

      if (subs.length === 1 && activeInTarget) {
        newActive++;
      } else if (subs.length > 1 && activeInTarget) {
        oldActive++;
      } else if (subs.length >= 1 && !activeInTarget && activeInRecentPast) {
        followUp++;
      }
    }

    return {
      totalActiveCustomers: newActive + oldActive,
      newActiveCustomers: newActive,
      oldActiveCustomers: oldActive,
      followUpCustomers: followUp,
    };
  }

  const currentStats = computeStats(currentYear, currentMonth);

  const trend = [];
  for (let i = 6; i > 0; i--) {
    const d = new Date(currentYear, currentMonth - i);
    const trendStats = computeStats(d.getFullYear(), d.getMonth() + 1);
    trend.push({
      month: d.toLocaleString("default", { month: "long" }),
      stats: trendStats,
    });
  }

  const previousMonth = new Date(currentYear, currentMonth - 2, 1);
  const previousStats = computeStats(
    previousMonth.getFullYear(),
    previousMonth.getMonth() + 1
  );

  return NextResponse.json({
    currentMonth: { ...currentStats },
    previousMonth: {
      totalActiveCustomers: previousStats.totalActiveCustomers,
      newActiveCustomers: previousStats.newActiveCustomers,
      oldActiveCustomers: previousStats.oldActiveCustomers,
      followUpCustomers: null,
    },
    trend,
  });
}
