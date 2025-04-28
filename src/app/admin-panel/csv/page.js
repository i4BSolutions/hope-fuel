"use client";

import React, { useCallback, useState } from "react";

import { Box, Modal, Paper, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

import moment from "moment-timezone";
import CustomButton from "../../components/Button";
import TransactionList from "../../UI/Components/TransactionList";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const transactions = Array(8)
  .fill()
  .map(() => ({
    hopeId: "HOPEID-1024",
    name: "Maung Maung",
    email: "maungmaung@gmail.com",
    cardId: "12345678",
    date: "28-11-2024 09:55:00",
    amount: "600,000",
    currency: "MMK",
    period: "3",
    periodUnit: "Month",
    manychatId: "77777777",
  }));

const ExportCSVPage = () => {
  const [date, setDate] = useState("");
  const [openCSVExportModal, setOpenCSVExportModal] = useState(false);

  const handleDateChange = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleOpenCSVExportModal = useCallback(() => {
    setOpenCSVExportModal(true);
  }, []);

  const handleCloseCSVExportModal = useCallback(() => {
    setOpenCSVExportModal(false);
  }, []);

  const bothDateSelected = date && date[0] && date[1];

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
          <DateRangePicker value={date} onChange={handleDateChange} />
        </DemoContainer>
      </LocalizationProvider>
      {bothDateSelected && <TransactionList transactions={transactions} />}
      <Box sx={{ mt: 2 }}>
        <CustomButton
          disabled={!bothDateSelected}
          onClick={handleOpenCSVExportModal}
          variant="contained"
          text="Export CSV"
        />
      </Box>
      <Modal
        open={openCSVExportModal}
        onClose={handleCloseCSVExportModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ alignSelf: "center", justifyItems: "center" }}
      >
        <Paper
          sx={{
            backgroundColor: "#F8FAFC",
            width: 280,
            height: 146,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Are you sure you want to export?
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
            }}
          >
            <CustomButton
              icon={<CloseIcon />}
              color="primary"
              variant="outlined"
              text="No"
              onClick={handleCloseCSVExportModal}
            />

            <CustomButton
              icon={<CheckIcon />}
              color="primary"
              variant="contained"
              text="Yes"
            />
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default ExportCSVPage;
