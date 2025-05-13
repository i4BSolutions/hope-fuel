import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import PaymentStatsCard from "./_components/PaymentStatsCard";
import PaymentCheckerTable from "./_components/PaymentCheckerTable";
import WalletGrid from "./_components/WalletGrid";

export default function PaymentCheckerStats({ currentMonth }) {
  return (
    <Box>
      <Typography variant="h8" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Payment Checking Agent Rate
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
        <Box sx={{ width: 250 }}>
          <PaymentStatsCard checked={300} pending={500} />
        </Box>
        <Box sx={{ width: "100%" }}>
          <PaymentCheckerTable />
        </Box>
      </Box>
      <Box sx={{ mt: 2, width: "100%" }}>
        <Typography variant="h8" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
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
