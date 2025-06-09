import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";

const STATUS_OPTIONS = [
  {
    label: "To Follow Up",
    value: 1,
    color: "#FACC15", // Yellow
    textColor: "#78350F",
  },
  {
    label: "Contacted",
    value: 2,
    color: "#A5B4FC", // Soft blue
    textColor: "#1E3A8A",
  },
  {
    label: "Replied",
    value: 3,
    color: "#6EE7B7", // Mint green
    textColor: "#065F46",
  },
];

export default function StatusDropdown({ statusId = 1, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const current = STATUS_OPTIONS.find((s) => s.value === statusId);

  const handleSelect = (status) => {
    setAnchorEl(null);
    onChange?.(status.value);
  };

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "none",
          backgroundColor: current.color,
          color: current.textColor,
          fontWeight: 600,
          borderRadius: 10,
          minWidth: 150,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: current.color,
            opacity: 0.9,
          },
        }}
      >
        {current.label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSelect(option)}
            sx={{
              borderRadius: 10,
              backgroundColor: option.color,
              color: option.textColor,
              fontWeight: 600,
              justifyContent: "center",
              mb: 1,
              "&:hover": {
                backgroundColor: option.color,
                opacity: 0.9,
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
