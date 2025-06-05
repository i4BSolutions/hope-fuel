import { Chip, Stack, Typography } from "@mui/material";
const SupportRegion = ({ region }) => {
  if (!region) return <p>No data available in AmountDetails</p>;

  return (
    <Stack direction="column" spacing={1} pt={1}>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#000000" }}>
        Support Region
      </Typography>
      <Chip
        label={region.Region}
        color="error"
        sx={{ alignSelf: "flex-start" }}
      />
    </Stack>
  );
};
export default SupportRegion;
