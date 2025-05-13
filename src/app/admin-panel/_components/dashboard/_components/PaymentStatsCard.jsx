import { Card, CardContent, Typography, Box } from "@mui/material";

export default function PaymentStatsCard({ checked, pending }) {
  return (
    <Card
      sx={{
        bgcolor: "#00B074",
        color: "white",
        borderRadius: 2,
        height: "100%",
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
          <Typography variant="h5" gutterBottom>
            Total Payment Checked
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            {checked}
          </Typography>
        </Box>
        <Box
          mt={4}
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          backgroundColor="#047857"
          borderRadius={2}
          padding={1}
        >
          <Typography variant="body2" sx={{ opacity: 0.8, width: "70%" }}>
            Total Payment Check Pending
          </Typography>
          <Typography variant="h5" fontWeight="medium">
            {pending}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
