"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Avatar, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import ServiceUnavailable from "../UI/Components/ServiceUnavailable";
import ExtendUserForm from "./ExtendUserForm";

const ExtendUserPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { currentUser } = useUser();

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

  if (!currentUser) return null;

  return (
    <>
      {isFormOpen || currentUser.UserRole === "Admin" ? (
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
    </>
  );
};

export default ExtendUserPage;
