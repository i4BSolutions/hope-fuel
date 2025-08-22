import formatAmount from "@/lib/formatAmount";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment-timezone";

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

const SubscriptionCards = ({ cards }) => {
  return (
    <Container maxWidth="lg" sx={{ m: 0, p: 2 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          fontSize: "18px",
          lineHeight: "22px",
          textAlign: "center",
        }}
      >
        {cards.length !== 0 && "List of Cards Issued"}
      </Typography>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          mt: 2,
        }}
      >
        <div
          style={{
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {cards.map((card, index) => (
            <Card
              key={index}
              sx={{
                width: 200,
                mr: 2,
                mb: 1,
                borderRadius: 3,
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
        </div>
      </Box>
    </Container>
  );
};

export default SubscriptionCards;
