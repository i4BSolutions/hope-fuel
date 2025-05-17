"use client";

import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import CustomerStats from "./CustomerStats";
import HopefuelIdStats from "./HopefuelIdStats";
import MonthYearPicker from "./MonthYearPicker";
import PaymentCheckerStats from "./PaymentCheckerStats";
import SupportAgentStats from "./SupportAgentStats";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  return (
    <Box sx={{ py: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontSize: "34px",
            lineHeight: "40px",
            fontWeight: 600,
            letterSpacing: "-4%",
          }}
        >
          Dashboard
        </Typography>
        <MonthYearPicker
          currentMonth={currentMonth}
          handleMonthChange={handleMonthChange}
        />
      </Box>

      <CustomerStats currentMonth={currentMonth} />

      <HopefuelIdStats currentMonth={currentMonth} />

      <SupportAgentStats currentMonth={currentMonth} />

      <PaymentCheckerStats currentMonth={currentMonth} />
    </Box>
  );
}
