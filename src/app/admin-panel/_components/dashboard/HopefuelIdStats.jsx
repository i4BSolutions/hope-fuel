import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import HopeFuelIDStatusChart from "../dashboard/_components/HopeFuelIDStatusChart";

export default function HopefuelIdStats({ currentMonth }) {
  const [transactionStatuses, setTransactionStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTransactionStatuses = async () => {
      setLoading(true);

      const year = currentMonth.year();
      const month = currentMonth.month() + 1;

      try {
        const response = await fetch(
          `/api/agent/transaction-status?year=${year}&month=${month}`
        );
        const data = await response.json();
        if (data.status === 200) {
          setTransactionStatuses(data.statusBreakdown);
        } else {
          console.error("Error fetching transaction statuses:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setTransactionStatuses([]);
      } finally {
        setLoading(false);
      }
    };
    getTransactionStatuses();
  }, [currentMonth]);

  if (!transactionStatuses) return null;

  return (
    <>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ borderRadius: "8px" }}
        />
      ) : (
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              color: "#0F172A",
              fontSize: { xs: "16px", sm: "17px", md: "19px" },
              fontWeight: 600,
              lineHeight: { xs: "20px", sm: "21px", md: "23px" },
              letterSpacing: "-2%",
            }}
          >
            PRFHQ by status
          </Typography>
          <Box sx={{ mt: 1, width: "100%" }}>
            <HopeFuelIDStatusChart hopeFuelStatuses={transactionStatuses} />
          </Box>
        </Box>
      )}
    </>
  );
}
