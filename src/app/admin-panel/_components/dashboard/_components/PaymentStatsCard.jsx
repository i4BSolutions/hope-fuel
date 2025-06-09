import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function PaymentStatsCard({ checked, pending }) {
  return (
    <Card
      sx={{
        bgcolor: "#00B074",
        color: "white",
        borderRadius: 6,
        height: 280,
        minWidth: 320,
        flex: 0,
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pt: 3,
          px: 3,
        }}
      >
        <Box>
          <Box display={"flex"}>
            <Typography variant="h5" gutterBottom>
              Total Payment Checked
            </Typography>
            <AttachMoneyIcon
              sx={{
                fontSize: 44,
                color: "white",
                borderRadius: 2,
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
            p: 1,
          }}
          backgroundColor="#047857"
          borderRadius="12px"
        >
          <Typography variant="body2" sx={{ opacity: 0.8, width: "45%" }}>
            Total Payment Check Pending
          </Typography>
          <Typography
            sx={{ fontWeight: 600, fontSize: "34px", lineHeight: "40px" }}
          >
            {pending}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
