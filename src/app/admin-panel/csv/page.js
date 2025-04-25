"use client";

import React, { useState } from "react";

import { Box, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

import moment from "moment-timezone";
import CustomButton from "../../components/Button";

const ExportCSVPage = () => {
  const [date, setDate] = useState(moment(new Date()));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        mt: 5,
      }}
    >
      <Typography sx={{ color: "#0F172A", fontSize: 16, fontWeight: "600" }}>
        Set Date Range
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateRangePicker"]}>
          <DateRangePicker
            value={date}
            onChange={(newDate) => {
              setDate(newDate);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      <Box sx={{ mt: 3 }}>
        <CustomButton
          onClick={() => {
            console.log("Export CSV");
          }}
          variant="contained"
          text="Export CSV"
        />
      </Box>
    </Box>
  );
};

export default ExportCSVPage;
