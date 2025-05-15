import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect } from "react";
import FollowUpCustomers from "../../../../lib/icons/FollowUpCustomers";
import LegendNode from "../../../../lib/icons/LegendNode";
import NewCustomers from "../../../../lib/icons/NewCustomers";
import OldCustomers from "../../../../lib/icons/OldCustomers";
import TotalCustomers from "../../../../lib/icons/TotalCustomers";
import CustomerCard from "./_components/CustomerCard";

const data = [
  {
    title: "Total Customers",
    icon: () => <TotalCustomers />,
    count: 1000,
    prevCount: 900,
  },
  {
    title: "New Customers",
    icon: () => <NewCustomers />,
    count: 200,
    prevCount: 150,
  },
  {
    title: "Old Customers",
    icon: () => <OldCustomers />,
    count: 800,
    prevCount: 750,
  },
  {
    title: "Follow Up Customers",
    icon: () => <FollowUpCustomers />,
    count: 300,
    prevCount: null,
  },
];

const chartData = [
  { month: "January", total: 6500, new: 2100, old: 3000 },
  { month: "February", total: 8000, new: 2300, old: 2800 },
  { month: "March", total: 7900, new: 4000, old: 2100 },
  { month: "April", total: 9000, new: 4000, old: 2200 },
  { month: "May", total: 9100, new: 4000, old: 2000 },
  { month: "June", total: 9500, new: 5800, old: 500 },
];

export default function CustomerStats({ currentMonth }) {
  useEffect(() => {
    console.log("Current Month for customers:", currentMonth);
  }, [currentMonth]);

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
          {data.map((item, index) => (
            <CustomerCard stats={item} key={index} />
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
