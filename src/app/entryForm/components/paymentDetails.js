"use client";

import getSignedUrl from "@/app/utilites/getSignedUrl";
import {
  Box,
  Button,
  Card,
  FormControl,
  Stack,
  styled,
  TextField,
  Tooltip,
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
import ImageCarousel from "./ImageCarousel";

const ScrollableImageContainer = styled(Box)({
  width: "40%",
  display: "flex",
  overflowX: "auto",
  gap: "24px",
  padding: "4px",
  "&::-webkit-scrollbar": {
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
});

const ImageItem = styled("img")({
  width: "60%",
  height: "620px",
  objectFit: "cover",
  borderRadius: "8px",
  flexShrink: 0,
});

export default function PaymentDetails({
  data,
  note,
  setNote,
  clearHopeFuelID,
}) {
  const [status, setStatus] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { agent } = useAgentStore();
  const [screenShots, setScreenShots] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

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
        <Stack spacing={2} sx={{ width: "100%" }}>
          <HopeFuelIdStatus data={data} />
          <Stack direction="row" spacing={4}>
            {data.ScreenShotLinks && data.ScreenShotLinks.length > 0 ? (
              <Tooltip title="Hold Shift and scroll" arrow>
                <ScrollableImageContainer>
                  {screenShots.map((image, index) => (
                    <ImageItem
                      onClick={() => {
                        setShowImageModal((prev) => !prev);
                        setActiveImage(index);
                      }}
                      key={index}
                      src={image}
                      loading="lazy"
                      sx={{
                        "&:hover": {
                          transform: "scale(1.02)",
                          cursor: "pointer",
                        },
                      }}
                    />
                  ))}
                </ScrollableImageContainer>
              </Tooltip>
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
                          disabled={
                            agent.roleId !== AGENT_ROLE.PAYMENT_PROCESSOR &&
                            agent.roleId !== AGENT_ROLE.ADMIN
                          }
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
            onActionComplete={() => clearHopeFuelID()}
          />
        </FormControl>
        <CardsIssuedList data={data} />
      </Box>

      <ImageCarousel
        open={showImageModal}
        onClose={() => setShowImageModal((prev) => !prev)}
        screenshots={screenShots}
        activeImage={activeImage}
        activeImageHandler={setActiveImage}
      />
    </>
  );
}
