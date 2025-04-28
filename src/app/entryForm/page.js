"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Chip,
  Button,
  Divider,
} from "@mui/material";
import ActionButtons from "../UI/Components/ActionButton";
import AmountDetails from "../UI/Components/AmountDetails";
import CardsIssuedList from "../UI/Components/CardIssuedList";
import CreatorInfo from "../UI/Components/CreatorInfo";
import SupportRegion from "../UI/Components/SupportRegion";
import UserInfo from "../UI/Components/UserInfo";
import HopeFuelIdStatus from "../UI/Components/HopeIdStatus";
import SearchBarForm from "../search/page";
import getScreenShotUrl from "../utilites/getScreenShotUrl";

export default function PaymentDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const searchParams = useSearchParams();
  const HopeFuelID = searchParams.get("HopeFuelID");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(1);
  const [note, setNote] = useState("");

  // Fetch data based on HopeFuelID

  async function handleNoteSave() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      note: note,
      noteId: data["NoteID"],
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch("/api/updateNote", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setIsEditing(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!HopeFuelID) return;

      try {
        const response = await fetch(
          `/api/paymentDetails?HopeFuelID=${HopeFuelID}`
        );
        const result = await response.json();

        console.log("TransactionData:", result);
        if (result.hasOwnProperty("ScreenShotLinks")) {
          console.log("Screenshot has been found");
          let screenShots = result["ScreenShotLinks"];

          if (Array.isArray(screenShots)) {
            for (let i = 0; i < screenShots.length; i++) {
              screenShots[i] = await getScreenShotUrl(screenShots[i]);
            }
          }

          result["ScreenShotLinks"] = screenShots;
        }
        setData(result);
        setNote(result.Note || "");
        setStatus(result.Status || 1);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        setData(null);
      }
    };
    fetchData();
  }, [HopeFuelID]);

  // Handle case where no HopeFuelID is selected
  if (!HopeFuelID) {
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: 300, marginRight: 3 }}>
          <SearchBarForm url={"/api/entryFormStatus"} />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">
            Please select a transaction to view details
          </Typography>
        </Box>
      </Box>
    );
  }

  // Handle loading state
  if (data === null) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: 300, marginRight: 3 }}>
        <SearchBarForm url={"/api/entryFormStatus"} />
      </Box>
      <Box sx={{ flex: 1, padding: 4, backgroundColor: "#f5f5f5" }}>
        <Card sx={{ padding: 3, borderRadius: 5 }}>
          <Stack spacing={2}>
            <HopeFuelIdStatus data={data} />
            <Divider />

            <Stack direction="row" spacing={4}>
              {data.ScreenShotLinks && data.ScreenShotLinks.length > 0 ? (
                <Stack
                  direction={{ xs: "column", sm: "column" }}
                  spacing={{ xs: 1, sm: 2, md: 4 }}
                >
                  {data.ScreenShotLinks.map((link, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={link}
                      alt={`Screenshot ${index + 1}`}
                      sx={{
                        width: 200,
                        height: 200,
                        borderRadius: 2,
                        boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                      }}
                      onClick={() => window.open(link, "_blank")}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography>No screenshots available</Typography>
              )}
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Card variant="outlined" sx={{ padding: 2 }}>
                  <UserInfo user={data} />
                </Card>

                <Card variant="outlined" sx={{ padding: 2 }}>
                  <AmountDetails amount={data} />
                </Card>

                <Card variant="outlined" sx={{ padding: 2 }}>
                  {data.Region ? (
                    <SupportRegion region={data} />
                  ) : (
                    <Typography variant="body1">
                      No Region Data Available
                    </Typography>
                  )}
                </Card>

                <Card variant="outlined" sx={{ padding: 2 }}>
                  <CreatorInfo creator={data} />
                </Card>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Note"
                    multiline
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={!isEditing} // Disable text field when not editing
                    sx={{ marginBottom: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={
                      isEditing ? handleNoteSave : () => setIsEditing(true)
                    }
                  >
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </Stack>
                <Chip
                  label={`${data.TransactionStatus} `}
                  sx={{
                    backgroundColor: "#ffd700",
                    color: "#000",
                    fontWeight: "bold",
                    padding: "4px 8px",
                  }}
                />
                <FormControl fullWidth>
                  <ActionButtons
                    data={{
                      HopeFuelID: data.HopeFuelID,
                      Note: note,
                      Status: status,
                      AgentId: data.AgentId,
                      TransactionID: data.TransactionID,
                    }}
                  />
                </FormControl>
              </Stack>
            </Stack>

            <CardsIssuedList data={data} />
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
