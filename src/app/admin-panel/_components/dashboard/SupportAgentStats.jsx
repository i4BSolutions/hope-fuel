"use client";

import {
  Alert,
  Box,
  Skeleton,
  Snackbar,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
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
          setAgentRates(
            data.data.result.filter((group) => group.AgentGroupID !== null)
          );
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

  if (!agentRates) return null;

  return (
    <>
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton variant="text" width={120} height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="rectangular" width={220} height={36} />
            </TableCell>
          </TableRow>
        ))
      ) : (
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 2,
                  justifyContent: "center",
                  width: "100%",
                  height: "300px",
                }}
              >
                <InboxIcon sx={{ fontSize: 60, color: "#999999" }} />
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: 600,
                    fontSize: "23px",
                    lineHeight: "28px",
                    letterSpacing: "-2%",
                    mt: 1,
                  }}
                >
                  There is no form filling agent rates.
                </Typography>
              </Box>
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
      )}
    </>
  );
}
