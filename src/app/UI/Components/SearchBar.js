import { Search as SearchIcon } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <TextField
      placeholder="Search HopeFuelID..."
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleInputChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        border: "none",
        borderColor: "transparent",
        "& fieldset": { border: "none" },
        backgroundColor: "#F1F5F9",
        borderRadius: "30px",
        marginBottom: "16px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
}

export default SearchBar;
