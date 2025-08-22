import CopyableText from "@/app/UI/Components/CopyableText";
import Spinner from "@/components/shared/Spinner";
import {
  Autorenew,
  DoDisturb,
  InsertDriveFile,
  PriceCheck,
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

export default function CardsView({
  cardData,
  loading,
  handleOpenScreenshots,
  formStatusDialogHandler,
  setFormStatusValues,
  handleOpenDrawer,
}) {
  if (loading) return <Spinner />;

  return (
    <div
      style={{
        padding: "1rem 2rem",
        display: "grid",
        gap: "1.2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      }}
    >
      {cardData.map((item) => (
        <Card
          key={item.HopeFuelID}
          sx={{
            padding: 2,
          }}
        >
          <CardHeader
            sx={{ padding: 0 }}
            title={
              <Typography variant="h4">PRFHQ - {item.HopeFuelID}</Typography>
            }
            subheader={`${item.Name} | ${item.Email}`}
          />
          <CardContent sx={{ padding: 0, marginTop: 1 }}>
            <Typography variant="h6">
              {item.Amount} {item.CurrencyCode} for {item.Month}{" "}
              {item.Month > 1 ? "months" : "month"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs(item.TransactionDate).format("MMMM D, YYYY h:mm A")}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
              ManyChat ID:{" "}
              <CopyableText
                text={item.ManyChatId ? item.ManyChatId : "N/A"}
                truncatorLimit={6}
                fontSize="14px"
                fontWeight={500}
              />
            </Typography>
            <div
              style={{
                marginTop: "0.5rem",
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {item.TransactionStatus === "Payment Checked" ? (
                <Chip
                  icon={<PriceCheck fontSize="small" />}
                  color="success"
                  label={item.TransactionStatus}
                />
              ) : item.TransactionStatus === "Card Issued" ? (
                <Chip
                  icon={<CheckCircleIcon fontSize="small" />}
                  color="info"
                  label={item.TransactionStatus}
                />
              ) : item.TransactionStatus === "Form Entry" ? (
                <Chip
                  icon={<InsertDriveFile fontSize="small" />}
                  color="warning"
                  label={item.TransactionStatus}
                />
              ) : (
                <Chip
                  icon={<DoDisturb fontSize="small" />}
                  color="error"
                  label={item.TransactionStatus}
                />
              )}
              <Tooltip title="Change card status manually">
                <IconButton
                  size="small"
                  onClick={() => {
                    const values = {
                      statusId: item.TransactionStatusID,
                      formStatusId: item.FormStatusID,
                    };
                    setFormStatusValues(values);
                    formStatusDialogHandler();
                  }}
                >
                  <Autorenew fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography
              variant="body2"
              color="text.secondary"
              display="block"
              marginTop={2}
            >
              Form Filled Person: {item.FormFilledPerson}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              display="block"
              marginTop={1}
              marginBottom={2}
            >
              Note: {item.Note ? item.Note : "N/A"}
            </Typography>
          </CardContent>
          <Box
            sx={{
              marginTop: 1,
              marginBottom: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Button
              size="medium"
              variant="outlined"
              sx={{ borderRadius: "50px", margin: 0 }}
              fullWidth
              onClick={() => handleOpenDrawer(item.HopeFuelID)}
            >
              View Cards Issued
            </Button>
            <Button
              size="medium"
              variant="contained"
              sx={{ borderRadius: "50px" }}
              fullWidth
              onClick={async () => handleOpenScreenshots(item.ScreenShot)}
            >
              View Screenshots
            </Button>
          </Box>
        </Card>
      ))}
    </div>
  );
}
