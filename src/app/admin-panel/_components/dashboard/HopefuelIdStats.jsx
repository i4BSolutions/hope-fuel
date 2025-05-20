import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import HopeFuelIDStatusChart from "../dashboard/_components/HopeFuelIDStatusChart";
import { useEffect, useState } from "react";

export default function HopefuelIdStats() {
  const [transactionStatuses, setTransactionStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const getTransactionStatuses = async () => {
      setLoading(true);
      setError(null);
      setSnackbarOpen(false);
      try {
        const response = await fetch("api/agent/transaction-status");
        const data = await response.json();
        if (data.status === 200) {
          setTransactionStatuses(data.statusBreakdown);
        } else {
          console.error("Error fetching transactions count:", data.error);
          setError(data.error);
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching transactions count:", error);
        setError(error.message);
        setSnackbarOpen(true);
        setTransactionStatuses([]);
      } finally {
        setLoading(false);
      }
    };
    getTransactionStatuses();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!transactionStatuses) return null;

  return (
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
        Hopefuel IDs by status
      </Typography>
      <Box sx={{ mt: 1, width: "100%" }}>
        <HopeFuelIDStatusChart hopeFuelStatuses={transactionStatuses} />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
