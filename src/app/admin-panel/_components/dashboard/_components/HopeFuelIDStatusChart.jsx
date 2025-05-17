import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const HopeFuelIDStatusChart = ({ hopeFuelStatuses }) => {
  const totalCount = hopeFuelStatuses.reduce(
    (acc, stage) => acc + stage.count,
    0
  );

  return (
    <Box
      sx={{ border: 1, borderColor: "#CBD5E1", px: 2, py: 2, borderRadius: 4 }}
    >
      <Box>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: 600,
            fontSize: "23px",
            lineHeight: "28px",
            letterSpacing: "-2%",
          }}
        >
          Total Hopefuel ID
        </Typography>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: 700,
            fontSize: "48px",
            lineHeight: "56px",
            letterSpacing: "-4%",
          }}
        >
          {hopeFuelStatuses.length > 0 ? totalCount : 0}
        </Typography>
      </Box>
      {hopeFuelStatuses.length > 0 ? (
        <>
          <Box
            sx={{
              position: "relative",
              height: 20,
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
            }}
          >
            {hopeFuelStatuses.map((stage, index) => {
              const widthPercent = (stage.count / totalCount) * 100;
              let bgColor = "";

              switch (stage.status) {
                case "Form Entry":
                  bgColor = "#EF4444";
                  break;
                case "Payment Checked":
                  bgColor = "#10B981";
                  break;
                case "Card Issued":
                  bgColor = "#F59E0B";
                  break;
                case "Cancel":
                  bgColor = "#6183E4";
                  break;
                default:
                  bgColor = "#EF4444";
              }
              return (
                <Box
                  key={index}
                  sx={{
                    height: "100%",
                    width: `${widthPercent}%`,
                    bgcolor: bgColor,
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}
          </Box>
          <Stack
            direction="row"
            sx={{ width: "100%" }}
            justifyContent="space-between"
          >
            {hopeFuelStatuses.map((stage, index) => {
              let bgColor = "";

              switch (stage.status) {
                case "Form Entry":
                  bgColor = "#EF4444";
                  break;
                case "Payment Checked":
                  bgColor = "#10B981";
                  break;
                case "Card Issued":
                  bgColor = "#F59E0B";
                  break;
                case "Cancel":
                  bgColor = "#6183E4";
                  break;
                default:
                  bgColor = "#EF4444";
              }
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Box
                      sx={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        bgcolor: bgColor,
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {stage.status}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {stage.count.toLocaleString()}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </>
      ) : (
        <Typography
          sx={{
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            color: "#000000",
            fontWeight: 600,
            fontSize: "23px",
            lineHeight: "28px",
            letterSpacing: "-2%",
          }}
        >
          There is no hopefuel id status.
        </Typography>
      )}
    </Box>
  );
};

export default HopeFuelIDStatusChart;
