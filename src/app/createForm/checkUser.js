"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Modal, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { AGENT_ROLE } from "../../lib/constants";
import { useAgentStore } from "../../stores/agentStore";
import CustomButton from "../components/Button";
import ServiceUnavailable from "../UI/Components/ServiceUnavailable";
import checkUserSubmit from "../utilites/checkUserSubmit";

export default function CheckUser({ onUserCheck }) {
  const [loading, setLoading] = useState(false);
  const [hasPermissionThisMonth, sethasPermissionThisMonth] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { agent } = useAgentStore();
  const [open, setOpen] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const user = await checkUserSubmit(name, email);

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

    let bool = true;

    if (agent.roleId !== AGENT_ROLE.ADMIN) {
      let response = await fetch(
        "/api/checkolduserpermission/",
        requestOptions
      );
      bool = await response.json();
    }

    if (!bool) {
      sethasPermissionThisMonth(bool);
      setOpen(true);
      setLoading(bool);
      return;
    } else if (bool && user) {
      setOpen(true);
      onUserCheck(user, true); // User exists, show ExtendForm
    } else if (!user) {
      // if user don't exist
      onUserCheck({ name, email }, false); // New user, show CreateForm
    }
    setLoading(false);
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (isFormOpen === false && agent.roleId !== AGENT_ROLE.ADMIN) {
    return <ServiceUnavailable />;
  }

  return (
    <>
      <Typography
        component="h1"
        sx={{ fontSize: "23px", marginTop: 8 }}
        variant="h5"
        fontWeight="bold"
        align="center"
      >
        Customer Membership Registration
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: 360, mx: "auto", mt: 4 }}
      >
        <Typography sx={{ fontSize: "12px" }}>
          Name <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Mg Mg"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              height: "48px",
            },
            "& .MuiInputBase-input": {
              height: "100%",
              padding: "0px 0px 0px 12px",
            },
          }}
          name="name"
          id="name"
          type="text"
          required
        />

        <Typography sx={{ fontSize: "12px" }}>
          Email <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="mgmg@gmail.com"
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              height: "48px",
            },
            "& .MuiInputBase-input": {
              height: "100%",
              padding: "0px 0px 0px 12px",
            },
          }}
          name="email"
          id="email"
          type="email"
          required
        />

        <CustomButton
          width={true}
          variant="contained"
          type="submit"
          text="Check"
        />
      </Box>

      {hasPermissionThisMonth == false && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="error-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "white",
              borderRadius: "12px",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Customer already existed.
            </Typography>
            <Typography sx={{ fontSize: "16px", mb: 3, fontWeight: "bold" }}>
              Do you wish to extend his/her membership instead?
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <CustomButton
                variant="outlined"
                onClick={() => setOpen(false)}
                text="Back"
                icon={<ArrowBackIcon />}
                sx={{
                  borderColor: "#b71c1c",
                  color: "#b71c1c",
                  borderRadius: "25px",
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#fce8e6",
                  },
                  fontSize: "12px",
                }}
                type="button"
              />

              <CustomButton
                variant="contained"
                icon={<ArrowForwardIcon />}
                text="Proceed to Membership Extension"
                sx={{
                  backgroundColor: "#b71c1c",
                  color: "white",
                  borderRadius: "25px",
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#9a0007",
                  },
                  fontSize: "12px",
                }}
                type="button"
              />
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
}
