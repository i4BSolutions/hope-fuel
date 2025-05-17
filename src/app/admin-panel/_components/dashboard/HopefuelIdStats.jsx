import { Box, Typography } from "@mui/material";
import { HOPEFUEL_STATUSES } from "../../../variables/const";
import HopeFuelIDStatusChart from "../dashboard/_components/HopeFuelIDStatusChart";

export default function HopefuelIdStats() {
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
        Hopefuel IDs by status
      </Typography>
      <Box sx={{ mt: 1 }}>
        <HopeFuelIDStatusChart hopeFuelStatuses={HOPEFUEL_STATUSES} />
      </Box>
    </Box>
  );
}
