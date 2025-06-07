"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AGENT_ROLE } from "../../lib/constants";
import { useAgentStore } from "../../stores/agentStore";
import ServiceUnavailable from "../UI/Components/ServiceUnavailable";
import ExtendUserForm from "./ExtendUserForm";

const ExtendUserPage = () => {
  const [isFormOpen, setIsFormOpen] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { agent } = useAgentStore();

  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/formOpenClose");
        const result = await response.json();
        setIsFormOpen(result.data[0].IsFormOpen);
      } catch (error) {
        console.error("Error fetching form status:", error);
        setError("Failed to fetch form status");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFormStatus();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isFormOpen && agent.roleId !== AGENT_ROLE.ADMIN) {
    return <ServiceUnavailable />;
  }

  return (
    <>
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
    </>
  );
};

export default ExtendUserPage;
