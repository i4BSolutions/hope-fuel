import { useState } from "react";
import { Box, Typography } from "@mui/material";
import WalletCard from "./WalletCard";
import WalletMultiSelect from "./WalletMultiSelect";

const dummyData = [
  { name: "Wallet A", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet B", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet C", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet D", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet E", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet F", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet G", checked: 200, pending: 300, amount: 2000000 },
  { name: "Wallet H", checked: 200, pending: 300, amount: 2000000 },
];

export default function WalletGrid() {
  const [selectedWallets, setSelectedWallets] = useState(
    dummyData.slice(0, 5).map((w) => w.name)
  );

  const visibleWallets = dummyData.filter((wallet) =>
    selectedWallets.includes(wallet.name)
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h8" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
          Wallets
        </Typography>

        <WalletMultiSelect
          selected={selectedWallets}
          setSelected={setSelectedWallets}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: 2,
        }}
      >
        {visibleWallets.map((wallet, index) => (
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
