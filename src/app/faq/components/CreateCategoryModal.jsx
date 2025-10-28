import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";

export default function CreateCategoryModal({
  open,
  onClose,
  onCreate,
  loading = false,
}) {
  const [name, setName] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const hasError = touched && name.trim().length === 0;

  const handleSubmit = async () => {
    setTouched(true);
    if (name.trim() === "") return;
    await onCreate(name.trim());
    setName("");
    setTouched(false);
  };

  const handleClose = () => {
    setName("");
    setTouched(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogContent sx={{ mb: 0, pb: 0 }}>
        <Stack spacing={1}>
          <Typography variant="body2">
            <span style={{ color: "#DC2626" }}>*</span> Category Name
          </Typography>

          <TextField
            autoFocus
            fullWidth
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={hasError}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{ px: 2, pb: 2, mt: 2, ml: 1, justifyContent: "start" }}
      >
        <Button
          variant="contained"
          sx={{ borderRadius: 100, background: "#E2E8F0", color: "#000" }}
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={handleSubmit}
          disabled={loading || name.trim() === ""}
          sx={{ borderRadius: 100 }}
        >
          {loading ? "Creating..." : "Create Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateCategoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
