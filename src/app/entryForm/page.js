"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PaymentDetails from "./components/paymentDetails";
import SearchBarForm from "./components/searchList";

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

  if (data === null)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 40px)" }}>
      <Box
        sx={{
          width: 400,
          borderRight: "1px solid #e0e0e0",
        }}
      >
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
          padding: 2,
          width: "80%",
        }}
      >
        <PaymentDetails
          data={data}
          note={note}
          setNote={setNote}
          clearHopeFuelID={() => {
            setHopeFuelID(null);
            location.reload();
          }}
        />
      </Box>
    </Box>
  );
}
