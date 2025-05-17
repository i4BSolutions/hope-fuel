import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function WalletMultiSelect({ selected, setSelected }) {
  const [allWallets, setAllWallets] = useState([]);
  const maxSelect = 5;

  useEffect(() => {
    console.log("Selected wallets:", selected);
    const fetchAllWallets = async () => {
      try {
        const res = await fetch("/api/wallets");
        const data = await res.json();
        console.log("All wallets data:", data.data);
        if (data.status === 200) {
          setAllWallets(data.data);
        } else {
          console.error("Error fetching wallets:", data.message);
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    fetchAllWallets();
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= maxSelect) {
      setSelected(value);
    }
  };

  return (
    <Box>
      <Select
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput />}
        displayEmpty
        renderValue={() => (
          <Typography variant="body2" mt={0.3}>
            Select Wallets
          </Typography>
        )}
        sx={{
          borderRadius: 6,
          minWidth: 200,
          maxHeight: 40,
          fontWeight: "bold",
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 280,
              borderRadius: 3,
              mt: 1,
              p: 0,
            },
          },
        }}
      >
        <MenuItem>
          <Typography textAlign={"center"} variant="body2">
            {`${selected.length} of ${maxSelect} selected`}
          </Typography>
        </MenuItem>
        {allWallets.map((wallet) => {
          const isSelected = selected.includes(wallet.WalletID);
          const disabled = selected.length >= maxSelect && !isSelected;
          return (
            <MenuItem
              key={wallet.WalletID}
              value={wallet.WalletID}
              disabled={disabled}
            >
              <Checkbox
                checked={isSelected}
                sx={{
                  p: 0.5,
                  mr: 1.5,
                  color: isSelected ? "#1976d2" : "inherit",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isSelected ? "#000" : "inherit",
                }}
              >
                {wallet.WalletName}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}
