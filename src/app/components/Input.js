import {
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";

const CustomInput = ({
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
  ...props
}) => {
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
      <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
        <InputLabel id={`${name}-label`} sx={{ fontSize: "14px" }}>
          {label}
        </InputLabel>
        <Select
          labelId={`${name}-label`}
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          label={label}
          sx={commonStyles}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      type={type}
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      disabled={disabled}
      InputProps={{ readOnly }}
      sx={{ ...commonStyles, mb: 2 }}
      {...props}
    />
  );
};

export default CustomInput;
