import { Box, Typography } from "@mui/material";

export default function CustomerCard({ stats, onClick }) {
  const bgRed = stats.title === "Total Customers";
  const isInteractive = stats.key === "followUpCustomers";

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 5,
        backgroundColor: bgRed ? "#DC2626" : "#ffffff",
        border: bgRed ? "none" : "2px solid #CBD5E1",
        width: "250px",
        height: "206px",
        color: bgRed ? "white" : "black",
        cursor: isInteractive ? "pointer" : "default",
        "&:hover": isInteractive ? { boxShadow: 4 } : {},
      }}
      onClick={isInteractive ? onClick : undefined}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "23px",
            lineHeight: "28px",
            width: "120px",
            mb: 1,
          }}
        >
          {stats.title}
        </Typography>
        {stats.icon()}
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "48px",
          lineHeight: "56px",
        }}
      >
        {stats.count.toLocaleString()}
      </Typography>
      {stats.prevCount !== null && (
        <Typography
          sx={{
            color: bgRed ? "#FEE2E2" : "#0F172A",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            mt: 3,
          }}
        >
          Previous Month:{" "}
          {stats.prevCount === 0
            ? stats.prevCount
            : stats.prevCount.toLocaleString()}
        </Typography>
      )}
    </Box>
  );
}
