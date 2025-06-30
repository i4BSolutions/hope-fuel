import { Button, Stack, Typography, CircularProgress } from "@mui/material";
import React from "react";
import { useAgentStore } from "../../../stores/agentStore";

const ActionButtons = ({ data, onActionComplete }) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [denyLoading, setDenyLoading] = React.useState(false);
  const [confirmDenyFlag, setConfirmDenyFlag] = React.useState(null);
  const { agent } = useAgentStore();

  if (!data || !data.HopeFuelID) {
    console.error("Invalid data passed to ActionButtons:", data);
    return null;
  }

  const handleConfirm = async () => {
    setConfirmLoading(true);
    const payload = {
      transactionId: data.TransactionID,
      agentId: agent.id,
    };

    try {
      await fetch("/api/confirmTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onActionComplete?.();
    } catch (error) {
      console.error("error updating the confirm status");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDenied = async () => {
    setDenyLoading(true);

    const payload = {
      transactionId: data.TransactionID,
      agentId: agent.id,
    };

    try {
      await fetch("/api/deniedTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onActionComplete?.();
    } catch (error) {
      console.error("error updating the deny status");
    } finally {
      setDenyLoading(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ marginTop: 2, width: "100%" }}>
      <Button
        variant="contained"
        fullWidth
        sx={{ borderRadius: 6, py: 1 }}
        color="error"
        onClick={handleConfirm}
        disabled={confirmLoading || denyLoading}
        startIcon={
          confirmLoading ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {confirmLoading ? "Confirming..." : "Confirm"}
      </Button>
      <Button
        sx={{ borderRadius: 6, py: 1 }}
        variant="outlined"
        fullWidth
        color="error"
        onClick={handleDenied}
        disabled={confirmLoading || denyLoading}
        startIcon={
          denyLoading ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {denyLoading ? "Denying..." : "Deny"}
      </Button>

      {confirmDenyFlag === "confirmed" && (
        <Typography variant="body2" color="success.main">
          Payment Confirmed
        </Typography>
      )}
      {confirmDenyFlag === "denied" && (
        <Typography variant="body2" color="error">
          Payment Denied
        </Typography>
      )}
      {confirmDenyFlag === "error" && (
        <Typography variant="body2" color="error">
          An error occurred. Please try again.
        </Typography>
      )}
    </Stack>
  );
};

export default ActionButtons;
