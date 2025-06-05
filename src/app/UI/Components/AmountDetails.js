import { Box, Stack, Typography } from "@mui/material";

const AmountDetails = ({ amount }) => {
  if (!amount) return <p>No data available in AmountDetails</p>;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        mb={3}
      >
        <Box
          label={amount?.CurrencyCode || "No Currency"}
          sx={{
            width: "100%",
            fontWeight: "600",
            backgroundColor: "#FECACA",
            color: "#000000",
            padding: 1,
            textAlign: "center",
            borderRadius: 6,
          }}
        >
          {amount?.CurrencyCode || "No Currency"}
        </Box>

        <Box
          label={amount?.WalletName || "No Wallet"}
          sx={{
            width: "100%",
            fontWeight: "600",
            border: "1px solid #E2E8F0",
            color: "#000000",
            textAlign: "center",
            padding: 1,
            borderRadius: 6,
          }}
        >
          {amount?.WalletName || "No Wallet"}
        </Box>
      </Stack>

      {/* Total Amount and Total Month */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-around"
      >
        <Box
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 180,
            height: 120,
            padding: 2,
            borderRadius: 4,
            border: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Amount
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {amount?.Amount ? parseFloat(amount?.Amount).toFixed(2) : "N/A"}
          </Typography>
        </Box>
        <Box
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 180,
            height: 120,
            padding: 2,
            borderRadius: 4,
            border: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Month
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {amount?.Month || "N/A"}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default AmountDetails;
