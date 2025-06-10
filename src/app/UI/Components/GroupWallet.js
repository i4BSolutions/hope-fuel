import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAgentStore } from "../../../stores/agentStore";

const WalletSelect = ({ onWalletSelected }) => {
  const [currentWallet, setCurrentWallet] = useState("");
  const [wallets, setWallets] = useState([]);

  const searchParams = useSearchParams();
  const walletId = searchParams.get("walletId");

  const { agent } = useAgentStore();

  const handleChange = (event) => {
    const wallet = event.target.value;
    setCurrentWallet(wallet);
    onWalletSelected(wallet);
  };

  useEffect(() => {
    const fetchAllWallets = async () => {
      try {
        const response = await fetch(
          `/api/v1/wallets/assigned-wallets/get-by-agent-id?agentId=${agent.id}`
        );
        const result = await response.json();

        setWallets(result);

        // Allow "all_wallet" to be selected from query param
        if (walletId === "All Wallets") {
          setCurrentWallet("All Wallets");
          onWalletSelected("All Wallets");
        }
        // Check if walletId exists and is valid
        else {
          const walletFromParam = result.find(
            (wallet) => wallet.WalletName === walletId
          );

          if (walletFromParam) {
            setCurrentWallet(walletFromParam.WalletName); // Set wallet from query param
            onWalletSelected(walletFromParam.WalletName);
          } else if (result.length > 0) {
            setCurrentWallet("All Wallets"); // Set default wallet
            onWalletSelected("All Wallets");
          } else {
            onWalletSelected(""); // Notify parent of no wallets
          }
        }
      } catch (error) {
        console.error("Cannot fetch wallets from API");
        onWalletSelected(""); // Notify parent of no wallets
      }
    };

    fetchAllWallets();
  }, []);

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ width: "100%" }}>
      <Typography fontWeight="bold">Wallet:</Typography>
      <Select
        value={currentWallet}
        onChange={handleChange}
        variant="outlined"
        displayEmpty
        fullWidth
        renderValue={(selected) => (
          <Box
            sx={{
              backgroundColor: "darkred",
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: "16px",
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {selected ? selected : "Select a wallet"}
          </Box>
        )}
        sx={{
          border: "none",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // Remove default Select border
          },
          "& .MuiSvgIcon-root": {
            color: "black", // Customize the dropdown arrow
          },
          "& .MuiSelect-select": {
            py: "10px", // Customize the padding
          },
        }}
      >
        <MenuItem value="All Wallets">All Wallets</MenuItem>
        {wallets.length > 0 ? (
          wallets.map((wallet, index) => (
            <MenuItem key={index} value={wallet.WalletName}>
              {wallet.WalletName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No wallets available!</MenuItem>
        )}
      </Select>
    </Box>
  );
};

export default WalletSelect;
