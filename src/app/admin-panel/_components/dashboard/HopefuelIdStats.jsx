import { Box, Typography } from "@mui/material";
import HopeFuelIDStatusChart from "../dashboard/_components/HopeFuelIDStatusChart";
import { HOPEFUEL_STATUSES } from "../../../variables/const";

export default function HopefuelIdStats() {
  return (
    <Box sx={{ my: 2 }}>
      <Typography
        sx={{
          color: "#0F172A",
          fontSize: "19px",
          fontWeight: 600,
          lineHeight: "23px",
          letterSpacing: "-2%",
        }}
      >
        Hopefuel IDs by status
      </Typography>
      <Box sx={{ mt: 1 }}>
        <HopeFuelIDStatusChart hopeFuelStatuses={HOPEFUEL_STATUSES} />
      </Box>
    </Box>
  );
}
