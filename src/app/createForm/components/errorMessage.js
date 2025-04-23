import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorMessage = ({ message }) =>
  message ? (
    <Box display="flex" gap={1} sx={{ color: "red" }}>
      <ErrorOutlineIcon fontSize="xs" />
      <Typography fontSize="12px">{message}</Typography>
    </Box>
  ) : null;

export default ErrorMessage;
