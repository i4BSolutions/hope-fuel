"use client";

import { Button } from "@mui/material";

const CustomButton = ({
  onClick,
  text = "Create New",
  icon = null,
  color = "red",
}) => {
  return (
    <Button
      variant="outlined"
      startIcon={icon ? icon : null} 
      onClick={onClick}
      sx={{
        color: color,
        borderColor: color,
        borderRadius: "24px",
        padding: "8px 16px",
        textTransform: "none",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: `${color}20`, 
          borderColor: color,
        },
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
