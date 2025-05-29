import { Box, Skeleton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PaymentCheckerTable from "./_components/PaymentCheckerTable";
import PaymentStatsCard from "./_components/PaymentStatsCard";
import WalletGrid from "./_components/WalletGrid";

export default function PaymentCheckerStats({ currentMonth }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [checkerKPI, setCheckerKPI] = useState([]);
  const [loading, setLoading] = useState(true);

  const formattedDate = dayjs(currentMonth).format("YYYY-MM");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pendingRes = await fetch(
          `/api/transactions/status-summary?month=${formattedDate}`
        );
        const pendingData = await pendingRes.json();

        if (pendingData.status === 200) {
          setPendingCount(pendingData.data.pending);
          setCheckedCount(pendingData.data.checked);
        } else {
          console.error("Error fetching pending count:", pendingData.message);
        }

        const kpiRes = await fetch(
          `/api/transactions/checker-kpis?month=${formattedDate}`
        );
        const kpiData = await kpiRes.json();

        if (kpiData.status === 200) {
          setCheckerKPI(kpiData.data);
        } else {
          console.error("Error fetching checker KPI:", kpiData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth, formattedDate]);

  return (
    <Box>
      <Typography
        sx={{
          color: "#0F172A",
          fontSize: "19px",
          fontWeight: 600,
          lineHeight: "23px",
          letterSpacing: "-2%",
        }}
      >
        Payment Checking Agent Rate
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "flex",
          gap: 2,
          width: "100%",
        }}
      >
        {loading ? (
          <Skeleton
            variant="rounded"
            width={320}
            height={280}
            sx={{ borderRadius: 5 }}
          />
        ) : (
          <PaymentStatsCard checked={checkedCount} pending={pendingCount} />
        )}
        {loading ? (
          <Skeleton
            variant="rounded"
            width="100%"
            height={280}
            sx={{ borderRadius: 5 }}
          />
        ) : (
          <PaymentCheckerTable data={checkerKPI} />
        )}
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            width: "100%",
          }}
        >
          {loading ? (
            <Skeleton variant="rounded" width="100%" height={400} />
          ) : (
            <WalletGrid currentMonth={formattedDate} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
