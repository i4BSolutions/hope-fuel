"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AGENT_ROLE } from "../../../lib/constants";
import { useAgentStore } from "../../../stores/agentStore";
import ActionButtons from "../../UI/Components/ActionButton";
import AmountDetails from "../../UI/Components/AmountDetails";
import CardsIssuedList from "../../UI/Components/CardIssuedList";
import CreatorInfo from "../../UI/Components/CreatorInfo";
import HopeFuelIdStatus from "../../UI/Components/HopeIdStatus";
import SupportRegion from "../../UI/Components/SupportRegion";
import UserInfo from "../../UI/Components/UserInfo";

export default function PaymentDetails({ data, clearHopeFuelID }) {
  const [status, setStatus] = useState(1);
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { agent } = useAgentStore();

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

  return (
    <>
      <Box sx={{ flex: 1 }}>
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
                {agent.roleId !== AGENT_ROLE.SUPPORT_AGENT && (
                  <>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Note"
                        multiline
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={!isEditing}
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
                    <FormControl fullWidth>
                      <ActionButtons
                        data={{
                          HopeFuelID: data.HopeFuelID,
                          Note: note,
                          Status: status,
                          AgentId: data.AgentId,
                          TransactionID: data.TransactionID,
                        }}
                        onActionComplete={() => setIsSuccessModalOpen(true)}
                      />
                    </FormControl>
                  </>
                )}
              </Stack>
            </Stack>

            <CardsIssuedList data={data} />
          </Stack>
        </Card>
      </Box>
      <Modal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        aria-labelledby="success-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: "50px" }} />
          <Typography
            sx={{ fontSize: "18px", fontWeight: "bold", mt: 2, mb: 2 }}
          >
            Payment Status Updated Successfully.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setIsSuccessModalOpen(false);
              clearHopeFuelID();
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
}
