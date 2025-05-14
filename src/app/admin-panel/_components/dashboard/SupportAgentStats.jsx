"use client";

import { Box, Typography } from "@mui/material";
import FormFillingAgentRateTable from "../FormFillingAgentRateTable";
import { useState } from "react";
import { AGENT_RATES } from "../../../variables/const";

export default function SupportAgentStats({ currentMonth }) {
  const [pages, setPages] = useState({});

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
          gap: 4,
          mt: 1,
        }}
      >
        {AGENT_RATES.map((groupData, index) => (
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
