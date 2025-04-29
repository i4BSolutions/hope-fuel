"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Modal,
  Pagination,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

import moment from "moment-timezone";
import CustomButton from "../../components/Button";
import TransactionList from "../../UI/Components/TransactionList";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const ExportCSVPage = () => {
  const [date, setDate] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openCSVExportModal, setOpenCSVExportModal] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const bothDateSelected = date && date[0] && date[1];

  const paginatedTransactions = useMemo(() => {
    if (!allTransactions.length) return [];

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allTransactions.slice(startIndex, endIndex);
  }, [allTransactions, page, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(allTransactions.length / itemsPerPage);
  }, [allTransactions, itemsPerPage]);

  useEffect(() => {
    if (bothDateSelected) {
      getCardIssuedTransactions();
    }
  }, [date]);

  useEffect(() => {
    setPage(1);
  }, [allTransactions]);

  const handleDateChange = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const getCardIssuedTransactions = async () => {
    if (loading) return;
    if (!date || !date[0] || !date[1]) return;

    setLoading(true);
    try {
      let startDateFormatted, endDateFormatted;
      try {
        startDateFormatted = moment(date[0].$d).format("YYYY-MM-DD");
        endDateFormatted = moment(date[1].$d).format("YYYY-MM-DD");
      } catch (dateError) {
        console.error("Date formatting error:", dateError);
        setError("Invalid date format. Please try again.");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      const url = `api/transactions/export-confirm-payments?startDate=${startDateFormatted}&endDate=${endDateFormatted}&transactionStatus=Payment Checked`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch data (${response.status})`
        );
      }

      const result = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid data format received from server");
      }

      setAllTransactions(result.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message || "Failed to fetch transactions");
      setOpenSnackbar(true);
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCSVExportModal = useCallback(() => {
    setOpenCSVExportModal((prev) => !prev);
  }, []);

  const handleCloseCSVExportModal = useCallback(() => {
    setOpenCSVExportModal((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setOpenSnackbar((prev) => !prev);
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      setLoading(true);
      if (!allTransactions || allTransactions.length === 0) {
        throw new Error("No data available to export");
      }

      const headers = [
        "Hope ID",
        "Name",
        "Email",
        "Card ID",
        "Date",
        "Amount",
        "Currency",
        "Period",
        "ManyChat ID",
        "Transaction Status",
      ];

      let csvContent = headers.join(",") + "\n";

      allTransactions.forEach((transaction) => {
        const row = [
          transaction.HopeFuelID || "",
          transaction.Name || "",
          transaction.Email || "",
          transaction.CardID || "",
          moment(transaction.TransactionDate).format("YYYY-MM-DD") || "",
          transaction.Amount || "",
          transaction.CurrencyCode || "",
          transaction.Month + " " + "Month" || "",
          transaction.ManyChatId || "",
          "Card Issued",
        ];
        const escapedRow = row.map((field) => {
          if (/[",\n\r]/.test(field)) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        });
        csvContent += escapedRow.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      const startDate = moment(date[0].$d).format("YYYY-MM-DD hh:mm");
      const endDate = moment(date[1].$d).format("YYYY-MM-DD hh:mm");
      link.href = url;
      link.download = `ConfirmedPayment_Export_${startDate}_to_${endDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      handleCloseCSVExportModal();
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError(error.message || "Failed to export CSV");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, [allTransactions, date, handleCloseCSVExportModal]);

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
            onChange={handleDateChange}
            disableFuture
          />
        </DemoContainer>
      </LocalizationProvider>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {bothDateSelected && !loading && (
        <>
          {allTransactions.length > 0 ? (
            <>
              <Box sx={{ width: "100%", mt: 4 }}>
                <TransactionList transactions={paginatedTransactions} />
              </Box>

              {totalPages > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}

              <Box sx={{ mt: 2, mb: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {paginatedTransactions.length} of{" "}
                  {allTransactions.length} transactions
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ mt: 4, mb: 4 }}>
              <Typography variant="body1">
                No transactions found for the selected date range.
              </Typography>
            </Box>
          )}
        </>
      )}
      <Box sx={{ mt: 2 }}>
        <CustomButton
          disabled={
            !bothDateSelected || loading || allTransactions.length === 0
          }
          variant="contained"
          text="Export CSV"
          onClick={handleOpenCSVExportModal}
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
              onClick={handleExportCSV}
            />
          </Box>
        </Paper>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error || "An error occurred"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExportCSVPage;
