import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";

const ImageCarousel = ({
  open,
  onClose,
  screenshots = [],
  activeImage,
  activeImageHandler,
}) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.8;
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + zoomFactor, 10));
    } else {
      setScale((prev) => Math.max(prev - zoomFactor, 1));
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale === 1) return;
    setIsDragging(true);
    startRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (screenshots.length === 0) return null;

  return (
    <Modal
      open={open}
      onClose={() => {
        resetZoom();
        onClose();
      }}
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
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={screenshots[activeImage]}
            alt={`Screenshot ${activeImage + 1}`}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${
                position.y / scale
              }px)`,
              transition: isDragging ? "none" : "transform 0.2s ease-in-out",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />
        </Box>

        {screenshots.length > 1 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              color: "white",
              position: "absolute",
              bottom: 50,
            }}
          >
            <IconButton
              onClick={() =>
                activeImageHandler(
                  activeImage === 0 ? screenshots.length - 1 : activeImage - 1
                )
              }
            >
              <ChevronLeft sx={{ color: "white", fontSize: 32 }} />
            </IconButton>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: 400,
              }}
            >
              {`${activeImage + 1} / ${screenshots.length}`}
            </Typography>
            <IconButton
              onClick={() =>
                activeImageHandler(
                  activeImage === screenshots.length - 1 ? 0 : activeImage + 1
                )
              }
            >
              <ChevronRight sx={{ color: "white", fontSize: 32 }} />
            </IconButton>
          </Box>
        )}

        <IconButton
          sx={{ position: "absolute", bottom: -60 }}
          onClick={() => {
            resetZoom();
            onClose();
          }}
        >
          <Close sx={{ color: "white", fontSize: 32 }} />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ImageCarousel;
