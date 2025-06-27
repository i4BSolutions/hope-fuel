"use client";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { AGENT_ROLE } from "../../lib/constants";
import { useAgentStore } from "../../stores/agentStore";
import ServiceUnavailable from "../UI/Components/ServiceUnavailable";
import CustomButton from "../components/Button";
import CustomInput from "../components/CustomInput";
import checkUserSubmit from "../utilites/checkUserSubmit";

// Zod Schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export default function CheckUser({ onUserCheck }) {
  const { agent } = useAgentStore();

  // State management
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(null);
  // const [hasPermissionThisMonth, setHasPermissionThisMonth] = useState(true);
  // const [openModal, setOpenModal] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  // Fetch form open/close status on mount
  useEffect(() => {
    const fetchFormStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/formOpenClose");
        const { data } = await response.json();
        setIsFormOpen(Boolean(data[0]?.IsFormOpen));
      } catch (err) {
        console.error("Error fetching form status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFormStatus();
  }, []);

  // Check if user has permission this month (API call)
  const checkUserPermission = useCallback(async (name, email) => {
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ name, email });
    const response = await fetch("/api/checkolduserpermission/", {
      method: "POST",
      headers,
      body,
    });
    const result = await response.json();
    return result;
  }, []);

  // Handle form submission
  const onSubmit = useCallback(
    async ({ name, email }) => {
      setLoading(true);

      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      const user = await checkUserSubmit(trimmedName, trimmedEmail);

      // let hasPermission = true;
      // Uncomment below to enable permission check for non-admins
      // if (agent.roleId !== AGENT_ROLE.ADMIN) {
      //   hasPermission = await checkUserPermission(trimmedName, trimmedEmail);
      // }
      // setHasPermissionThisMonth(hasPermission);
      // if (!hasPermission) {
      //   setOpenModal(true);
      //   setLoading(false);
      //   return;
      // }
      if (user) {
        // setOpenModal(true);
        onUserCheck(user, true);
      } else {
        onUserCheck({ name: trimmedName, email: trimmedEmail }, false);
      }
      setLoading(false);
    },
    [agent.roleId, checkUserPermission, onUserCheck]
  );

  // Loading state
  if (loading) {
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
  }

  // If form is closed and not admin, show unavailable
  if (!isFormOpen && agent.roleId !== AGENT_ROLE.ADMIN) {
    return <ServiceUnavailable />;
  }

  // // Modal for permission denial
  // const renderPermissionModal = () => (
  //   <Modal open={openModal} onClose={() => setOpenModal(false)}>
  //     <Box
  //       sx={{
  //         position: "absolute",
  //         top: "50%",
  //         left: "50%",
  //         transform: "translate(-50%, -50%)",
  //         width: 500,
  //         bgcolor: "white",
  //         borderRadius: 3,
  //         boxShadow: 24,
  //         p: 4,
  //         textAlign: "center",
  //       }}
  //     >
  //       <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
  //         Customer already existed.
  //       </Typography>
  //       <Typography sx={{ fontSize: 16, mb: 3, fontWeight: "bold" }}>
  //         Do you wish to extend his/her membership instead?
  //       </Typography>
  //       <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
  //         <CustomButton
  //           variant="outlined"
  //           onClick={() => setOpenModal(false)}
  //           text="Back"
  //           icon={<ArrowBackIcon />}
  //           sx={{
  //             borderColor: "#b71c1c",
  //             color: "#b71c1c",
  //             borderRadius: "25px",
  //             px: 3,
  //             "&:hover": { backgroundColor: "#fce8e6" },
  //             fontSize: "12px",
  //           }}
  //         />
  //         <CustomButton
  //           variant="contained"
  //           text="Proceed to Membership Extension"
  //           icon={<ArrowForwardIcon />}
  //           sx={{
  //             backgroundColor: "#b71c1c",
  //             color: "white",
  //             borderRadius: "25px",
  //             px: 3,
  //             "&:hover": { backgroundColor: "#9a0007" },
  //             fontSize: "12px",
  //           }}
  //         />
  //       </Box>
  //     </Box>
  //   </Modal>
  // );

  // Main render
  return (
    <>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        sx={{ fontSize: 23, mt: 8 }}
      >
        Customer Membership Registration
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: 360, mx: "auto", mt: 4 }}
      >
        {/* Name Field */}
        <Box mb={2}>
          <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
            Name <span style={{ color: "red" }}>*</span>
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Name"
                placeholder="Mg Mg"
                fullWidth={true}
                type="text"
                {...field}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Box>
        {/* Email Field */}
        <Box mb={2}>
          <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
            Email <span style={{ color: "red" }}>*</span>
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Email"
                placeholder="mgmg@gmail.com"
                type="email"
                fullWidth={true}
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Box>
        <CustomButton width variant="contained" type="submit" text="Check" />
      </Box>

      {/* Permission Modal */}
      {/* {!hasPermissionThisMonth && renderPermissionModal()} */}
    </>
  );
}
