"use client";

import React, { useCallback, useState } from "react";

import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

import moment from "moment-timezone";
import CustomButton from "../../components/Button";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

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
      <Box sx={{ mt: 3 }}>
        <CustomButton
          disabled={!date}
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
            <Button
              startIcon={<CloseIcon />}
              variant="outlined"
              color="primary"
              onClick={handleCloseCSVExportModal}
              sx={{
                minWidth: 80,
                borderColor: "#DC2626",
                borderRadius: 10,
                color: "#DC2626",
              }}
            >
              No
            </Button>

            <Button
              startIcon={<CheckIcon />}
              variant="contained"
              color="error"
              // onClick={handleDeleteFundraiserConfirm}
              sx={{
                color: "#F8FAFC",
                minWidth: 80,
                backgroundColor: "#DC2626",
                borderRadius: 10,
                "&:hover": {
                  backgroundColor: "#DC2626",
                },
              }}
            >
              Yes
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default ExportCSVPage;
