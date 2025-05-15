import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { Box, Typography } from "@mui/material";

import PaymentStatsCard from "./_components/PaymentStatsCard";
import PaymentCheckerTable from "./_components/PaymentCheckerTable";
import WalletGrid from "./_components/WalletGrid";

export default function PaymentCheckerStats({ currentMonth }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [checkerKPI, setCheckerKPI] = useState([]);

  const formattedDate = dayjs(currentMonth).format("YYYY-MM");

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await fetch(
          `/api/transactions/status-summary?month=${formattedDate}`
        );

        const data = await response.json();

        if (data.status === 200) {
          setPendingCount(data.data.pending);
          setCheckedCount(data.data.checked);
        } else {
          console.error("Error fetching pending count:", data.message);
        }
      } catch (error) {
        console.error("Error fetching pending count:", error);
      }
    };

    const fetchCheckerKPI = async () => {
      try {
        const response = await fetch(
          `/api/transactions/checker-kpis?month=${formattedDate}`
        );

        const data = await response.json();

        if (data.status === 200) {
          setCheckerKPI(data.data);
        } else {
          console.error("Error fetching checker KPI:", data.message);
        }
      } catch (error) {
        console.error("Error fetching checker KPI:", error);
      }
    };

    fetchPendingCount();
    fetchCheckerKPI();
  }, [currentMonth, formattedDate]);

  return (
    <Box mt={4}>
      <Typography variant="h8" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Payment Checking Agent Rate
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 250 }}>
          <PaymentStatsCard checked={checkedCount} pending={pendingCount} />
        </Box>
        <Box sx={{ flex: 3, minWidth: "300px" }}>
          <PaymentCheckerTable data={checkerKPI} />
        </Box>
      </Box>
      <Box sx={{ mt: 2, width: "100%" }}>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            width: "100%",
          }}
        >
          <WalletGrid currentMonth={formattedDate} />
        </Box>
      </Box>
    </Box>
  );
}
