"use client";

import { Box, Typography } from "@mui/material";
import FormFillingAgentRateTable from "./_components/FormFillingAgentRateTable";
import { useEffect, useState } from "react";
import { AGENT_RATES } from "../../../variables/const";

export default function SupportAgentStats({ currentMonth }) {
  const [pages, setPages] = useState({});
  const [agentRates, setAgentRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAgentRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("api/agent/agent-rates");
        const data = await response.json();
        console.log("Data:", data);
        setAgentRates(data.data);
      } catch (error) {
        console.error("Error fetching agent rates:", error);
        setError(error.message);
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
        {agentRates.map((groupData, index) => (
          <FormFillingAgentRateTable
            key={groupData.groupName}
            data={groupData}
            page={pages[index] || 1}
            setPage={(value) => handlePageChange(index, value)}
            headerColor={index % 2 === 0 ? "#DC2626" : "#FF732C"}
            progressColor={index % 2 === 0 ? "#DC2626" : "#FF732C"}
          />
        ))}
      </Box>
    </Box>
  );
}
