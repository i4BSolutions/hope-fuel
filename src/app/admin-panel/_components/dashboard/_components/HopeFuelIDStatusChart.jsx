import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import React from "react";

const HopeFuelIDStatusChart = ({ hopeFuelStatuses }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const totalCount = hopeFuelStatuses.reduce(
    (acc, stage) => acc + stage.count,
    0
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Form Entry":
        return "#EF4444";
      case "Payment Checked":
        return "#10B981";
      case "Card Issued":
        return "#F59E0B";
      case "Cancel":
        return "#6183E4";
      default:
        return "#EF4444";
    }
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "#CBD5E1",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.5, sm: 2 },
        borderRadius: 4,
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: 600,
            fontSize: { xs: "18px", sm: "20px", md: "23px" },
            lineHeight: { xs: "22px", sm: "24px", md: "28px" },
            letterSpacing: "-2%",
          }}
        >
          Total PRFHQ
        </Typography>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: 700,
            fontSize: { xs: "32px", sm: "40px", md: "48px" },
            lineHeight: { xs: "40px", sm: "48px", md: "56px" },
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
              mt: 2,
            }}
          >
            {hopeFuelStatuses.map((stage, index) => {
              const widthPercent = (stage.count / totalCount) * 100;
              const bgColor = getStatusColor(stage.status);

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

          {isMobile ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1,
                mt: 1.5,
              }}
            >
              {hopeFuelStatuses.map((stage, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        bgcolor: getStatusColor(stage.status),
                        mr: 0.75,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {stage.status}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {stage.count.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : isTablet ? (
            <Stack
              direction="row"
              sx={{
                width: "100%",
                flexWrap: "wrap",
                gap: 2,
                mt: 1.5,
              }}
            >
              {hopeFuelStatuses.map((stage, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "110px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
                    <Box
                      sx={{
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        bgcolor: getStatusColor(stage.status),
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
              ))}
            </Stack>
          ) : (
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
                        bgcolor: getStatusColor(stage.status),
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
              ))}
            </Stack>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
            justifyContent: "center",
            width: "100%",
            height: "100px",
          }}
        >
          <InboxIcon sx={{ fontSize: 60, color: "#999999" }} />
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 600,
              fontSize: "23px",
              lineHeight: "28px",
              letterSpacing: "-2%",
              mt: 1,
            }}
          >
            There is no PRFHQ stats.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HopeFuelIDStatusChart;
