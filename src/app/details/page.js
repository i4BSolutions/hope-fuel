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
  Divider,
  CircularProgress,
} from "@mui/material";
import ActionButtons from "../UI/Components/ActionButtons";
import AmountDetails from "../UI/Components/AmountDetails";
import CardsIssuedList from "../UI/Components/CardIssuedList";
import CreatorInfo from "../UI/DetailPage/CreatorInfo";
import SupportRegion from "../UI/Components/SupportRegion";
import UserInfo from "../UI/Components/UserInfo";
import HopeFuelIdStatus from "../UI/Components/HopeIdStatus";
import SearchBarForm from "../search/page";
import getScreenShotUrl from "../utilites/getScreenShotUrl";

export default function PaymentDetails() {
  const searchParams = useSearchParams();
  const HopeFuelID = searchParams.get("HopeFuelID");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(1);
  const [note, setNote] = useState("");

  // Fetch data based on HopeFuelID
  useEffect(() => {
    const fetchData = async () => {
      if (!HopeFuelID) return;

      try {
        const response = await fetch(
          `/api/paymentDetails?HopeFuelID=${HopeFuelID}`
        );
        const result = await response.json();
        console.log(result);

        for (let i = 0; i < result.length; i++) {
          if (Array.isArray(result[i]["ScreenShotLinks"])) {
            console.log(result[i]["ScreenShotLinks"].length);
            for (
              let screenshot = 0;
              screenshot < result[i]["ScreenShotLinks"].length;
              screenshot++
            ) {
              console.log();
              let tmp = await getScreenShotUrl(
                result[i]["ScreenShotLinks"][screenshot]
              );
              result[i]["ScreenShotLinks"][screenshot] = tmp.href;
            }
          }
        }

        console.log("this is my data awesome");
        console.log(result);
        if (result && result.length > 0) {
          const transactionData = result[0];
          setData(transactionData);
          setNote(transactionData.Note || "");
          setStatus(transactionData.Status || 1);
        } else {
          console.error("No data found");
          setData(null);
        }
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
          <SearchBarForm url={"/api/searchDB"} />
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
  if (data === null)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: 300, marginRight: 3 }}>
        <SearchBarForm url={"/api/searchDB"} />
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
                      onClick={() => {
                        console.log("hello this is me 2");
                        console.log(link);
                        window.open(link, "_blank");
                      }}
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

                <TextField
                  fullWidth
                  label="Note"
                  multiline
                  rows={3}
                  value={note} // Use controlled state
                  onChange={(e) => setNote(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status} // Use controlled state
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value={1}>၁ - ဖောင်တင်သွင်း</MenuItem>
                    <MenuItem value={2}>၂ - စစ်ဆေးပြီး</MenuItem>
                    <MenuItem value={3}>၃ - ပြီးစီး</MenuItem>
                    <MenuItem value={4}>၄ - ပယ်ဖျက်</MenuItem>
                  </Select>

                  <ActionButtons
                    data={{
                      HopeFuelID: data.HopeFuelID,
                      Note: note,
                      Status: status,
                      AgentId: data.AgentId,
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
