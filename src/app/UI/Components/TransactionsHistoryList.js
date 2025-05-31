import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment-timezone";

const TransactionsHistoryList = ({ transactionHistoryLists }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDownload = (filename) => {
    console.log(`Downloading ${filename}`);
    const link = document.createElement("a");
    link.href = filename;
    link.download = filename.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ overflow: "hidden", borderRadius: 2 }}>
        {transactionHistoryLists.map((history, index) => (
          <Box key={history.CSVExportTransactionLogsId}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                py: 3,
                px: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  flex: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {moment(history.CSVExportTransactionDateTime).format(
                    "YYYY-MM-DD HH:mm"
                  )}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {history.CSVExportTransactionFileName.split("/").pop()}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  minWidth: isMobile ? "auto" : "180px",
                }}
              >
                <CalendarMonthIcon size={16} />
                <Typography variant="body2">
                  {moment(history.FromDate).format("YYYY-MM-DD")} ⟶{" "}
                  {moment(history.ToDate).format("YYYY-MM-DD")}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DownloadIcon size={16} />}
                sx={{
                  borderRadius: "full",
                  textTransform: "none",
                  px: 3,
                }}
                onClick={() =>
                  handleDownload(history.CSVExportTransactionFileName)
                }
              >
                Download CSV
              </Button>
            </Box>
            {index < transactionHistoryLists.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default TransactionsHistoryList;
