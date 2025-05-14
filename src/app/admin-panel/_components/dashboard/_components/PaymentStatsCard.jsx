import { Card, CardContent, Typography, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function PaymentStatsCard({ checked, pending }) {
  return (
    <Card
      sx={{
        bgcolor: "#00B074",
        color: "white",
        borderRadius: 6,
        height: "100%",
        minWidth: 250,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box display={"flex"}>
            <Typography variant="h5" gutterBottom>
              Total Payment Checked
            </Typography>
            <AttachMoneyIcon
              sx={{
                fontSize: 60,
                color: "white",
                borderRadius: 2,
                padding: 1,
              }}
            />
          </Box>

          <Typography variant="h3" fontWeight="bold">
            {checked}
          </Typography>
        </Box>
        <Box
          mt={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          backgroundColor="#047857"
          borderRadius={2}
          padding={1}
        >
          <Typography variant="body2" sx={{ opacity: 0.8, width: "50%" }}>
            Total Payment Check Pending
          </Typography>
          <Typography variant="h3" fontWeight="medium">
            {pending}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
