import React from "react";
import { Card, Typography, Chip, Box } from "@mui/material";
import moment from "moment-timezone";

const CardDisplay = ({
  hopeFuelID,
  transactionStatus,
  currency,
  amount,
  date,
}) => {
  return (
    <Card
      sx={{
        width: 184,
        borderRadius: 2,
        overflow: "visible",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "#FFFFFF",
        py: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            gap: 1,
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            {hopeFuelID}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            {currency}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            {amount}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            {moment(date).format("YYYY-MM-DD hh:mm")}
          </Typography>
          <Chip
            label={transactionStatus ? transactionStatus : "N/A"}
            sx={{
              backgroundColor: "#ffc107",
              color: "#000",
              height: 24,
              borderRadius: 20,
              width: 114,

              fontSize: "0.75rem",
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default CardDisplay;
