"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography, Alert } from "@mui/material";
import { LogoUpload } from "./LogoUpload";
import { FundraisingSchema } from "../schema";
import BaseCountry from "./BaseCountry";
import { useRouter } from "next/navigation";
import AcceptedCurrency from "./AcceptedCurrency";

const FundraisingForm = ({ defaultValues = {}, onSubmitHandler, onCancel }) => {
  const router = useRouter();

  const [logoFile, setLogoFile] = useState(null);
  const [Completed, setCompleted] = useState(false);
  const initialValues = useMemo(
    () => ({
      FundraiserName: "",
      FundraiserEmail: "",
      FundraiserCentralID: null,
      BaseCountryName: "",
      FundraiserLogo: "",
      NewCountry: "",
      AcceptedCurrencies: [],
      FacebookLink: "",
      TelegramLink: "",
      OtherLink1: "",
      OtherLink2: "",
      ...defaultValues,
    }),
    [defaultValues]
  );
  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FundraisingSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (defaultValues?.FundraiserLogo) {
      setLogoFile(defaultValues.FundraiserLogo);
      setValue("FundraiserLogo", defaultValues.FundraiserLogo);
    }
  }, [defaultValues, setValue]);

  const onSubmit = async (data) => {
    if (onSubmitHandler) {
      try {
        onSubmitHandler(data);
        setCompleted(true);
        setTimeout(() => {
          setCompleted(false);
        }, 5000);
      } catch (error) {
        console.log("Error:", error);
        throw new Error("Failed to update fundraiser");
      }

      return;
    }
    if (data.BaseCountryName === "other" && data.NewCountry) {
      data.BaseCountryName = data.NewCountry.trim();
      delete data.NewCountry;
    }

    try {
      //send data to the server
      const response = await fetch("/api/v1/fundraisers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok && result) {
        reset();
        setLogoFile(null);
        setCompleted(true);

        setTimeout(() => {
          setCompleted(false);
        }, 3000);
      } else {
        setCompleted(false);
        throw new Error(result.message);
      }
    } catch (error) {
      console.log("Error:", error);
      throw new Error("Failed to create fundraiser");
    }
  };

  const onError = (errors) => {
    console.log("Form Errors", errors);
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: 600,
        bgcolor: "white",
        borderRadius: 3,
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ textAlign: "center", marginX: "auto" }}>
            <LogoUpload
              logoFile={logoFile}
              setLogoFile={(url) => {
                if (!url) {
                  return;
                }
                setLogoFile(url);
                setValue("FundraiserLogo", url);
              }}
              errors={errors}
              clearErrors={clearErrors}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              label="Fundraiser Name"
              fullWidth
              {...register("FundraiserName")}
              error={!!errors.FundraiserName}
              helperText={errors.FundraiserName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              required
              label="Fundraiser Central ID"
              variant="outlined"
              fullWidth
              {...register("FundraiserCentralID", { valueAsNumber: true })}
              error={!!errors.FundraiserCentralID}
              helperText={errors.FundraiserCentralID?.message}
              InputProps={{
                inputProps: { min: 1 },
                sx: {
                  // Hide the arrows in Chrome, Safari, Edge
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  // Hide arrows in Firefox
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <BaseCountry control={control} />
          </Grid>
          <Grid item xs={12}>
            <AcceptedCurrency control={control} errors={errors} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              label="Email"
              type="email"
              fullWidth
              {...register("FundraiserEmail")}
              error={!!errors.FundraiserEmail}
              helperText={errors.FundraiserEmail?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Facebook Link"
              id="FacebookLink"
              fullWidth
              {...register("FacebookLink")}
              error={!!errors.FacebookLink}
              helperText={errors.FacebookLink?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Telegram Link"
              id="TelegramLink"
              fullWidth
              {...register("TelegramLink")}
              error={!!errors.TelegramLink}
              helperText={errors.TelegramLink?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Other Link 1"
              id="OtherLink1"
              fullWidth
              {...register("OtherLink1")}
              error={!!errors.OtherLink1}
              helperText={errors.OtherLink1?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Other Link 2"
              id="OtherLink2"
              fullWidth
              {...register("OtherLink2")}
              error={!!errors.OtherLink2}
              helperText={errors.OtherLink2?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => {
                onCancel && onCancel();
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              {defaultValues ? "Save Changes" : "Create"}
            </Button>
          </Grid>
          {Completed && (
            <Alert
              variant="outlined"
              severity="success"
              sx={{
                textAlign: "center",
                marginTop: 2,
                marginX: "auto",
              }}
            >
              {onSubmitHandler
                ? "Changes saved successfully!"
                : "Fundraiser created successfully!"}
            </Alert>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default FundraisingForm;
