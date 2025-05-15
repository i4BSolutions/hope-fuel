import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";

const allWallets = [
  "Wallet A",
  "Wallet B",
  "Wallet C",
  "Wallet D",
  "Wallet E",
  "Wallet F",
  "Wallet G",
  "Wallet H",
];

export default function WalletMultiSelect({ selected, setSelected }) {
  const maxSelect = 5;

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
          const isSelected = selected.includes(wallet);
          const disabled = selected.length >= maxSelect && !isSelected;
          return (
            <MenuItem key={wallet} value={wallet} disabled={disabled}>
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
                {wallet}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}
