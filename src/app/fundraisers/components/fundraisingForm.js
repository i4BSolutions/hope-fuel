"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Avatar,
  Input,
} from "@mui/material";

// 🎯 Define Zod Schema for Validation
const FundraisingSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  fundraiserId: z
    .string()
    .min(5, "Fundraiser ID must be at least 5 characters"),
  country: z.string().nonempty("Country is required"),
  acceptedCurrency: z.string().nonempty("Accepted currency is required"),
  email: z.string().email("Invalid email address"),
  facebookLink: z.string().url("Invalid Facebook URL").optional(),
  telegramLink: z.string().url("Invalid Telegram URL").optional(),
  otherLink1: z.string().url("Invalid URL").optional(),
  otherLink2: z.string().url("Invalid URL").optional(),
  logo: z.any().optional(),
});

const countries = ["USA", "UK", "Canada", "Thailand", "Myanmar"];
const currencies = ["USD", "THB", "EUR", "MMK"];

const FundraisingForm = ({ existingData, onSuccess }) => {
  const isEditMode = !!existingData; // Check if form is for Update mode

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FundraisingSchema),
    defaultValues: existingData || {
      name: "",
      fundraiserId: "",
      country: "",
      acceptedCurrency: "",
      email: "",
      facebookLink: "",
      telegramLink: "",
      otherLink1: "",
      otherLink2: "",
      logo: undefined,
    },
  });

  const [logoPreview, setLogoPreview] = useState(null);

  // Set logo preview if editing
  useEffect(() => {
    if (existingData?.logo) {
      setLogoPreview(existingData.logo);
    }
  }, [existingData]);

  // Handle Image Upload
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle Create & Update Submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await fetch(
        isEditMode
          ? `/api/fundraising/${existingData.fundraiserId}`
          : "/api/fundraising",
        {
          method: isEditMode ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to submit form");

      const result = await response.json();
      console.log("Success:", result);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 600,
        margin: "auto",
        bgcolor: "white",
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" textAlign="center" mb={2}>
        {isEditMode ? "Update Fundraising" : "Create Fundraising"}
      </Typography>

      <Box textAlign="center">
        {/* Clickable Circular Avatar Button */}
        <label htmlFor="logo-upload">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              cursor: "pointer",
              bgcolor: "#d1d5db",
              fontSize: "16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            src={logoPreview}
          >
            {!logoPreview && "Add Logo"}
          </Avatar>
        </label>

        {/* Hidden File Input */}
        <Input
          type="file"
          id="logo-upload"
          inputProps={{ accept: "image/*" }}
          sx={{ display: "none" }} // Hide default file input
          onChange={handleFileChange}
        />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          {/* Fundraiser ID & Country */}
          <Grid item xs={6}>
            <TextField
              label="Fundraiser ID"
              fullWidth
              {...register("fundraiserId")}
              error={!!errors.fundraiserId}
              helperText={errors.fundraiserId?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Country"
              fullWidth
              {...register("country")}
              error={!!errors.country}
              helperText={errors.country?.message}
            >
              {countries.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Accepted Currency */}
          <Grid item xs={12}>
            <TextField
              select
              label="Accepted Currency"
              fullWidth
              {...register("acceptedCurrency")}
              error={!!errors.acceptedCurrency}
              helperText={errors.acceptedCurrency?.message}
            >
              {currencies.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          {/* Social Links */}
          <Grid item xs={6}>
            <TextField
              label="Facebook Link"
              fullWidth
              {...register("facebookLink")}
              error={!!errors.facebookLink}
              helperText={errors.facebookLink?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Telegram Link"
              fullWidth
              {...register("telegramLink")}
              error={!!errors.telegramLink}
              helperText={errors.telegramLink?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Other Link 1"
              fullWidth
              {...register("otherLink1")}
              error={!!errors.otherLink1}
              helperText={errors.otherLink1?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Other Link 2"
              fullWidth
              {...register("otherLink2")}
              error={!!errors.otherLink2}
              helperText={errors.otherLink2?.message}
            />
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" color="secondary">
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isEditMode ? "Update" : "Create"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default FundraisingForm;
