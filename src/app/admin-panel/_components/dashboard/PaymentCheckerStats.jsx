import { Box, Typography } from "@mui/material";
import PaymentCheckerTable from "./_components/PaymentCheckerTable";
import PaymentStatsCard from "./_components/PaymentStatsCard";
import WalletGrid from "./_components/WalletGrid";

export default function PaymentCheckerStats({ currentMonth }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "#0F172A",
          fontSize: "19px",
          fontWeight: 600,
          lineHeight: "23px",
          letterSpacing: "-2%",
        }}
      >
        Payment Checking Agent Rate
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 250 }}>
          <PaymentStatsCard checked={300} pending={500} />
        </Box>
        <Box sx={{ flex: 3, minWidth: "300px" }}>
          <PaymentCheckerTable />
        </Box>
      </Box>
      <Box sx={{ mt: 2, width: "100%" }}>
        <Typography
          sx={{
            color: "#0F172A",
            fontSize: "19px",
            fontWeight: 600,
            lineHeight: "23px",
            letterSpacing: "-2%",
          }}
        >
          Wallets
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            width: "100%",
          }}
        >
          <WalletGrid />
        </Box>
      </Box>
    </Box>
  );
}
