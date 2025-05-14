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
