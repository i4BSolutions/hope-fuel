"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid2,
  Modal,
  Pagination,
  Paper,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../../../components/Button";
import TransactionList from "../../../UI/Components/TransactionList";
import TransactionHistoryList from "../../../UI/Components/TransactionsHistoryList";
import csvHandler from "../../../utilites/exportCSV/csvHandler";

import { useAgentStore } from "../../../../stores/agentStore";
import dayjs from "dayjs";

const ExportCSVPage = () => {
  const { agent } = useAgentStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [date, setDate] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactionLogsHistory, setTransactionLogsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openCSVExportModal, setOpenCSVExportModal] = useState(false);
  const [openExportHistoryModal, setOpenExportHistoryModal] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const bothDateSelected = date && date[0] && date[1];

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / itemsPerPage);
  }, [totalCount, itemsPerPage]);

  useEffect(() => {
    if (bothDateSelected) {
      getCardIssuedTransactions();
    }
  }, [date, page]);

  useEffect(() => {
    getTransactionsLogsHistoryLists();
  }, []);

  const handleDateChange = useCallback((newDate) => {
    setDate(newDate);
    setPage(1);
  }, []);

  const getCardIssuedTransactions = async () => {
    console.log("Page:", page);
    if (loading) return;
    if (!date || !date[0] || !date[1]) return;

    setLoading(true);
    try {
      let startDateFormatted, endDateFormatted;
      try {
        startDateFormatted = dayjs(date[0].$d).format("YYYY-MM-DD");
        endDateFormatted = dayjs(date[1].$d).format("YYYY-MM-DD");
      } catch (dateError) {
        console.error("Date formatting error:", dateError);
        setError("Invalid date format. Please try again.");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      const url = `api/transactions/export-confirm-payments?startDate=${startDateFormatted}&endDate=${endDateFormatted}&transactionStatus=Payment Checked&page=${page}&limit=${itemsPerPage}`;

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

      setAllTransactions(result.data || []);
      setTotalCount(result.totalCount || 0);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message || "Failed to fetch transactions");
      setOpenSnackbar(true);
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getAllTransactionsForExport = async () => {
    if (!date || !date[0] || !date[1]) return [];

    try {
      let startDateFormatted, endDateFormatted;
      try {
        startDateFormatted = dayjs(date[0].$d).format("YYYY-MM-DD");
        endDateFormatted = dayjs(date[1].$d).format("YYYY-MM-DD");
      } catch (dateError) {
        console.error("Date formatting error:", dateError);
        throw new Error("Invalid date format");
      }

      const url = `api/transactions/export-confirm-payments?startDate=${startDateFormatted}&endDate=${endDateFormatted}&transactionStatus=Payment Checked&limit=${totalCount}`;

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

      return result.data;
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      throw error;
    }
  };

  const getTransactionsLogsHistoryLists = async () => {
    if (historyLoading) return;

    setHistoryLoading(true);
    try {
      const response = await fetch("api/v1/csv-logs");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch data (${response.status})`
        );
      }

      const result = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Error fetching at logs history api.");
      }

      setTransactionLogsHistory(result.data);
    } catch (error) {
      console.error("Error fetching transactions logs history:", error);
      setError(error.message || "Failed to fetch transactions logs history");
      setOpenSnackbar(true);
      setTransactionLogsHistory([]);
    } finally {
      setHistoryLoading(false);
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

  const handleExportCSV = useCallback(async () => {
    try {
      setLoading(true);

      const allTransactionsForExport = await getAllTransactionsForExport();

      if (!allTransactionsForExport || allTransactionsForExport.length === 0) {
        throw new Error("No data available to export");
      }

      const headers = [
        "Name",
        "Email",
        "User Country",
        "Card ID",
        "Amount",
        "Currency",
        "Month",
        "Region",
        "Hopefuel ID",
        "Transaction Date",
        "Payment Check Time",
      ];

      let csvContent = headers.join(",") + "\n";

      allTransactionsForExport.forEach((transaction) => {
        const row = [
          transaction.Name || "",
          transaction.Email || "",
          transaction.UserCountry || "",
          transaction.CardID || "",
          transaction.Amount || "",
          transaction.CurrencyCode || "",
          transaction.Month + " " + "Month" || "",
          transaction.Region || "",
          transaction.HopeFuelID || "",
          dayjs(transaction.TransactionDate).format("YYYY-MM-DD") || "",
          dayjs(transaction.PaymentCheckTime).format("YYYY-MM-DD") || "",
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
      const startDate = dayjs(date[0].$d).format("YYYY-MM-DD hh:mm");
      const endDate = dayjs(date[1].$d).format("YYYY-MM-DD hh:mm");
      link.href = url;
      link.download = `ConfirmedPayment_Export_${startDate}_to_${endDate}.csv`;
      document.body.appendChild(link);
      link.click();

      // Upload the CSV file to the s3 bucket
      const fileName = `ConfirmedPayment_Export_${startDate}_to_${endDate}.csv`;
      const file = new File([csvContent], fileName, {
        type: "text/csv;charset=utf-8;",
      });
      const { key } = await csvHandler(file);
      console.log("Uploaded Key:", key);
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      // Save the CSV export transaction log to the database
      const requestBody = {
        AgentId: agent.id,
        CSVExportTransactionDateTime: new Date(),
        CSVExportTransactionFileName: key,
        StartDate: startDate,
        EndDate: endDate,
        TransactionIDs: allTransactionsForExport.map(
          (transaction) => transaction.TransactionID
        ),
      };

      const logResponse = await fetch("/api/v1/csv-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Log response:", logResponse);
      getTransactionsLogsHistoryLists();
      handleCloseCSVExportModal();
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError(error.message || "Failed to export CSV");
      setOpenSnackbar(true);
    } finally {
      setAllTransactions([]);
      setLoading(false);
    }
  }, [date, totalCount, handleCloseCSVExportModal]);

  const handleOpenExportHistoryModal = useCallback(() => {
    setOpenExportHistoryModal((prev) => !prev);
  }, []);

  const handleCloseExportHistoryModal = useCallback(() => {
    setOpenExportHistoryModal((prev) => !prev);
  }, []);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          mt: { xs: 2, sm: 3, md: 5 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          sx={{
            color: "#0F172A",
            fontSize: { xs: 14, sm: 16 },
            fontWeight: "600",
            mb: 1,
          }}
        >
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
                <Box sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
                  <TransactionList transactions={allTransactions} />
                </Box>

                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                      mb: 2,
                      width: "100%",
                      overflowX: "auto",
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                )}

                <Box sx={{ mt: 2, mb: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Showing {allTransactions.length} of {totalCount}{" "}
                    transactions
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="body1" align="center">
                  No transactions found for the selected date range.
                </Typography>
              </Box>
            )}
          </>
        )}

        <Grid2
          container
          spacing={2}
          sx={{
            mt: 2,
            mb: 4,
            justifyContent: { xs: "center", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Grid2 item xs={12} sm="auto">
            <CustomButton
              disabled={
                !bothDateSelected || loading || allTransactions.length === 0
              }
              variant="contained"
              text="Export CSV"
              btnWidth={isMobile ? "100%" : 160}
              onClick={handleOpenCSVExportModal}
              fullWidth={isMobile}
            />
          </Grid2>
          <Grid2 item xs={12} sm="auto">
            <CustomButton
              variant="outlined"
              text="View Export History"
              onClick={handleOpenExportHistoryModal}
              btnWidth={isMobile ? "100%" : "auto"}
              fullWidth={isMobile}
            />
          </Grid2>
        </Grid2>

        <Modal
          open={openCSVExportModal}
          onClose={handleCloseCSVExportModal}
          aria-labelledby="export-csv-modal-title"
          aria-describedby="export-csv-modal-description"
          sx={{
            alignSelf: "center",
            justifyContent: "center",
            display: "flex",
          }}
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
                fontSize: { xs: 16, sm: 20 },
              }}
              id="export-csv-modal-title"
            >
              Are you sure you want to export?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <CustomButton
                icon={<CloseIcon />}
                color="primary"
                variant="outlined"
                text="No"
                onClick={handleCloseCSVExportModal}
                fullWidth={isMobile}
              />

              <CustomButton
                icon={<CheckIcon />}
                color="primary"
                variant="contained"
                text="Yes"
                onClick={handleExportCSV}
                fullWidth={isMobile}
              />
            </Box>
          </Paper>
        </Modal>

        <Modal
          open={openExportHistoryModal}
          onClose={handleCloseExportHistoryModal}
          aria-labelledby="export-history-modal-title"
          sx={{
            alignSelf: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Paper
            sx={{
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: 4,
              width: 1000,
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              id="export-history-modal-title"
              align="center"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Export History
            </Typography>
            <Box sx={{ overflowX: "auto", width: "100%" }}>
              <TransactionHistoryList
                transactionHistoryLists={transactionLogsHistory}
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
    </Container>
  );
};

export default ExportCSVPage;
