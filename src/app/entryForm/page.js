"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import SearchBarForm from "../search/page";
import getScreenShotUrl from "../utilites/getScreenShotUrl";
import PaymentDetails from "./components/paymentDetails";

export default function EntryForm() {
  const searchParams = useSearchParams();
  let [hopeFuelID, setHopeFuelID] = useState(searchParams.get("HopeFuelID"));
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(1);
  const [note, setNote] = useState("");
  const walletId = searchParams.get("walletId");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!hopeFuelID) return;

      try {
        const response = await fetch(
          `/api/paymentDetails?HopeFuelID=${hopeFuelID}`
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
  }, [hopeFuelID]);

  // Handle case where no HopeFuelID is selected
  if (!hopeFuelID) {
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: 300, marginRight: 3 }}>
          <SearchBarForm
            key={hopeFuelID === null ? Date.now() : "active"}
            url={"/api/entryFormStatus"}
            onItemClick={(id) => {
              router.push(`/entryForm?HopeFuelID=${id}&walletId=${walletId}`);
              setHopeFuelID(id);
            }}
          />
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
        <SearchBarForm
          key={hopeFuelID === null ? Date.now() : "active"}
          url={"/api/entryFormStatus"}
          onItemClick={(id) => {
            router.push(`/entryForm?HopeFuelID=${id}&walletId=${walletId}`);
            setHopeFuelID(id);
          }}
        />
      </Box>
      <PaymentDetails
        data={data}
        clearHopeFuelID={() => {
          setHopeFuelID(null);
          router.replace(`/entryForm?walletId=${walletId}`);
        }}
      />
    </Box>
  );
}
