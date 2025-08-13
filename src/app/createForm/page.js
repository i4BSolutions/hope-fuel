"use client";

import { useSnackbar } from "@/components/shared/SnackbarProvider";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import getAuthCurrentUser from "../utilites/getAuthCurrentUser";
import CheckUser from "./checkUser";
import CreateForm from "./createForm";
import ExtendForm from "./extendForm";
import ExtendOrNot from "./extendOrNot";

function CreateOrExtendPage() {
  const { showSnackbar } = useSnackbar();
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
      <Box sx={{ display: "grid", placeItems: "center", height: "500px" }}>
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
            onSuccess={() => {
              showSnackbar("Form submitted successfully!", "success");
              setShowCreateForm(false);
            }}
          />
        ) : (
          <ExtendForm
            userInfo={userInfo}
            setLoading={setLoading}
            onSuccess={() => {
              showSnackbar("Form submitted successfully!", "success");
              setShowExtendForm(false);
            }}
          />
        )}
      </Box>
    </>
  );
}

export default CreateOrExtendPage;
