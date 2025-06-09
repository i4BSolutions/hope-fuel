import { Button, Popover, Box, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";
import StatusDropdown from "./StatusDropdown"; // assumes you have this built already

export default function StatusFilter({ onApply, onClear }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onApply?.(selectedStatus);
    handleClose();
  };

  const handleClear = () => {
    setSelectedStatus(null);
    onClear?.();
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        startIcon={<FilterListIcon />}
        variant="outlined"
        sx={{ borderRadius: "24px", fontWeight: 600 }}
        onClick={handleClick}
      >
        Filter
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 3,
            minWidth: 240,
          },
        }}
      >
        <Typography fontWeight={700} fontSize={16} mb={1}>
          Filter by status
        </Typography>

        <Box mb={2}>
          <StatusDropdown
            statusId={selectedStatus ?? 1}
            onChange={(value) => setSelectedStatus(value)}
          />
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            onClick={handleClear}
            sx={{
              borderRadius: "24px",
              fontWeight: 600,
              px: 3,
            }}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              backgroundColor: "#DC2626",
              borderRadius: "24px",
              fontWeight: 600,
              px: 3,
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}
