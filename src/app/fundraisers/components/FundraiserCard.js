"use client";

import { Avatar, Box, Card, Paper, Stack, Typography } from "@mui/material";
import React from "react";

const FundraiserCard = ({ fundraiser, onClick }) => {
  return (
    <Card
      key={fundraiser.FundraiserID}
      onClick={() => onClick(fundraiser.FundraiserID)}
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        borderRadius: 3,
        boxShadow: "0 2px 3px 2px #0000001C",
        backgroundColor: "white",
        minWidth: 298,
        height: 98,
        ":hover": {
          cursor: "pointer",
        },
      }}
    >
      <Avatar
        src={fundraiser.FundraiserLogo}
        alt="Logo"
        sx={{
          width: 74,
          height: 74,
          mr: 2,
          border: "1px solid #f0f0f0",
        }}
      />
      <Box sx={{ overflow: "hidden" }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#0F172A", fontSize: 14 }}
        >
          {fundraiser.FundraiserName}
        </Typography>
        <Typography sx={{ color: "#0F172A", fontSize: 14, fontWeight: 400 }}>
          {fundraiser.FundraiserCentralID}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            mt: 0.2,
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              display: "inline",
              whiteSpace: "nowrap",
              color: "#0F172A",
              fontSize: 12,
              fontWeight: 400,
            }}
          >
            {fundraiser.BaseCountryName} -
          </Typography>
          {fundraiser.AcceptedCurrencies.map((currency, index) => (
            <Typography
              key={index}
              variant="caption"
              color="text.secondary"
              sx={{
                display: "inline",
                whiteSpace: "nowrap",
                color: "#0F172A",
                fontSize: 12,
                fontWeight: 400,
              }}
            >
              {index > 0 ? "• " : ""}
              {currency}
            </Typography>
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default FundraiserCard;
