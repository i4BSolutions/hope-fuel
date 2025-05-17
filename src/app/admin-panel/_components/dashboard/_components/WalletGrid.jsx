import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import WalletCard from "./WalletCard";
import WalletMultiSelect from "./WalletMultiSelect";

export default function WalletGrid({ currentMonth }) {
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [visibleWallets, setVisibleWallets] = useState([]);
  const [allWalletIds, setAllWalletIds] = useState([]);

  useEffect(() => {
    const fetchInitialWallets = async () => {
      try {
        const res = await fetch(
          `/api/transactions/wallet-summary?month=${currentMonth}`
        );
        const data = await res.json();

        if (data.status === 200) {
          const walletIds = data.data.map((wallet) => wallet.walletId);
          setSelectedWallets(walletIds);
          setAllWalletIds(walletIds);
          setVisibleWallets(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch default wallets:", err);
      }
    };

    fetchInitialWallets();
  }, [currentMonth]);

  useEffect(() => {
    const fetchWalletSummary = async () => {
      if (selectedWallets.length === 0) return;

      try {
        const response = await fetch(
          `/api/transactions/wallet-summary?month=${currentMonth}&walletIds=${selectedWallets.join(
            ","
          )}`
        );
        const data = await response.json();

        if (data.status === 200) {
          setVisibleWallets(data.data);
        } else {
          console.error("Error fetching wallet summary:", data.message);
        }
      } catch (error) {
        console.error("Error fetching wallet summary:", error);
      }
    };

    fetchWalletSummary();
  }, [selectedWallets, currentMonth]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mt: 2,
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h8" sx={{ fontWeight: "bold" }}>
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
        {visibleWallets.map((wallet) => (
          <Box
            key={wallet.walletId}
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
