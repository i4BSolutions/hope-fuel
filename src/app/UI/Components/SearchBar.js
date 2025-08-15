import { Search as SearchIcon } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch(searchTerm.trim());
    }
  };

  return (
    <TextField
      placeholder="Search PRFHQ..."
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
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
