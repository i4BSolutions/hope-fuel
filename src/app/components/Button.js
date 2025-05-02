"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

const CustomButton = ({
  width,
  variant,
  onClick,
  text,
  icon = null,
  color,
  fontWeight,
  type,
  disabled = false,
  borderColor,
  btnWidth,
}) => {
  return (
    <Button
      fullWidth={width ? width : false}
      variant={variant ? variant : "outlined"}
      startIcon={icon ? icon : null}
      onClick={onClick}
      type={type ? type : "button"}
      disabled={disabled}
      sx={{
        width: btnWidth,
        color: color,
        borderColor: disabled ? "#ccc" : borderColor,
        backgroundColor: disabled ? "#ccc" : color,
        borderRadius: "24px",
        padding: "8px 16px",
        textTransform: "none",
        fontWeight: fontWeight ? fontWeight : "bold",
        "&:hover": {
          backgroundColor: `${color}20`,
          borderColor: borderColor,
        },
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
