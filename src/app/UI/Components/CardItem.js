import { Box, Chip, Typography } from "@mui/material";
const CardItem = ({ date, amount, currency }) => (
  <Box
    sx={{
      padding: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 4,
    }}
  >
    <Typography sx={{ fontWeight: 600, mb: 0.5, fontSize: 18 }}>
      {date}
    </Typography>
    <Typography sx={{ display: "flex", alignItems: "center" }}>
      {amount}
      <Chip
        label={currency}
        sx={{ ml: 1, background: "#FECACA" }}
        size="small"
      />
    </Typography>
  </Box>
);

export default CardItem;
