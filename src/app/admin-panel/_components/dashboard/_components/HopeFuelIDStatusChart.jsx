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
          2,500
        </Typography>
      </Box>
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

          return (
            <Box
              key={index}
              sx={{
                height: "100%",
                width: `${widthPercent}%`,
                bgcolor: stage.color,
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
        {hopeFuelStatuses.map((stage, index) => (
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
                  mr: 1,
                  bgcolor: stage.color,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {stage.label}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {stage.count.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default HopeFuelIDStatusChart;
