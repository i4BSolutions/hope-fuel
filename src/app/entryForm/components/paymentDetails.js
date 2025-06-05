"use client";

import getSignedUrl from "@/app/utilites/getSignedUrl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Card,
  FormControl,
  ImageList,
  ImageListItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
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
  const [screenShots, setScreenShots] = useState([]);

  useEffect(() => {
    if (data.ScreenShotLinks && data.ScreenShotLinks.length > 0) {
      const fetchSignedUrls = async () => {
        const signedUrls = await Promise.all(
          data.ScreenShotLinks.map(async (link) => {
            return await getSignedUrl(link);
          })
        );
        setScreenShots(signedUrls);
      };
      fetchSignedUrls();
    }
  }, [data]);

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
      <Box>
        <Stack spacing={2} fullWidth>
          <HopeFuelIdStatus data={data} />
          <Stack direction="row" spacing={4}>
            {data.ScreenShotLinks && data.ScreenShotLinks.length > 0 ? (
              <ImageList
                sx={{ width: "40%", height: 620, borderRadius: "12px" }}
                rowHeight={620}
                cols={1}
              >
                {screenShots.map((link, index) => (
                  <ImageListItem
                    key={index}
                    sx={{
                      width: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(link, "_blank")}
                  >
                    <img
                      src={link}
                      style={{ borderRadius: "12px" }}
                      alt={`Screenshot ${index + 1}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Typography>No screenshots available</Typography>
            )}
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Card
                variant="outlined"
                sx={{ px: 2, py: 1, borderRadius: "12px" }}
              >
                <UserInfo user={data} />
              </Card>

              <AmountDetails amount={data} />
              <Stack direction="row" spacing={2}>
                <Stack direction={"column"} spacing={2} sx={{ width: "100%" }}>
                  {data.Region ? (
                    <SupportRegion region={data} />
                  ) : (
                    <Typography variant="body1">
                      No Region Data Available
                    </Typography>
                  )}
                  {agent.roleId !== AGENT_ROLE.SUPPORT_AGENT && (
                    <>
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#000000",
                        }}
                      >
                        Note
                      </Typography>

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
                          sx={{ borderRadius: 8, py: 1 }}
                          onClick={
                            isEditing
                              ? handleNoteSave
                              : () => setIsEditing(true)
                          }
                        >
                          {isEditing ? "Save" : "Edit"}
                        </Button>
                      </Stack>
                    </>
                  )}
                </Stack>
                <CreatorInfo creator={data} />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <FormControl sx={{ width: "40%", mb: 6 }}>
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
        <CardsIssuedList data={data} />
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
