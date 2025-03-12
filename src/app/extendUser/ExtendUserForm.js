"use client";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Alert,
  AlertTitle,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  ImageList,
  ImageListItem,
  Stack,
  FormHelperText,
  FormControl
} from "@mui/material";
import React, { useState, useEffect,useCallback } from "react";
import { useUser } from "../context/UserContext";
import { useAgent } from "../context/AgentContext";
import { MuiOtpInput } from "mui-one-time-password-input";
import checkPrfSubmit from "../utilites/ExtendUser/checkPrfSubmit";
import extendUserSubmit from "../utilites/ExtendUser/extendUserSubmit";
import ExtendOrNot from "../createForm/extendOrNot";
import Dropzone from "react-dropzone";
import filehandler from "../utilites/createForm/fileHandler";
import { useRouter } from "next/navigation";

const ExtendUserForm = () => {
  const user = useUser();
  const agent = useAgent();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [hasPermissionThisMonth, setHasPermissionThisMonth] = useState(true);
  const [checkInputComplete, setCheckInputComplete] = useState(false);
  const [hasContinue, setHasContinue] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
 const [manyChatId, setManyChatId] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [notes, setNotes] = useState("");
  const [walletId, setWalletId] = useState(null);

  // Dropdowns and Autocomplete
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [supportRegion, setSupportRegion] = useState("");
  const [supportRegions, setSupportRegions] = useState([]);

  // File handling
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [fileExist, setFileExist] = useState(true);

  // Validation
  const [manyChatValidate, setManyChatValidate] = useState(false);
  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setMonthValidate] = useState(false);
  const [errors, setErrors] = useState({ });

  const formFillingPerson = user?.email || "Unknown User";
  const agentId = agent || "No Agent";

  // Fetch currencies, wallets, and support regions
  useEffect(() => {
    fetch("/api/getCurrencies")
      .then((res) => res.json())
      .then(setCurrencies)
      .catch(console.error);

    fetch("/api/loadSupportRegion")
      .then((res) => res.json())
      .then(setSupportRegions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (currency) {
      fetch(`/api/loadWalletByCurrency?currencyCode=${currency}`)
        .then((res) => res.json())
        .then(setWallets)
        .catch(console.error);
    }
  }, [currency]);

  // Handle OTP completion
  const handleOtpComplete = async (value) => {
    setCheckInputComplete(true);
    setIsChecking(true);
    await checkPrfSubmit(
      value,
      setUserExist,
      setIsChecking,
      setUserInfo,
      setHasPermissionThisMonth,
      user["currentUser"]["UserRole"]
    );
    setIsChecking(false);
  };

  // Handle decline action
  const handleDecline = () => {
    setOtp("");
    setUserInfo({});
    setHasContinue(false);
    setUserExist(false);
    setCheckInputComplete(false);
    setAmount("");
    setMonth("");
    setCurrency("");
    setSupportRegion("");
    setFiles([]);
  };
 const validateForm = useCallback(() => {
   let validationErrors = {};
   if (!currency) validationErrors.currency = "Currency selection is required.";
   if (!walletId) validationErrors.wallet = "Wallet selection is required.";
   if (files.length === 0) {
     validationErrors.files = "You must upload at least one file.";
     setFileExist(false);
   } else {
     setFileExist(true);
   }

   setErrors(validationErrors);
   return Object.keys(validationErrors).length === 0;
 }, [currency, walletId, files]);


  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    await extendUserSubmit(
      event,
      userInfo,
      currency,
      supportRegion,
      files,
      setLoading,
      formFillingPerson,
      setAmountValidate,
      setMonthValidate,
      setManyChatValidate,
      fileExist,
      setFileExist,
      wallets,
      agentId,
      manyChatId,
    );
  };

  // Handle file upload
  const handleDrop = async (acceptedFiles) => {
      
      if (acceptedFiles.length > 0) {
        setErrors((prev) => ({ ...prev, files: "" }));
      } 
    await filehandler(acceptedFiles, setFiles, files, setUploadProgress);
    setFileExist(acceptedFiles.length > 0);
  };
    const handleCurrencyChange = (e) => {
      setCurrency(e.target.value);
      setErrors((prevError) => ({ ...prevError, currency: false }));
    };

  return (
    <Box sx={{ mt: 4, marginLeft: 15, marginRight: 15 }}>
      <MuiOtpInput
        value={otp}
        length={7}
        onComplete={handleOtpComplete}
        onChange={setOtp}
      />

      {/* //if the user don't exist */}
      {!userExist && checkInputComplete && !isChecking && (
        <>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            ဒီ user မရှိပါဘူး — <strong>အရင်စာရင်းသွင်းပါ</strong>
          </Alert>
          <Stack
            spacing={2}
            direction="row"
            justifyContent={"flex-end"}
            sx={{ mt: 3, mb: 2 }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setOtp("");
                setCheckInputComplete(false);
              }}
            >
              သက်တမ်းပြန်တိုးမယ်
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                router.push("/createForm"); // reload the page
              }}
            >
              အသစ်သွင်းမယ်
            </Button>
          </Stack>
        </>
      )}

      {isChecking && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Checking user...</Typography>
        </Box>
      )}

      {userExist &&
        !isChecking &&
        checkInputComplete &&
        !hasPermissionThisMonth &&
        user["currentUser"]["UserRole"] != "Admin" && (
          <h1>
            ယခုလအတွင်း ဖော်ပြပါထောက်ပို့တပ်သားအတွက် စာရင်းသွင်းထားပြီးပါပြီ။
            ထူးခြားဖြစ်စဥ် ဖြစ်ပါက Admin ကိုဆက်သွယ်ပါ
          </h1>
        )}

      {/* for the admin */}
      {userExist &&
        !isChecking &&
        checkInputComplete &&
        !hasPermissionThisMonth &&
        user["currentUser"]["UserRole"] == "Admin" && (
          <>
            <h1>
              ဒီ user က ဒီလအတွက် သွင်းပြီးသွားပါပြီ။ Admin
              အနေနဲ့ဆက်ဖြည့်ချင်ပါသလား။
            </h1>
            <ExtendOrNot
              userInfo={userInfo}
              onConfirm={() => setHasContinue(true)}
              onDecline={handleDecline}
            />
          </>
        )}

      {/* for the user */}
      {!isChecking && userExist && !hasContinue && hasPermissionThisMonth && (
        <ExtendOrNot
          userInfo={userInfo}
          onConfirm={() => setHasContinue(true)}
          onDecline={handleDecline}
        />
      )}

      {hasContinue && (
        <Box component="form" onSubmit={handleFormSubmit}>
          <Typography component="h1" variant="h5" sx={{ mt: 8, mb: 4 }}>
            Extend User Membership
          </Typography>

          <TextField
            label="Amount"
            name="amount"
            fullWidth
            required
            value={amount}
            error={amountValidate}
            helperText={
              amountValidate &&
              "Amount should be a positive number and up to 2 decimal places"
            }
            sx={{ mt: 2 }}
            inputProps={{ min: "0", step: "0.01" }}
            onChange={(e) => {
              const value = e.target.value;
              setAmount(value);
              if (!/^\d+(\.\d{0,2})?$/.test(value) || value <= 0) {
                setAmountValidate(true);
              } else {
                setAmountValidate(false);
              }
            }}
          />
          <TextField
            label="Month"
            name="month"
            fullWidth
            required
            value={month}
            sx={{ mt: 2 }}
            error={monthValidate}
            helperText={monthValidate && "Please enter a valid month"}
            onChange={(e) => {
              setMonth(e.target.value);
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
          <Box sx={{ mt: 3 , mb:3}}>
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
              {errors.wallet && (
                <FormHelperText>{errors.wallet}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Autocomplete
            options={supportRegions}
            getOptionLabel={(option) => option.Region || ""}
            onChange={(event, value) => setSupportRegion(value)}
            renderInput={(params) => (
              <TextField {...params} label="Support Region" />
            )}
          />
          <TextField
            margin="normal"
            fullWidth
            id="manyChat"
            label="Many Chat ID"
            required
            name="manyChat"
            type="text"
            value={manyChatId}
            error={manyChatValidate}
            helperText={
              manyChatValidate && "ManyChatId should be a numeric value"
            }
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
          />

          <TextField
            margin="normal"
            fullWidth
            label="Contact Link"
            name="contactLink"
            value={contactLink}
            onChange={(e) => setContactLink(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #ddd",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <input {...getInputProps()} />
                <Typography>
                  {uploadProgress ||
                    "Drag & drop files here, or click to select"}
                </Typography>
              </div>
            )}
          </Dropzone>

          {/* Show error message when no file is uploaded */}
          {errors.files && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.files}
            </Alert>
          )}

          {files.length !== 0 && (
            <ImageList
              sx={{ width: 500, height: 200 }}
              cols={3}
              rowHeight={164}
            >
              {files.map((item, index) => (
                <ImageListItem
                  key={index}
                  sx={{ width: "150px", height: "150px", overflow: "hidden" }}
                >
                  <img
                    src={`${item.href}`}
                    alt={`Uploaded ${item.index}`}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ExtendUserForm;
