import { Box } from "@mui/material";
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: 2,
        }}
      >
        {dummyData.map((wallet, index) => (
          <Box
            key={index}
            sx={{
              width: "19%",
              minWidth: "200px",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <WalletCard {...wallet} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
