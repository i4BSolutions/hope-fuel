import React, { forwardRef } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";

const CustomInput = forwardRef(
  (
    {
      name,
      label,
      type = "text",
      options = [],
      value,
      onChange,
      error,
      helperText,
      disabled,
      readOnly,
      fullWidth = true,
      placeholder,
      ...props
    },
    ref
  ) => {
    const commonStyles = {
      borderRadius: "12px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        height: "48px",
      },
      "& .MuiInputBase-input": {
        height: "100%",
        padding: "0px 12px",
        fontSize: "14px",
      },
    };

    if (type === "select") {
      return (
        <FormControl fullWidth={fullWidth} error={!!error} sx={{ mb: 2 }}>
          <Select
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            inputRef={ref}
            disabled={disabled}
            sx={{
              ...commonStyles,
              "& .MuiSelect-select": {
                padding: "12px",
              },
            }}
            displayEmpty
            {...props}
          >
            <MenuItem value="" disabled hidden>
              {placeholder || `Select ${label}`}
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText m={0}>{helperText}</FormHelperText>}
        </FormControl>
      );
    }

    return (
      <TextField
        id={name}
        name={name}
        type={type}
        value={value}
        fullWidth={fullWidth}
        onChange={onChange}
        inputRef={ref}
        error={!!error}
        helperText={helperText}
        disabled={disabled}
        placeholder={placeholder}
        InputProps={{ readOnly }}
        sx={commonStyles}
        {...props}
      />
    );
  }
);

export default CustomInput;
