"use client";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
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
import React, { useEffect, useState ,useCallback} from "react";
import Dropzone from "react-dropzone";
import createFormSubmit from "../utilites/createForm/createformSubmit";
import filehandler from "../utilites/createForm/fileHandler";
import { useUser } from "../context/UserContext";
import { useAgent } from "../context/AgentContext";

const CreateForm = ({ userInfo, setloading }) => {
  //console.log("UserInfo from createForm: ", userInfo);
  const user = useUser();
  const agent = useAgent();
  // console.log("User from CreateForm: ", user);
  // console.log("Agent from CreateForm: ", agent);

  const formFillingPerson = user?.Name || "Unknown User";

  const [walletId, setWalletId] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [currency, setCurrency] = useState("");
  const [supportRegion, setSupportRegion] = useState("");
  const [supportRegions, setSupportRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);

  //checking validation
  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setMonthValidate] = useState(false);
  const [manyChatValidate, setManyChatValidate] = useState(false);

  const [fileExist, setFileExist] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [minAmountError, setMinAmountError] = useState(false);

  // Form Fields
  const [contactLink, setContactLink] = useState("");
  const [notes, setNotes] = useState("");
  const [manyChatId, setManyChatId] = useState("");

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
    if (acceptedFiles.length > 0) {
      setErrors((prev) => ({ ...prev, files: "" }));
    } 
  
    await filehandler(acceptedFiles, setFiles, files, setUploadProgress);
    setFileExist(acceptedFiles.length > 0);
    setIsUploading(false);
  };

  const validateForm = useCallback(() => {
    let validationErrors = {};
    if (!currency)
      validationErrors.currency = "Currency selection is required.";
    if (!walletId) validationErrors.wallet = "Wallet selection is required.";

    if (files.length === 0)
    {
      validationErrors.files = "You must upload at least one file.";
        setFileExist(false)
    }else {
      setFileExist(true)
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [currency, walletId, files]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
   
    const res = await createFormSubmit(
      event,
      currency,
      supportRegion,
      files,
      userInfo,
      setloading,
      formFillingPerson,
      setAmountValidate,
      setMonthValidate,
      setManyChatValidate,
      fileExist,
      setFileExist,
      agent,
      contactLink,
      notes,
      manyChatId,
      walletId
    );

    if (res.status === 400) {
      setMinAmountError(true);
    } else {
      setMinAmountError(false);
      setFiles([]);
      setSubmitted(true);
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
        id="amount"
        margin="normal"
        error={amountValidate}
        helperText={
          amountValidate &&
          "Amount should be a positive number and up to 2 decimal places"
        }
        inputProps={{ min: "0", step: "0.01" }}
        onChange={(e) => {
          const value = e.target.value;
          if (!/^\d+(\.\d{0,2})?$/.test(value) || value < 0) {
            setAmountValidate(true); // Custom state to show error
          } else {
            setAmountValidate(false);
          }
        }}
      />

      {minAmountError && (
        <Alert severity="error" key={minAmountError}>
          {"The amount entered does not meet the minimum donation requirement of USD 20 (or equivalent in the selected currency) per month. Please adjust your amount or duration."}
        </Alert>
      )}

      {/* Month Input */}
      <TextField
        required
        fullWidth
        name="month"
        label="Month"
        type="number"
        id="month"
        margin="normal"
        error={monthValidate}
        helperText={monthValidate && "Please enter a valid month"}
        onChange={(e) => {
          if (e.target.value < 1 || e.target.value > 12) {
            setMonthValidate(true);
          } else {
            setMonthValidate(false);
          }
        }}
      />
      <Box sx={{ mt: 3 }}>
        {/* Currency Selection */}
        <FormControl error={!!errors.currency} component="fieldset">
          <FormLabel component="legend">Currency</FormLabel>
          <RadioGroup
            row
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              if (errors.currency) {
                setErrors((prev) => ({ ...prev, currency: "" }));
              }
            }}
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
          {errors.currency && (
            <FormHelperText>{errors.currency}</FormHelperText>
          )}
        </FormControl>
      </Box>

      {/* wallet selection*/}
      <Box sx={{ mt: 3 , mb:3 }}>
        <FormControl error={!!errors.wallet}>
          <FormLabel id="wallets">Wallets</FormLabel>
          {wallets && wallets.length > 0 ? (
            <RadioGroup
              aria-labelledby="wallets-group-label"
              name="wallets"
              value={walletId}
              onChange={(e) => {
                setWalletId(e.target.value);
                if (errors.wallet) {
                  setErrors((prev) => ({ ...prev, wallet: "" })); 
                }
              }}
            >
              {wallets.map((wallet) => (
                <FormControlLabel
                  value={wallet.WalletID}
                  control={<Radio />}
                  label={wallet.WalletName}
                  key={wallet.WalletID}
                  required
                  sx={{ mx: 1 }}
                />
              ))}
            </RadioGroup>
          ) : (
            <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
              No wallets selected.
            </Typography>
          )}
          {errors.wallet && <FormHelperText>{errors.wallet}</FormHelperText>}
        </FormControl>
      </Box>

      {/* Support Region Selection */}
      <Autocomplete
        disablePortal
        options={supportRegions}
        getOptionLabel={(option) => option.Region || ""}
        onChange={(e, value) => setSupportRegion(value)}
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
        onChange={(e) => {
          const value = e.target.value;

          // Check if value is numeric
          if (/^\d*$/.test(value)) {
            setManyChatId(value);
            setManyChatValidate(false);
          } else {
            setManyChatValidate(true);
          }
        }}
        margin="normal"
        error={manyChatValidate}
        helperText={manyChatValidate && "ManyChatId should be a numeric value"}
      />

      {/* Contact Link Input */}
      <TextField
        fullWidth
        name="contactLink"
        label="Contact Person Link"
        value={contactLink}
        onChange={(e) => setContactLink(e.target.value)}
        margin="normal"
      />

      {/* Notes Input */}
      <TextField
        fullWidth
        name="notes"
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
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
      {/* Show error message when no file is uploaded */}
      {errors.files && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.files}
        </Alert>
      )}
      {/* Uploaded Images Preview */}
      {files.length > 0 && (
        <ImageList cols={3} rowHeight={164} sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <ImageListItem
              key={index}
              sx={{ width: "150px", height: "150px", overflow: "hidden" }}
            >
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
};

export default CreateForm;
