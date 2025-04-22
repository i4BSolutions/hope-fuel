import React from "react";
import { Box, Typography, Button } from "@mui/material";
import theme from "../../UI/theme";

const UserInfoCard = ({ data, isMobile, onEdit, onViewEditHistory }) => {
  if (!data) {
    return (
      <Box
        sx={{
          border: "1px solid #E2E8F0",
          paddingY: theme.spacing(2),
          paddingX: theme.spacing(2),
          borderRadius: theme.spacing(1),
        }}
      >
        <Typography variant="body1" align="center">
          No user information available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        border: "1px solid #E2E8F0",
        paddingY: theme.spacing(2),
        paddingX: theme.spacing(2),
        borderRadius: theme.spacing(1),
      }}
    >
      <Box sx={{ gap: 4 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: "22px" }}>
          Name:{" "}
          <span style={{ fontSize: 18, fontWeight: 400, lineHeight: "22px" }}>
            {data.Name}
          </span>
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: "22px" }}>
          Email:{" "}
          <span style={{ fontSize: 18, fontWeight: 400, lineHeight: "22px" }}>
            {data.Email}
          </span>
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: "22px" }}>
          Country:{" "}
          <span style={{ fontSize: 18, fontWeight: 400, lineHeight: "22px" }}>
            {data.UserCountryName}
          </span>
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: isMobile ? 2 : 0,
        }}
      >
        <Button
          onClick={() => onEdit && onEdit(data.CustomerId)}
          sx={{ borderRadius: 18 }}
          variant="contained"
          color="error"
          size="small"
        >
          Edit
        </Button>
        <Button
          onClick={() =>
            onViewEditHistory && onViewEditHistory(data.CustomerId)
          }
          sx={{ borderRadius: 18 }}
          variant="outlined"
          size="small"
        >
          View Edit History
        </Button>
      </Box>
    </Box>
  );
};

export default UserInfoCard;
