import stringTruncator from "@/lib/stringTruncator";
import { Check, ContentCopy } from "@mui/icons-material";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

const CopyableText = ({
  text,
  fontSize = "18px",
  fontWeight = 600,
  truncatorLimit,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowSnackbar(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <>
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          p: 1,
          borderRadius: 1,
          bgcolor: "grey.50",
        }}
      >
        <Typography
          component="span"
          sx={{
            color: "#000000",
            fontSize: fontSize,
            lineHeight: "22px",
            fontWeight: fontWeight,
          }}
        >
          {stringTruncator(text, truncatorLimit)}
        </Typography>
        <Tooltip title="Copy to clipboard">
          <IconButton
            size="small"
            onClick={handleCopy}
            color={copied ? "success" : "default"}
          >
            {copied ? (
              <Check fontSize="small" color="#000000" />
            ) : (
              <ContentCopy fontSize="small" color="#000000" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          position: "fixed",
          left: "50%",
          bottom: "24px",
          transform: "translateX(-50%)",
          "& .MuiSnackbar-root": {
            position: "fixed",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CopyableText;
