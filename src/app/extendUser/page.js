"use client";

import React, { useEffect, useState } from "react";
import { UserProvider, useUser } from "../context/UserContext";
import { AgentProvider } from "../context/AgentContext";
import ExtendUserForm from "./ExtendUserForm";
import { Box, Typography, Avatar } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ServiceUnavailable from "../UI/Components/ServiceUnavailable";

const ExtendUserPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        const response = await fetch("/api/formOpenClose");
        const result = await response.json();
        setIsFormOpen(result.data[0].IsFormOpen);
      } catch (error) {
        console.error("Error fetching form status:", error);
        setError("Failed to fetch form status");
        setSnackbarOpen(true);
      }
    };
    fetchFormStatus();
  }, []);

  return (
    <UserProvider>
      <AgentProvider>
        {isFormOpen ? (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginLeft: 15,
              marginRight: 15,
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main", mb: 2 }}>
              <CalendarMonthIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Extend User Membership
            </Typography>
            <ExtendUserForm />
          </Box>
        ) : (
          <ServiceUnavailable />
        )}
      </AgentProvider>
    </UserProvider>
  );
};

export default ExtendUserPage;
