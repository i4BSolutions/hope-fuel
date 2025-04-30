import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";

const ScreenshotCarouselModal = ({ open, onClose, screenshots = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("Ss from list==>", screenshots);
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  // if (screenshots.length === 0) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "none",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90vw",
          maxWidth: "1000px",
          height: "80vh",
          borderRadius: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {screenshots.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 0,
                zIndex: 5,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <img
            src={screenshots[currentIndex]}
            alt={`Screenshot ${currentIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />

          {screenshots.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 0,
                zIndex: 5,
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          )}
        </Box>

        {screenshots.length > 1 && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: "center",
            }}
          >
            {`${currentIndex + 1} / ${screenshots.length}`}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ScreenshotCarouselModal;
