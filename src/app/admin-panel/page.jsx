"use client";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import Dashboard from "./_components/dashboard/page";
import ExchangeRates from "./_components/exchangeRate/page";
import ExportCSVPage from "./_components/exportCsv/page";
import FormOpenClosePage from "./_components/formOpenClose/page";

const tabSx = {
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  px: 0,
  mr: 2,
  "&:last-of-type": {
    mr: 0,
  },
};

const tabs = [
  { label: "Dashboard", component: () => <Dashboard /> },
  { label: "Form Open/Close", component: () => <FormOpenClosePage /> },
  { label: "Currency Exchange Rate", component: () => <ExchangeRates /> },
  { label: "Export CSV", component: () => <ExportCSVPage /> },
];

export default function AdminPanel() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ px: 2 }}>
      <Typography sx={{ fontSize: "34px", fontWeight: 600 }}>
        Admin Panel
      </Typography>

      <Box sx={{ borderBottom: 2, borderColor: "#E2E8F0" }}>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => setTabIndex(newValue)}
          aria-label="Admin Panel Tabs"
          sx={{
            "& .MuiTab-root": {
              color: (theme) => theme.palette.neutral.grey900,
            },
            "& .Mui-selected": {
              color: (theme) => theme.palette.primary.red500,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: (theme) => theme.palette.primary.red500,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.label} label={tab.label} sx={tabSx} />
          ))}
        </Tabs>
      </Box>

      {tabs[tabIndex].component()}
    </Box>
  );
}
