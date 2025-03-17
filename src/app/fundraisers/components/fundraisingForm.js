"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { LogoUpload } from "./LogoUpload";
import { FundraisingSchema } from "../schema";
import BaseCountry from "./BaseCountry";
import { set } from "date-fns";

const FundraisingForm = () => {
  
  const [logoFile, setLogoFile] = useState(null);
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
    defaultValues: {
      FundraiserName: "",
      FundraiserEmail: "",
      BaseCountryName: "",
      FundraiserLogo: "",
      NewCountry: "",
    },
  });

  const onSubmit = (data) => {

    if (data.BaseCountryName === "other" && data.NewCountry) {
      data.BaseCountryName = data.NewCountry.trim();
      delete data.NewCountry;
    }

    console.log("Form Submitted:", data);


  };

  const onError = (errors) => {
    console.log("Form Errors", errors);
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
      <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <LogoUpload
              logoFile={logoFile}
              setLogoFile={(url) => {
                if (url.length === 0) {
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
              label="Fundraiser Name"
              fullWidth
              {...register("FundraiserName")}
              error={!!errors.FundraiserName}
              helperText={errors.FundraiserName?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <BaseCountry control={control} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("FundraiserEmail")}
              error={!!errors.FundraiserEmail}
              helperText={errors.FundraiserEmail?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => {
                reset();
                setLogoFile(null);
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FundraisingForm;
