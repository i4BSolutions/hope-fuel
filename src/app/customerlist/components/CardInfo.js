import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import theme from "../../UI/theme";
import moment from "moment-timezone";

const CardInfo = ({ data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: 500,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ alignItems: "center" }}>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontSize: 14, fontWeight: 600, lineHeight: "22px" }}
          >
            Expire Date
          </Typography>
          <Typography
            sx={{ fontSize: 12, fontWeight: 400, lineHeight: "18px" }}
          >
            {moment(data.ExpireDate).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </Box>
        <Box sx={{ mt: theme.spacing(2) }}>
          <Typography
            variant="h6"
            sx={{ fontSize: 14, fontWeight: 600, lineHeight: "22px" }}
          >
            Card ID
          </Typography>
          <Typography
            sx={{ fontSize: 12, fontWeight: 400, lineHeight: "18px" }}
          >
            {data.CardID ? data.CardID : "-"}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ alignItems: "center" }}>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontSize: 14, fontWeight: 600, lineHeight: "22px" }}
          >
            Manychat ID
          </Typography>
          <Typography
            sx={{ fontSize: 12, fontWeight: 400, lineHeight: "18px" }}
          >
            {data.ManyChatId}
          </Typography>
        </Box>
        <Box sx={{ mt: theme.spacing(2) }}>
          <Typography
            variant="h6"
            sx={{ fontSize: 14, fontWeight: 600, lineHeight: "22px" }}
          >
            Expire Date Rollup
          </Typography>
          <Typography
            sx={{ fontSize: 12, fontWeight: 400, lineHeight: "18px" }}
          >
            {moment(data.ExpireDate).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CardInfo;
