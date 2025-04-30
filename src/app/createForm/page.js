"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import getAuthCurrentUser from "../utilites/getAuthCurrentUser";
import CheckUser from "./checkUser";
import CreateForm from "./createForm";
import ExtendForm from "./extendForm";
import ExtendOrNot from "./extendOrNot";

function CreateOrExtendPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showExtendOrNot, setShowExtendOrNot] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fetch the current authenticated user and their role
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchUser = async () => {
      const user = await getAuthCurrentUser();
      setCurrentUser(user);
    };

    fetchUser();
    setLoading(false);
  }, []);

  const userRole = currentUser?.role || "user";

  // Handle showing the form based on user check
  const handleUserCheck = (user, isExistingUser) => {
    setUserInfo(user);
    if (isExistingUser) {
      setShowExtendOrNot(true); // Show the confirmation step
    } else {
      setShowCreateForm(true);
    }
  };

  const handleExtendOrNot = (proceed) => {
    setShowExtendOrNot(false);
    if (proceed) {
      setShowExtendForm(true);
    }
  };

  const handleExtendDecline = () => {
    setShowExtendOrNot(false);
    setShowCreateForm(false);
    setShowExtendForm(false);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {showExtendOrNot ? (
          <ExtendOrNot
            userInfo={userInfo}
            onConfirm={handleExtendOrNot}
            onDecline={handleExtendDecline}
          />
        ) : !showCreateForm && !showExtendForm ? (
          <CheckUser onUserCheck={handleUserCheck} userRole={userRole} />
        ) : showCreateForm ? (
          <CreateForm
            userInfo={userInfo}
            setloading={setLoading}
            onSuccess={() => setIsSuccessModalOpen(true)}
          />
        ) : (
          <ExtendForm
            userInfo={userInfo}
            setloading={setLoading}
            onSuccess={() => setIsSuccessModalOpen(true)}
          />
        )}
      </Box>

      <Modal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        aria-labelledby="success-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: "50px", color: "green" }} />
          <Typography
            sx={{ fontSize: "18px", fontWeight: "bold", mt: 2, mb: 2 }}
          >
            Membership Registration Successful.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setIsSuccessModalOpen(false);
              window.location.reload();
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default CreateOrExtendPage;
