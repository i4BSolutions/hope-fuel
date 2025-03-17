import { Box, TextField, MenuItem } from "@mui/material";
import { useState, useEffect,useMemo } from "react";
import { Controller, useWatch, useFormState, } from "react-hook-form";


const fetchCountries = async (setCountries) => {
  try {
    const response = await fetch("/api/countries");
    const data = await response.json();
    if (data.Countries) {
      setCountries(data.Countries);
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const BaseCountry = ({ control }) => {
  const [countries, setCountries] = useState([]);
  const { errors } = useFormState({ control });

  useEffect(() => {
    fetchCountries(setCountries);
  }, []);
  const memoizedCountries = useMemo(() => countries, [countries]);
  const selectedCountry = useWatch({ control, name: "BaseCountryName" });


  return (
    <Box>
      {/* Country Selection */}
      <Controller
        name="BaseCountryName"
        control={control}
        rules={{ required: "Country is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Country"
            fullWidth
            error={!!errors?.BaseCountryName}
            helperText={errors?.BaseCountryName?.message}
          >
            {memoizedCountries.map((country) => (
              <MenuItem
                key={country.BaseCountryID}
                value={country.BaseCountryName}
              >
                {country.BaseCountryName}
              </MenuItem>
            ))}
            <MenuItem value="other">Other (Add New)</MenuItem>
          </TextField>
        )}
      />

      {/* New Country Input (Only Show If "Other" is Selected) */}
      {selectedCountry === "other" && (
        <Controller
          name="NewCountry"
          control={control}
          defaultValue=""
          rules={{ required: "New Country is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Enter New Country"
              error={!!errors?.NewCountry}
              helperText={errors?.NewCountry?.message}
              sx={{ marginTop: 2 }}
            />
          )}
        />
      )}
    </Box>
  );
};

export default BaseCountry;
