import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import FollowUpCustomers from "../../../../lib/icons/FollowUpCustomers";
import LegendNode from "../../../../lib/icons/LegendNode";
import NewCustomers from "../../../../lib/icons/NewCustomers";
import OldCustomers from "../../../../lib/icons/OldCustomers";
import TotalCustomers from "../../../../lib/icons/TotalCustomers";
import CustomerCard from "./_components/CustomerCard";
import CustomerStatsSkeleton from "./CustomerStatsSkeleton";

const data = [
  {
    key: "totalActiveCustomers",
    title: "Total Customers",
    icon: () => <TotalCustomers />,
  },
  {
    key: "newActiveCustomers",
    title: "New Customers",
    icon: () => <NewCustomers />,
  },
  {
    key: "oldActiveCustomers",
    title: "Old Customers",
    icon: () => <OldCustomers />,
  },
  {
    key: "followUpCustomers",
    title: "Follow Up Customers",
    icon: () => <FollowUpCustomers />,
  },
];

export default function CustomerStats({ currentMonth }) {
  const [chartData, setChartData] = useState([]);
  const [cardData, setCardData] = useState(data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = currentMonth.year();
    const month = currentMonth.month();
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/customers/stats/?year=${year}&month=${month}`
        );
        const result = await response.json();
        const formattedChartData = result.trend.map((item) => ({
          month: item.month,
          total: item.stats.totalActiveCustomers,
          new: item.stats.newActiveCustomers,
          old: item.stats.oldActiveCustomers,
        }));
        setChartData(formattedChartData);

        const formattedCardData = data.map((item) => ({
          ...item,
          count: result.currentMonth[item.key],
          prevCount: result.previousMonth[item.key],
        }));
        setCardData(formattedCardData);
      } catch (error) {
        console.error("Error fetching customer stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth]);

  if (loading) {
    return <CustomerStatsSkeleton />;
  }

  if (!chartData.length || !cardData.length) return null;
  return (
    <Box>
      <Typography
        sx={{
          color: "#0F172A",
          fontSize: "19px",
          fontWeight: 600,
          lineHeight: "23px",
          mb: 1,
        }}
      >
        Customers
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexShrink: 0,
            flexGrow: 0,
            gap: 2.5,
            flexWrap: "wrap",
            width: 520,
          }}
        >
          {cardData.map((stats) => (
            <CustomerCard stats={stats} key={stats.key} />
          ))}
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "432px",
            borderRadius: 5,
            backgroundColor: "#ffffff",
            border: "2px solid #CBD5E1",
          }}
        >
          <LineChart
            dataset={chartData}
            xAxis={[
              {
                scaleType: "point",
                dataKey: "month",
                disableLine: true,
                disableTicks: true,
              },
            ]}
            yAxis={[
              {
                disableLine: true,
                disableTicks: true,
                valueFormatter: (value) => {
                  return value;
                },
              },
            ]}
            series={[
              {
                label: "Total Customers",
                dataKey: "total",
                curve: "natural",
                color: "#DC2626",
                labelMarkType: () => <LegendNode colorCode="#DC2626" />,
              },
              {
                label: "New Customers",
                dataKey: "new",
                curve: "natural",
                color: "#FBBF24",
                labelMarkType: () => <LegendNode colorCode="#FBBF24" />,
              },
              {
                label: "Old Customers",
                dataKey: "old",
                curve: "natural",
                color: "#6183E4",
                labelMarkType: () => <LegendNode colorCode="#6183E4" />,
              },
            ]}
            height={380}
            grid={{ vertical: true, horizontal: true }}
            slotProps={{
              legend: {
                direction: "horizontal",
                position: {
                  vertical: "bottom",
                  horizontal: "center",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
