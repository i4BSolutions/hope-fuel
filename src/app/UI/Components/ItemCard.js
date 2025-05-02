import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

function ItemCard({ item, onClick }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const walletId = searchParams.get("walletId");

  // Safely access properties using optional chaining (?.)
  const handleClick = () => {
    onClick(item?.HopeFuelID); // Trigger the callback function to navigate
    // if (pathname === "/entryForm") {
    //   router.push(
    //     `/entryForm?HopeFuelID=${item.HopeFuelID}&walletId=${walletId}`
    //   );
    // } else if (pathname === "/details") {
    //   router.push(
    //     `/details?HopeFuelID=${item.HopeFuelID}&walletId=${walletId}`
    //   );
    // }
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
              width: 50,
              height: 50,
              marginRight: 2,
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#f0f0f0",
              marginRight: 2,
              borderRadius: 2,
            }}
          />
        )}
        {/* Display HopeFuelID and Customer Name if available */}
        <Box sx={{ width: 100 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", width: 100 }}>
            HOPEID-{item?.HopeFuelID || "N/A"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item?.CustomerName || "No Name"}
          </Typography>
        </Box>
      </Box>

      {/* Right Section with Currency Code */}
      {item?.CurrencyCode && (
        <Chip
          label={item.CurrencyCode}
          color="primary"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      )}
    </Box>
  );
}

export default ItemCard;
