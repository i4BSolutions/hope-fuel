"use client";

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const CreateButton = ({ onClick }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{
        color: "red",
        borderColor: "red",
        borderRadius: "24px",
        padding: "8px 16px",
        textTransform: "none",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderColor: "red",
        },
      }}
    >
      Create New
    </Button>
  );
};

export default CreateButton;
