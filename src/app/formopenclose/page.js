"use client";

import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useAgentStore } from "../../stores/agentStore";
import FormStatus from "./components/FormStatus";

const FormOpenClosePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formVisibilityData, setFormVisibilityData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { agent } = useAgentStore();

  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        const response = await fetch("/api/formOpenClose");
        const result = await response.json();
        setFormVisibilityData(result.data);
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

  const handleFormOpenClose = async (newFormStatus) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        AgentId: agent.id,
        IsFormOpen: newFormStatus,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch("api/formOpenClose", requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setIsFormOpen(newFormStatus);
    } catch (error) {
      console.error("Error updating form status:", error);
      setError("Failed to update form status");
      setSnackbarOpen(true);
      setIsFormOpen(!newFormStatus);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <FormStatus
        isFormOpen={isFormOpen}
        setIsFormOpen={handleFormOpenClose}
        data={formVisibilityData}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormOpenClosePage;
