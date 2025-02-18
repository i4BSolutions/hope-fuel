"use client";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import createFormSubmit from "../utilites/createForm/createformSubmit";
import filehandler from "../utilites/createForm/fileHandler";
import { useUser } from "../context/UserContext";
import { useAgent } from "../context/AgentContext";

import { z } from "zod";
import { CreateFormSchema } from "../validation/validation";

const CreateForm = ({ userInfo, setloading }) => {
  //console.log("UserInfo from createForm: ", userInfo);
  const user = useUser();
  const agent = useAgent();
  // console.log("User from CreateForm: ", user);
  // console.log("Agent from CreateForm: ", agent);

  const formFillingPerson = user?.Name || "Unknown User";

  // Form Fields
  const [walletId, setWalletId] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [currency, setCurrency] = useState("");
  const [supportRegion, setSupportRegion] = useState("");
  const [supportRegions, setSupportRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);

  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [manyChatId, setManyChatId] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [notes, setNotes] = useState("");



  //checking validation
  const [errors, setErrors] = useState({});

  const [fileExist, setFileExist] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isUploading, setIsUploading] = useState(false);



  // Load Wallets by Currency
  useEffect(() => {
    if (currency) {
      fetch(`/api/loadWalletByCurrency?currencyCode=${currency}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("wallets", data);
          setWallets(data);
        })
        .catch((error) => console.error("Error fetching wallets:", error));
    }
  }, [currency]);

  // Load Support Regions
  useEffect(() => {
    fetch("/api/loadSupportRegion")
      .then((response) => response.json())
      .then((data) => setSupportRegions(data))
      .catch((error) =>
        console.error("Error fetching support regions:", error)
      );
  }, []);

  // Load Currencies
  useEffect(() => {
    fetch("/api/getCurrencies")
      .then((response) => response.json())
      .then((data) => setCurrencies(data))
      .catch((error) => console.error("Error fetching currencies:", error));
  }, []);

  const handleDrop = async (acceptedFiles) => {
    setIsUploading(true);
    await filehandler(acceptedFiles, setFiles, files, setUploadProgress);
    setFileExist(acceptedFiles.length > 0);
    setIsUploading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
       amount,
      month,
      manyChatId,
      contactLink,
      notes,
      screenShot: files,
      walletId,
      supportRegion,
      currency,
    };
    console.log("Form Data:", formData);

    if (files.length === 0) {
      setFileExist(false);
      return;
    }
    try {
      // Validate Form Data
      const validatedData = CreateFormSchema.parse(formData);
      console.log("Validated Data:", validatedData);

      setErrors({}); // Clear errors if valid
      createFormSubmit(validatedData);

      setFiles([]);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      }
    }

  //   createFormSubmit(
  //     event,
  //     currency,
  //     supportRegion,
  //     files,
  //     userInfo,
  //     setloading,
  //     formFillingPerson,
  //     setAmountValidate,
  //     setMonthValidate,
  //     setManyChatValidate,
  //     fileExist,
  //     setFileExist,
  //     agent,
  //     contactLink,
  //     notes,
  //     manyChatId,
  //     walletId
  //   );

  //   setFiles([]);
  //   setSubmitted(true);
  // };
  }
  const handleChange = (field, value) => {
  // Update state
  if (field === "amount") setAmount(value);
  if (field === "month") setMonth(value);
  if (field === "manyChatId") setManyChatId(value);
  if (field === "contactLink") setContactLink(value);
  if (field === "notes") setNotes(value);
  if (field === "walletId") setWalletId(value);
  if (field === "supportRegion") setSupportRegion(value);
  if (field === "currency") setCurrency(value);

  console.log("Support Region", supportRegion);
 
  const singleFieldSchema = CreateFormSchema.shape[field]; 

  if (singleFieldSchema) {
    const result = singleFieldSchema.safeParse(value);
    if (!result.success) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: result.error.errors[0].message, 
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined, 
      }));
    }
  }
};
  

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography component="h1" variant="h5">
        Create A New User
      </Typography>

      {/* Amount Input */}
      <TextField
        required
        fullWidth
        name="amount"
        label="Amount"
        type="number"
        margin="normal"
        value={amount}
        error={!!errors.amount}
        helperText={errors.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
      />

      {/* Month Input */}
      <TextField
        required
        fullWidth
        name="month"
        label="Month"
        type="number"
        id="month"
        margin="normal"
        error={!!errors.month}
        helperText={errors.month}
        onChange={(e) => {
          handleChange("month", e.target.value);
        }}
      />

      {/* Currency Selection */}
      <FormLabel>Currency</FormLabel>
      <RadioGroup
        row
        value={currency}
        onChange={(e) => handleChange("currency", e.target.value)}
      >
        {currencies.map((item) => (
          <FormControlLabel
            key={item.CurrencyId}
            value={item.CurrencyCode}
            control={<Radio />}
            label={item.CurrencyCode}
          />
        ))}
      </RadioGroup>
      {/* wallet selection*/}
      <FormLabel id="wallets">Wallets</FormLabel>
      {wallets && wallets.length > 0 ? (
        <RadioGroup aria-labelledby="wallets-group-label" name="wallets">
          {wallets.map((wallet) => (
            <FormControlLabel
              value={wallet.WalletID}
              control={<Radio />}
              label={wallet.WalletName}
              key={wallet.WalletID}
              required={true}
              sx={{ mx: 1 }}
            />
          ))}
        </RadioGroup>
      ) : (
        <h1>No wallets selected.</h1>
      )}

      {/* Support Region Selection */}
      <Autocomplete
        disablePortal
        options={supportRegions}
        getOptionLabel={(option) => option.Region || ""}
        onChange={(e,value)=>handleChange("supportRegion", value? value.Region : "")}
        renderInput={(params) => (
          <TextField {...params} label="Support Region" required />
        )}
        sx={{ mt: 3 }}
      />

      {/* ManyChat ID Input */}
      <TextField
        fullWidth
        name="manyChat"
        label="ManyChat ID"
        value={manyChatId}
        onChange={(e) => handleChange("manyChatId", e.target.value)}
        margin="normal"
        error={!!errors.manyChatId}
        helperText={errors.manyChatId}
      />

      {/* Contact Link Input */}
      <TextField
        fullWidth
        name="contactLink"
        label="Contact Person Link"
        value={contactLink}
        onChange={(e) => handleChange("contactLink", e.target.value)}
        margin="normal"
      />

      {/* Notes Input */}
      <TextField
        fullWidth
        name="notes"
        label="Notes"
        value={notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        margin="normal"
      />

      {/* Dropzone for File Upload */}
      <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }} multiple>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #ddd",
              padding: "20px",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <p>
              {uploadProgress || "Drag & drop files here, or click to select"}
            </p>
            {isUploading && <CircularProgress sx={{ mt: 2 }} />}
          </div>
        )}
      </Dropzone>

      {/* Uploaded Images Preview */}
      {files.length > 0 && (
        <ImageList cols={3} rowHeight={164} sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <ImageListItem key={index}>
              <img src={file.href} alt={file.name} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
        {submitted ? "Submitted" : "Submit"}
      </Button>
    </Box>
  );
}
;

export default CreateForm;
