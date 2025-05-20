"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import FormFillingAgentRateTable from "./_components/FormFillingAgentRateTable";
import { useEffect, useState } from "react";

export default function SupportAgentStats() {
  const [pages, setPages] = useState({});
  const [agentRates, setAgentRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const getAgentRates = async () => {
      setLoading(true);
      setError(null);
      setSnackbarOpen(false);
      try {
        const response = await fetch("api/agent/agent-group");
        const data = await response.json();
        if (data.status === 200) {
          setAgentRates(data.data.result);
        } else {
          console.error("Error fetching transactions count:", data.error);
          setError(data.error);
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching agent rates:", error);
        setError(error.message);
        setSnackbarOpen(true);
        setAgentRates([]);
      } finally {
        setLoading(false);
      }
    };
    getAgentRates();
  }, []);

  const handlePageChange = (index, newPage) => {
    setPages((prev) => ({
      ...prev,
      [index]: newPage,
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }
  console.log("Agent Rates:", agentRates);

  if (!agentRates) return null;

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
        Form Filling Agent Rate
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8.5,
          mt: 1,
        }}
      >
        {agentRates.length > 0 ? (
          agentRates.map((groupData, index) => (
            <FormFillingAgentRateTable
              key={groupData.groupName}
              data={groupData}
              page={pages[index] || 1}
              setPage={(value) => handlePageChange(index, value)}
              headerColor={index % 2 === 0 ? "#DC2626" : "#FF732C"}
              progressColor={index % 2 === 0 ? "#DC2626" : "#FF732C"}
            />
          ))
        ) : (
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 600,
              fontSize: "23px",
              lineHeight: "28px",
              letterSpacing: "-2%",
            }}
          >
            There is no hopefuel id status.
          </Typography>
        )}
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
