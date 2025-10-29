"use client";

import { useEffect, useState } from "react";
import { useAgentStore } from "@/stores/agentStore";
import {
  Box,
  Divider,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Stack,
  Grid2,
  Dialog,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // 👈 NEW
import getSignedUrl from "../../utilites/getSignedUrl";

export default function FaqItem({
  id,
  question,
  explanation,
  response,
  explanationImages = [],
  responseImages = [],
  onEdit,
  onDelete,
}) {
  const { agent } = useAgentStore();

  const [signedExplanationUrls, setSignedExplanationUrls] = useState([]);
  const [signedResponseUrls, setSignedResponseUrls] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      try {
        if (explanationImages.length > 0) {
          const urls = await Promise.all(
            explanationImages.map((url) => getSignedUrl(url))
          );
          setSignedExplanationUrls(urls);
        }
        if (responseImages.length > 0) {
          const urls = await Promise.all(
            responseImages.map((url) => getSignedUrl(url))
          );
          setSignedResponseUrls(urls);
        }
      } catch (err) {
        console.error("Error fetching signed URLs", err);
      }
    };
    fetchSignedUrls();
  }, [explanationImages, responseImages]);

  const handleOnEdit = async (id) => {
    onEdit(id);
  };

  const handleDelete = async (id) => {
    onDelete({ id });
  };

  const handleCopyResponse = async () => {
    const text = String(response ?? "");
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const isViewer = agent?.roleId === 1;

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: (t) => `1px solid ${t.palette.divider}`,
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 2,
          py: 1.5,
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1,
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "18px",
            fontStyle: "normal",
            lineHeight: "24px",
            flex: 1,
          }}
        >
          {question}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isViewer ? (
            <Tooltip title={copied ? "Copied!" : "Copy Response"}>
              <IconButton size="small" onClick={handleCopyResponse}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleOnEdit(id)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(id)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </AccordionSummary>

      <Divider />

      <AccordionDetails sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          {/* Explanation */}
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, fontSize: "14px" }}
          >
            Explanation:
          </Typography>
          <ColoredNote
            bg="#FFFBEB"
            border="#FFFBEB"
            text={explanation}
            dataTestId="explanation-box"
          />

          {signedExplanationUrls?.length ? (
            <ImageStrip images={signedExplanationUrls} />
          ) : null}

          {/* Response */}
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, fontSize: "14px" }}
          >
            Response:
          </Typography>
          <ColoredNote
            bg="#F1F5F9"
            border="#F1F5F9"
            text={response}
            dataTestId="response-box"
          />

          {signedResponseUrls?.length ? (
            <ImageStrip images={signedResponseUrls} />
          ) : null}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function ColoredNote({ bg, border, text, dataTestId }) {
  return (
    <Paper
      data-testid={dataTestId}
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: bg,
        border: `1px solid ${border}`,
      }}
    >
      <Typography sx={{ fontSize: "16px" }}>{text}</Typography>
    </Paper>
  );
}

function ImageStrip({ images }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <Grid2 container spacing={1}>
        {images.map((src, i) => (
          <Grid2 item key={i}>
            <Paper
              onClick={() => openAt(i)}
              elevation={0}
              sx={{
                width: 128,
                height: 96,
                borderRadius: 2,
                overflow: "hidden",
                border: (t) => `1px solid ${t.palette.divider}`,
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
            />
          </Grid2>
        ))}
      </Grid2>

      <ImageViewer
        open={open}
        onClose={() => setOpen(false)}
        images={images}
        index={index}
        setIndex={setIndex}
      />
    </>
  );
}

function ImageViewer({ open, onClose, images = [], index, setIndex }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose, setIndex]);

  if (!images.length) return null;
  const src = images[index];

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { bgcolor: "black", color: "white", borderRadius: 2 } }}
    >
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 300, sm: 420, md: 560 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 1, sm: 2 },
          gap: 1,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
          color="inherit"
        >
          <DeleteOutlineIcon sx={{ display: "none" }} />
        </IconButton>

        {/* Prev */}
        {images.length > 1 && (
          <IconButton
            onClick={prev}
            sx={{
              position: "absolute",
              left: 8,
              bgcolor: "rgba(255,255,255,0.12)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.24)" },
            }}
            color="inherit"
          >
            <ExpandMoreIcon sx={{ transform: "rotate(90deg)" }} />
          </IconButton>
        )}

        {/* Image */}
        <Box
          component="img"
          src={src}
          alt=""
          sx={{
            maxWidth: "100%",
            maxHeight: { xs: 300, sm: 420, md: 560 },
            objectFit: "contain",
            borderRadius: 2,
            boxShadow: 3,
            userSelect: "none",
          }}
        />

        {/* Next */}
        {images.length > 1 && (
          <IconButton
            onClick={next}
            sx={{
              position: "absolute",
              right: 8,
              bgcolor: "rgba(255,255,255,0.12)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.24)" },
            }}
            color="inherit"
          >
            <ExpandMoreIcon sx={{ transform: "rotate(-90deg)" }} />
          </IconButton>
        )}

        {/* Index dots */}
        {images.length > 1 && (
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              mx: "auto",
              justifyContent: "center",
            }}
          >
            {images.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: i === index ? "white" : "rgba(255,255,255,0.4)",
                  transition: "all .2s",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}
