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

  const subscriptionMap = new Map();
  for (const { CustomerID, StartDate, EndDate } of allSubscriptions) {
    if (!subscriptionMap.has(CustomerID)) subscriptionMap.set(CustomerID, []);
    subscriptionMap.get(CustomerID).push({
      startDate: new Date(StartDate),
      endDate: new Date(EndDate),
    });
  }

  function computeStats(year, month) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const lastMonthEnd = new Date(year, month, 0);
    const twoMonthsAgo = new Date(year, month - 2, 1);
    const now = new Date();

    let active = new Set();
    let newActive = new Set();
    let oldActive = new Set();
    let followUp = new Set();

    for (const [customerId, subs] of subscriptionMap.entries()) {
      const sorted = subs.sort((a, b) => a.startDate - b.startDate);
      const firstSub = sorted[0];
      const lastSub = sorted[sorted.length - 1];
      const isActive = sorted.some(({ _, endDate }) => endDate >= now);
      const isNew =
        firstSub.startDate >= monthStart && firstSub.startDate <= monthEnd;
      const expiredRecently =
        lastSub.endDate >= lastMonthEnd && lastSub.endDate <= twoMonthsAgo;

      if (isActive) {
        active.add(customerId);
        if (isNew) {
          newActive.add(customerId);
        } else {
          oldActive.add(customerId);
        }
      } else if (expiredRecently) {
        followUp.add(customerId);
      }
    }

    return {
      totalActiveCustomers: active.size,
      newActiveCustomers: newActive.size,
      oldActiveCustomers: oldActive.size,
      followUpCustomers: followUp.size,
    };
  }

  const currentStats = computeStats(currentYear, currentMonth);

  const previousMonthDate = new Date(currentYear, currentMonth - 2, 1);
  const previousStats = computeStats(
    previousMonthDate.getFullYear(),
    previousMonthDate.getMonth() + 1
  );

  const trend = [];
  for (let i = 6; i > 0; i--) {
    const date = new Date(currentYear, currentMonth - i - 1, 1);
    const stats = computeStats(date.getFullYear(), date.getMonth() + 1);
    trend.push({
      month: date.toLocaleString("default", { month: "long" }),
      stats,
    });
  }

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
