"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Card,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import ActionButtons from "../Components/ActionButtons";
import AmountDetails from "../Components/AmountDetails";
import CardsIssuedList from "../Components/CardIssuedList";
import CreatorInfo from "../Components/CreatorInfo";
import SupportRegion from "../Components/SupportRegion";
import UserInfo from "../Components/UserInfo";
import HopeFuelIdStatus from "../Components/HopeIdStatus";

export default function PaymentDetails() {
  const { HopeFuelID } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      if (HopeFuelID) {
        try {
          const response = await fetch(
            `/api/paymentDetails?HopeFuelID=${HopeFuelID}`
          );
          const result = await response.json();
          setData(result[0]);
          setNote(result[0]?.Note || "");
          setStatus(result[0]?.Status || 1);
        } catch (err) {
          console.error("Error fetching payment details:", err);
          setError("Failed to fetch details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [HopeFuelID]);

  // Update the details on the server
  const handleUpdate = async () => {
    if (!HopeFuelID) return;

    try {
      const response = await fetch(`/api/paymentDetails`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          HopeFuelID,
          Note: note,
          Status: status,
        }),
      });

      if (response.ok) {
        setMessage("Details updated successfully!");
        setError(null);
      } else {
        throw new Error("Failed to update details");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update details.");
    }
  };

  // Loading state
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );

  // Display a message if no HopeFuelID is provided
  if (!HopeFuelID) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" align="center">
          Please select a transaction from the search page to view details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ padding: 3 }}>
        <Stack spacing={2}>
          {/* Status and Information */}
          <HopeFuelIdStatus data={data} />
          <Divider />
          <UserInfo user={data} />
          <AmountDetails amount={data.Amount} />
          <SupportRegion region={data.Region} />
          <CreatorInfo creator={data.CreatorName} />

          {/* Editable Note Field */}
          <TextField
            fullWidth
            label="Note"
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* Editable Status Field */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value={1}>၁ - ဖောင်တင်သွင်း</MenuItem>
              <MenuItem value={2}>၂ - စစ်ဆေးပြီး</MenuItem>
              <MenuItem value={3}>၃ - ပြီးစီး</MenuItem>
            </Select>
          </FormControl>

          {/* Action Buttons */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ marginTop: 2 }}
          >
            Save Changes
          </Button>

          {/* Display Success or Error Message */}
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Card>
    </Box>
  );
}
