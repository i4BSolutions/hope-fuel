import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import moment from "moment-timezone";
import formatAmount from "../../../lib/formatAmount";

const DateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  width: "100%",
  padding: "0px 0px",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "30px",
    borderLeft: "2px dotted #000000",
    zIndex: 1,
  },
}));

const ScrollContainer = styled(Box)({
  display: "flex",
  overflowX: "auto",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  paddingBottom: 8,
});

const SubscriptionCard = ({ cards }) => {
  return (
    <Container maxWidth="lg" sx={{ m: 0, p: 0 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, fontSize: "18px", lineHeight: "22px" }}
      >
        List of Cards Issued
      </Typography>

      <ScrollContainer>
        {cards.map((card, index) => (
          <Card
            key={index}
            sx={{
              minWidth: 155,
              mr: 2,
              mb: 1,
              borderRadius: 3,
              "&:last-child": { mr: 0 },
              border: 0.5,
              borderColor: "#E2E8F0",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack alignItems="center" spacing={2}>
                <DateContainer>
                  <Typography
                    variant="h6"
                    color="#000"
                    sx={{
                      mb: 2,
                      zIndex: 2,
                      backgroundColor: "white",
                      px: 1,
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: "20px",
                    }}
                  >
                    {moment(card.ValidFromDate).format("MMMM D,YYYY")}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="#000"
                    sx={{
                      mt: 2,
                      zIndex: 2,
                      backgroundColor: "white",
                      px: 1,
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: "20px",
                    }}
                  >
                    {moment(card.ValidThroughDate).format("MMMM D,YYYY")}
                  </Typography>
                </DateContainer>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="h6"
                    color="#000"
                    sx={{
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "17px",
                    }}
                  >
                    {formatAmount(card.MonthlyAmount)}
                  </Typography>
                  <Chip
                    label={card.CurrencyCode}
                    sx={{
                      backgroundColor: "#FECACA",
                      color: "#000",
                      fontWeight: 600,
                      height: 24,
                      fontSize: "12px",
                      lineHeight: "18px",
                    }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </ScrollContainer>
    </Container>
  );
};

export default SubscriptionCard;
