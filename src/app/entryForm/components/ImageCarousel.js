import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";

const ImageCarousel = ({
  open,
  onClose,
  screenshots = [],
  activeImage,
  activeImageHandler,
}) => {
  if (screenshots.length === 0) return null;

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
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={screenshots[activeImage]}
            alt={`Screenshot ${activeImage + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
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
          onClick={onClose}
        >
          <Close sx={{ color: "white", fontSize: 32 }} />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ImageCarousel;
