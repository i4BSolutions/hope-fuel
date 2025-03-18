// CustomerInfoEdit.jsx
import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Paper,
  FormHelperText,
} from "@mui/material";

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const paperStyles = {
  width: 600,
  padding: 4,
  margin: "auto",
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  // justifyContent: "center",
};

const titleStyles = {
  fontWeight: 600,
  mb: 4,
  textAlign: "center",
};

const labelStyles = {
  fontWeight: 500,
  mb: 1,
  display: "block",
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
  },
};

const buttonContainerStyles = {
  display: "flex",
  justifyContent: "space-between",
  gap: 2,
  mt: "auto",
};

const cancelButtonStyles = {
  flex: 1,
  py: 1.5,
  borderRadius: 6,
  borderColor: "#ddd",
  color: "#333",
  "&:hover": {
    borderColor: "#bbb",
  },
};

const saveButtonStyles = {
  flex: 1,
  py: 1.5,
  borderRadius: 6,
  backgroundColor: "#c0272d",
  "&:hover": {
    backgroundColor: "#a7232a",
  },
};

// Country options memoized
const countryOptions = [
  { value: "Myanmar", label: "Myanmar" },
  { value: "USA", label: "United States" },
  { value: "India", label: "India" },
  { value: "Japan", label: "Japan" },
  { value: "Australia", label: "Australia" },
  { value: "UK", label: "United Kingdom" },
];

const CustomerInfoEdit = ({
  customerInfo,
  setCustomerInfo,
  onSave,
  onCancel,
}) => {
  const [errors, setErrors] = useState({ name: "", email: "", country: "" });

  const validateForm = useCallback(() => {
    const newErrors = {
      name: "",
      email: "",
      country: "",
    };
    let isValid = true;

    if (!customerInfo.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(customerInfo.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!customerInfo.country) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [customerInfo]);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setCustomerInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    },
    [errors, setCustomerInfo]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (validateForm()) {
        onSave(customerInfo);
      }
    },
    [validateForm, onSave, customerInfo]
  );

  const countryMenuItems = useMemo(
    () =>
      countryOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )),
    []
  );

  return (
    <Paper elevation={0} sx={paperStyles}>
      <Typography variant="h5" component="h1" sx={titleStyles}>
        Edit Customer Info
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" component="label" sx={labelStyles}>
            Name
          </Typography>
          <TextField
            name="name"
            value={customerInfo.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="medium"
            error={!!errors.name}
            helperText={errors.name}
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" component="label" sx={labelStyles}>
            Email
          </Typography>
          <TextField
            name="email"
            type="email"
            value={customerInfo.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="medium"
            error={!!errors.email}
            helperText={errors.email}
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" component="label" sx={labelStyles}>
            Country
          </Typography>
          <FormControl fullWidth error={!!errors.country}>
            <Select
              name="country"
              value={customerInfo.country}
              onChange={handleChange}
              displayEmpty
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: errors.country
                    ? "error.main"
                    : "rgba(0, 0, 0, 0.23)",
                },
              }}
            >
              {countryMenuItems}
            </Select>
            {errors.country && (
              <FormHelperText>{errors.country}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box sx={buttonContainerStyles}>
          <Button variant="outlined" onClick={onCancel} sx={cancelButtonStyles}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={saveButtonStyles}>
            Save Changes
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CustomerInfoEdit;
