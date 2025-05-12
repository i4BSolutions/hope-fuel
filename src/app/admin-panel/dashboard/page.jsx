import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Suspense, useState } from "react";
import CustomerStats from "../_components/CustomerStats";
import MonthYearPicker from "../_components/MonthYearPicker";
import PaymentCheckerStats from "../_components/PaymentCheckerStats";
import SupportAgentStats from "../_components/SupportAgentStats";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  return (
    <Box sx={{ py: 3 }}>
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
      <Typography>Welcome to the admin panel dashboard!</Typography>

      <Suspense fallback={<Loading />}>
        <CustomerStats currentMonth={currentMonth} />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <SupportAgentStats currentMonth={currentMonth} />
      </Suspense>

      <Suspense>
        <PaymentCheckerStats currentMonth={currentMonth} />
      </Suspense>
    </Box>
  );
}
