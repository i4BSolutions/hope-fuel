import {
  Card,
  CardContent,
  Typography,
  Grid2,
  Box,
  Divider,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function WalletCard({ name, checked, pending, amount }) {
  const total = checked + pending;

  const data = {
    labels: ["Checked", "Pending"],
    datasets: [
      {
        data: [checked, pending],
        backgroundColor: ["#00B074", "#C8F0DF"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Card sx={{ borderRadius: 3, width: 255 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{name}</Typography>
          <AccountBalanceWalletIcon />
        </Box>

        <Box
          mt={2}
          mb={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box sx={{ width: 100, height: 100 }}>
            <Doughnut
              data={data}
              options={{
                cutout: "70%",
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <Box
              sx={{
                transform: "translate(0%, -135%)",
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle2">Total</Typography>
              <Typography variant="h6">{total}</Typography>
            </Box>
          </Box>
        </Box>

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
