import {
  Card,
  Grid2,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Gauge } from "@mui/x-charts/Gauge";

export default function WalletCard({ name, checked, pending, amount }) {
  const total = checked + pending;
  const percentage = total === 0 ? 0 : Math.round((checked / total) * 100);

  return (
    <Card sx={{ borderRadius: 3, width: 255 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{name}</Typography>
          <AccountBalanceWalletIcon />
        </Box>

        {/* Gauge Chart */}
        <Box
          mt={2}
          mb={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Gauge
            width={180}
            height={180}
            value={percentage}
            valueMin={0}
            valueMax={total}
            innerRadius="70%"
            text={() => `Total\n${total}`}
            sx={{
              [`& .MuiGauge-valueText`]: {
                whiteSpace: "pre-line",
                textAnchor: "middle",
                dominantBaseline: "middle",
                fontSize: "1rem",
              },
              [`& .MuiGauge-valueArc`]: {
                fill: "#00B074",
              },
              [`& .MuiGauge-referenceArc`]: {
                fill: "#C8F0DF",
              },
            }}
          />
        </Box>

        {/* Checked / Pending Breakdown */}
        <Grid2
          container
          spacing={1}
          sx={{ mt: 2, justifyContent: "space-between" }}
        >
          <Grid2 item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: "#00B074",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2">Checked</Typography>
            </Box>
            <Typography fontWeight="medium">{checked}</Typography>
          </Grid2>
          <Grid2 item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: "#C8F0DF",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2">Pending</Typography>
            </Box>
            <Typography fontWeight="medium">{pending}</Typography>
          </Grid2>
        </Grid2>

        {/* Checked Amount */}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center" gap={1}>
          <Box flex={1}>
            <Typography variant="body2">Checked Amount</Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6">
              {amount.toLocaleString()}{" "}
              <Typography variant="caption" component="span">
                USD
              </Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
