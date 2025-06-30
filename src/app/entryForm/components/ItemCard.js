import { Box, Chip, Stack, Typography } from "@mui/material";

function ItemCard({ item, onClick }) {
  // Safely access properties using optional chaining (?.)
  const handleClick = () => {
    onClick(item?.HopeFuelID); // Trigger the callback function to navigate
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        borderBottom: "1px solid #e0e0e0",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      {/* Left Section with Thumbnail and Text */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Placeholder for Screenshot Image */}
        {item?.ScreenShotLinks ? (
          <Box
            component="img"
            src={item.ScreenShotLinks[0]}
            alt="Payment Screenshot"
            sx={{
              width: 80,
              height: 80,
              marginRight: 2,
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#f0f0f0",
              marginRight: 2,
              borderRadius: 2,
            }}
          />
        )}
        {/* Display HopeFuelID and Customer Name if available */}
        <Stack direction={"column"} sx={{ textAlign: "left" }} spacing={0.2}>
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            PRFHQ-{item?.HopeFuelID || "N/A"}
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
            {item?.CustomerName || "No Name"}
          </Typography>
          {item?.CurrencyCode && (
            <Chip
              label={item.CurrencyCode}
              size="small"
              sx={{
                fontWeight: "600",
                alignSelf: "start",
                background: "#FECACA",
              }}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default ItemCard;
