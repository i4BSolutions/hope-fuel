"use client";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import checkUserSubmit from "../utilites/checkUserSubmit";
import { getCurrentUser } from "aws-amplify/auth";
import { useUser } from "../context/UserContext";
import ServiceUnavailable from "../UI/Components/ServiceUnavailable";

export default function CheckUser({ onUserCheck, userRole }) {
  const [loading, setLoading] = useState(false);
  const [hasPermissionThisMonth, sethasPermissionThisMonth] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      } finally {
        setLoading(false);
      }
    };
    fetchFormStatus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    console.log(currentUser);
    const userRole = currentUser["UserRole"];

    // const { username, userId, signInDetails } = await getCurrentUser();
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();

    const user = await checkUserSubmit(name, email, userRole);

    // // check if the user has permission
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: name,
      email: email,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // console.log("This is my agent role");
    // let agentRole = await fetch(`/api/getAgent?awsId=${userId}`);
    // agentRole = await agentRole.json();
    // console.log(agentRole);

    let bool = true;

    // if user is an admin
    if (userRole !== "Admin") {
      let response = await fetch(
        "/api/checkolduserpermission/",
        requestOptions
      );
      bool = await response.json();
    }

    if (!bool) {
      sethasPermissionThisMonth(bool);
      setLoading(bool);
      return;
    } else if (bool && user) {
      onUserCheck(user, true); // User exists, show ExtendForm
    } else if (!user) {
      // if user don't exist
      onUserCheck({ name, email }, false); // New user, show CreateForm
    }

    setLoading(false);
  };

  return loading ? (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <CircularProgress />
    </Box>
  ) : (
    <>
      {isFormOpen ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            autoFocus
            margin="normal"
            required
            fullWidth
            name="name"
            label="Name"
            type="text"
            id="name"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            id="email"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Check User
          </Button>
        </Box>
      ) : (
        <ServiceUnavailable />
      )}
      {hasPermissionThisMonth == false && (
        <h1>This user don't have permission this month anymore</h1>
      )}
    </>
  );
}
