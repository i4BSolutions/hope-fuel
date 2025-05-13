import { Grid2, Box } from "@mui/material";
import WalletCard from "./WalletCard";

const dummyData = [
  { name: "Wallet A", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet B", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet C", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet D", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet E", checked: 200, pending: 300, amount: 2000000 },
];

export default function WalletGrid() {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid2 container spacing={2} sx={{ justifyContent: "space-between" }}>
        {dummyData.map((wallet, index) => (
          <Grid2 item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <WalletCard {...wallet} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
