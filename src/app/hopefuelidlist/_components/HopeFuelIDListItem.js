import stringTruncator from "@/lib/stringTruncator";
import { Box, Button, Card, Divider, Typography } from "@mui/material";
import moment from "moment-timezone";
import CopyableText from "../../UI/Components/CopyableText";

const HopeFuelIDListItem = ({ data, onClick, onClickScreenShot }) => {
  const getStatusByColor = (status) => {
    switch (status) {
      case "ငွေစစ်ဆေးပြီး":
        return "#03fc73";
      case "ကတ်ထုတ်ပေးပြီး":
        return "#6183E4";
      default:
        return "#FBBF24";
    }
  };

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <>
      {Array.isArray(data) &&
        data.map((item) => (
          <Card
            onClick={() => onClick && onClick(item.HopeFuelID)}
            key={item.HopeFuelID}
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              mx: { md: "1rem", lg: "2rem", xl: "4rem" },
              py: "1rem",
              px: "1rem",
              boxShadow: "2px 2px 2px 2px rgba(0, 0, 0, 0.1)",
              my: { xs: "1rem", sm: "1.5rem" },
              transition: "0.3s",
              "&:hover": {
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.02)",
                cursor: "pointer",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: { xs: "flex-start", sm: "space-between" },
                gap: { xs: "1rem", sm: "0.8rem", md: "1rem" },
                overflowX: "auto",
              }}
            >
              <Typography
                sx={{
                  color: "#000000",
                  fontSize: "14px",
                  fontWeight: 400,
                  minWidth: "fit-content",
                }}
              >
                HOPEFUEL ID - {item.HopeFuelID}
              </Typography>
              <Box sx={{ minWidth: "120px" }}>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {item.Name}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  {item.Email}
                </Typography>
              </Box>
              <Box sx={{ minWidth: "180px" }}>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Card ID - {item.CardID ? item.CardID : "Not Issued Yet"}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {moment(item.TransactionDate).format("DD-MM-YYYY HH:mm:ss")}
                </Typography>
              </Box>
              <Box sx={{ minWidth: "60px" }}>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.Amount}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.CurrencyCode}
                </Typography>
              </Box>
              <Box sx={{ minWidth: "60px" }}>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.Month}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.Month > 1 ? "Months" : "Month"}
                </Typography>
              </Box>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onClickScreenShot(item.ScreenShot);
                }}
                variant="outlined"
                sx={{
                  backgroundColor: "#B91C1C",
                  color: "white",
                  textTransform: "none",
                  borderRadius: "18px",
                  px: 2,
                  py: 0.5,
                  minWidth: "150px",
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "#B91C1C",
                  },
                  fontWeight: 600,
                }}
              >
                View Screenshot
              </Button>
              <Box sx={{ minWidth: "120px" }}>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  ManyChat ID
                </Typography>
                <CopyableText
                  text={item.ManyChatId ? item.ManyChatId : "N/A"}
                  truncatorLimit={6}
                  fontSize="14px"
                  fontWeight={500}
                />
              </Box>
              <Box
                sx={{
                  minWidth: "140px",
                  width: "140px",
                  backgroundColor: getStatusByColor(item.TransactionStatus),
                  color: "#000000",
                  px: "1rem",
                  py: ".5rem",
                  borderRadius: "18px",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}
              >
                {item.TransactionStatus}
              </Box>
            </Box>
            <Divider sx={{ my: "1rem", borderColor: "#CBD5E1" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#000000",
                  fontSize: "14px",
                  fontWeight: 400,
                  width: "50%",
                }}
              >
                {item.FormFilledPerson}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography
                sx={{
                  color: "#000000",
                  fontSize: "14px",
                  fontWeight: 400,
                  width: "50%",
                  px: 4,
                }}
              >
                Note: {item.Note ? stringTruncator(item.Note, 80) : "N/A"}
              </Typography>
            </Box>
          </Card>
        ))}
    </>
  );
};

export default HopeFuelIDListItem;
