import { Avatar, Box, Input, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import fileHandler from "../../utilites/createForm/fileHandler";

export const LogoUpload = ({ logoFile, setLogoFile, errors, clearErrors }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
    } else {
      setLogoPreview(logoFile);
    }
  }, [logoFile]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setUploadProgress("Uploading...");

    //upload to s3
    const uploadedUrl = await fileHandler(
      [file],
      setLogoFile,
      [],
      setUploadProgress
    );

    //preview the image
    if (uploadedUrl?.length > 0) {
      const url = `${uploadedUrl[0].url.origin}${uploadedUrl[0].url.pathname}`;

      setLogoPreview(uploadedUrl[0].href);
      setLogoFile(url);
      setUploadProgress("");
      clearErrors("FundraiserLogo");
    } else {
      setUploadProgress("Upload failed, please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <label htmlFor="logo-upload">
        {/* Clickable Circular Avatar Button */}
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
        sx={{ display: "none" }}
        onChange={handleFileChange}
      />

      {uploadProgress && <p>{uploadProgress}</p>}
      {errors?.FundraiserLogo && (
        <Typography color="error" sx={{ fontSize: "14px", fontWeight: "bold" }}>
          {errors.FundraiserLogo.message}
        </Typography>
      )}
    </Box>
  );
};
