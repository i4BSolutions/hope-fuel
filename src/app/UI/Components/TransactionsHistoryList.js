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
import { getUrl } from "aws-amplify/storage";

const TransactionsHistoryList = ({ transactionHistoryLists }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log(transactionHistoryLists);

  const getPrettyFileName = (rawKey) => {
    const fileName = rawKey.split("/").pop(); // remove path prefix
    return fileName.replace(/_/g, " ").replace(/(\d{2})-(\d{2})/g, "$1:$2");
  };

  const handleDownload = async (key) => {
    try {
      const { url } = await getUrl({
        key,
        options: {
          accessLevel: "protected",
        },
      });

      const link = document.createElement("a");
      link.href = url;
      link.download = key.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating download URL", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          maxHeight: 600,
          overflowY: "auto",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "4px",
          },
        }}
      >
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
                  {getPrettyFileName(history.CSVExportTransactionFileName)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
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
                startIcon={<DownloadIcon />}
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
