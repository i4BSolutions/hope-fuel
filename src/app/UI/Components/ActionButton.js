import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useAgentStore } from "../../../stores/agentStore";

const ActionButtons = ({ data, onActionComplete }) => {
  const [loading, setLoading] = React.useState(false);
  const [confirmDenyFlag, setConfirmDenyFlag] = React.useState(null);
  const { agent } = useAgentStore();

  if (!data || !data.HopeFuelID) {
    console.error("Invalid data passed to ActionButtons:", data);
    return null;
  }

  const handleConfirm = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleDenied = async () => {
    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ marginTop: 2 }} fullWidth>
      <Button
        variant="contained"
        fullWidth
        sx={{ borderRadius: 6, py: 1 }}
        color="error"
        onClick={handleConfirm}
        disabled={loading}
      >
        Confirm
      </Button>
      <Button
        sx={{ borderRadius: 6, py: 1 }}
        variant="outlined"
        fullWidth
        color="error"
        onClick={handleDenied}
        disabled={loading}
      >
        Deny
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
