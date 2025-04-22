"use client";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useAgent } from "../context/AgentContext";
import { useUser } from "../context/UserContext";
import createFormSubmit from "../utilites/createForm/createformSubmit";
import filehandler from "../utilites/createForm/fileHandler";

import CustomButton from "../components/Button";
import CustomDropzone from "../components/Dropzone";
import CustomInput from "../components/Input";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CreateForm = ({ userInfo, setloading, onSuccess }) => {
  const user = useUser();
  const agent = useAgent();

  const formFillingPerson = user?.Name || "Unknown User";

  // Form Fields
  const [currency, setCurrency] = useState();
  const [amount, setAmount] = useState();
  const [walletId, setWalletId] = useState();
  const [month, setMonth] = useState(1);
  const [supportRegion, setSupportRegion] = useState("");
  const [manyChatId, setManyChatId] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);

  // Form States
  const [wallets, setWallets] = useState([]);
  const [supportRegions, setSupportRegions] = useState([]);
  const [baseCountryList, setBaseCountryList] = useState([]);
  const [baseCountry, setBaseCountry] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [btnDisable, setBtnDisable] = useState(true);
  const [success, setSuccess] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleIncrease = useCallback(() => setMonth((prev) => prev + 1), []);
  const handleDecrease = useCallback(
    () => setMonth((prev) => Math.max(1, prev - 1)),
    []
  );

  // Validation States
  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setMonthValidate] = useState(false);
  const [manyChatValidate, setManyChatValidate] = useState(false);
  const [fileExist, setFileExist] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [minAmountError, setMinAmountError] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch Wallets by Currency
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        if (currency) {
          const response = await fetch(
            `/api/loadWalletByCurrency?currencyCode=${currency}`
          );
          const data = await response.json();
          setWallets(data);
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    fetchWallets();
  }, [currency]);

  // Fetch Support Regions
  useEffect(() => {
    const fetchSupportRegions = async () => {
      try {
        const response = await fetch("/api/loadSupportRegion");
        const data = await response.json();
        setSupportRegions(data);
      } catch (error) {
        console.error("Error fetching support regions:", error);
      }
    };

    fetchSupportRegions();
  }, []);

  useEffect(() => {
    const fetchBaseCountry = async () => {
      try {
        const response = await fetch("/api/countries");
        const data = await response.json();
        setBaseCountryList(data.Countries);
      } catch (error) {
        console.error("Error fetching base country:", error);
      }
    };

    fetchBaseCountry();
  }, []);

  // Fetch Currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("/api/getCurrencies");
        const data = await response.json();
        setCurrencies(data);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    setBtnDisable(Object.keys(errors).length > 0);
  }, [errors]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        if (currency != null) {
          const response = await fetch(
            `/api/v1/exchange-rates/get-by-currency-id`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ currency }),
            }
          );

          const data = await response.json();
          setExchangeRate(data.data?.ExchangeRate ?? 0);
        }
      } catch (error) {
        console.error("Error fetching exchange rate: ", error);
      }
    };

    fetchExchangeRate();
  }, [currency]);

  useEffect(() => {
    const fetchCheckMinAmount = async () => {
      try {
        const response = await fetch(
          "/api/v1/minimum-amount/check-minimum-amount",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount,
              month,
              walletId,
            }),
          }
        );

        const data = await response.json();
        setMinAmountError(data.error);
      } catch (error) {
        console.error("Error fetching check minimum amount: ", error);
      }
    };

    fetchCheckMinAmount();
  }, [walletId, amount, month]);

  // Form Validation
  const validateForm = useCallback(() => {
    let validationErrors = {};

    if (!currency) validationErrors.currency = "Currency required.";
    if (!amount) validationErrors.amount = "Amount required.";
    if (!walletId) validationErrors.wallet = "Wallet required.";
    if (!month) validationErrors.month = "Month required.";
    if (!supportRegion) validationErrors.supportRegion = "Support region required.";
    if (!manyChatId) {
      validationErrors.manyChatId = "ManyChat ID required.";
    } else if (!/^\d+$/.test(manyChatId)) {
      validationErrors.manyChatId = "Only numeric values are allowed for ManyChat ID.";
    }

    if (files.length === 0) {
      validationErrors.files = "You must upload at least one file.";
      setFileExist(false);
    } else {
      setFileExist(true);
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      validationErrors.amount = "Amount must be a positive number.";
    }

    if (isNaN(month) || month < 1 || month > 12) {
      validationErrors.month = "Month should be between 1 and 12.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [currency, walletId, files, manyChatId]);

  // Handle File Upload
  const handleDrop = async (acceptedFiles) => {
    setIsUploading(true);
    setUploadProgress("Start upload...");

    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

    if (acceptedFiles.length > 0) {
      setErrors((prev) => ({ ...prev, files: "" }));
    }

    await filehandler(acceptedFiles, setFiles, files, setUploadProgress);
    setFileExist(acceptedFiles.length > 0);
    setIsUploading(false);
  };

  // form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await createFormSubmit(
        event,
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
        baseCountry,
        walletId,
        amount,
        month
      );

      if (response.success) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("form submitted error: ", error);
    }
  };

  return (
    <>
      <Typography
        component="h1"
        sx={{ fontSize: "23px", marginTop: 8 }}
        variant="h5"
        fontWeight="bold"
        align="center"
      >
        Customer Membership Registration
      </Typography>
      <Box
        component="form"
        onSubmit={(event) => handleSubmit(event)}
        display="flex"
        gap={4}
        sx={{ maxWidth: 900, mx: "auto", my: 4, p: 3 }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ maxWidth: 400 }}
        >
          <Box>
            {/* Name Input */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="text"
                name="name"
                id="name"
                placeholder="Username"
                readOnly
                value={userInfo.name}
              />
            </Box>

            {/* Email Input */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Email <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="email"
                name="email"
                id="email"
                placeholder="user@gmail.com"
                readOnly
                value={userInfo.email}
              />
            </Box>
          </Box>

          <Box>
            <Box display="flex" gap={2}>
              {/* Currency Selection */}
              <Box flex={1}>
                <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                  Amount<span style={{ color: "red" }}>*</span>
                </Typography>
                <CustomInput
                  mb={2}
                  width="100%"
                  fullWidth={true}
                  type="select"
                  name="currency"
                  id="currency"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    errors.currency = "";
                  }}
                  options={currencies.map((item) => ({
                    value: item.CurrencyCode,
                    label: item.CurrencyCode,
                  }))}
                />
              </Box>

              {/* Amount Input */}
              <Box flex={3}>
                <Typography
                  sx={{
                    color: "green",
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  1 USD = {exchangeRate} {currency}
                </Typography>
                <CustomInput
                  mb={2}
                  width="100%"
                  fullWidth={true}
                  type="text"
                  name="amount"
                  id="amount"
                  placeholder="Amount"
                  error={amountValidate}
                  min="0"
                  step="0.01"
                  onChange={(e) => {
                    setAmount(e.target.value);
                    errors.amount = "";
                  }}
                />
              </Box>
            </Box>

            {errors.currency && (
              <Box display="flex" gap={1} sx={{ color: "red" }}>
                <ErrorOutlineIcon fontSize="xs" />
                <Typography fontSize="12px">{errors.currency}</Typography>
              </Box>
            )}

            {errors.amount && (
              <Box display="flex" gap={1} sx={{ color: "red" }}>
                <ErrorOutlineIcon fontSize="xs" />
                <Typography fontSize="12px">{errors.amount}</Typography>
              </Box>
            )}

            {amountValidate && (
              <Box display="flex" gap={1} sx={{ color: "red" }}>
                <ErrorOutlineIcon fontSize="xs" />
                <Typography fontSize="12px">
                  Amount should be a positive number and up to 2 decimal places.
                </Typography>
              </Box>
            )}

            {minAmountError && (
              <Box display="flex" gap={1} sx={{ color: "red" }}>
                <ErrorOutlineIcon fontSize="xs" />
                <Typography fontSize="12px">{minAmountError}</Typography>
              </Box>
            )}
          </Box>

          <Box display="flex" gap={2}>
            {/* Wallet Selection */}
            <Box flex={1}>
              {/* <FormControl error={!!errors.wallet}> */}
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Wallet<span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="select"
                name="wallet"
                id="wallet"
                value={walletId || ""}
                onChange={(e) => setWalletId(e.target.value)}
                options={wallets.map((item) => ({
                  value: item.WalletID,
                  label: item.WalletName,
                }))}
              />
              {/* </FormControl> */}
              {errors.wallet && (
                <Box display="flex" gap={1} sx={{ color: "red" }}>
                  <ErrorOutlineIcon fontSize="xs" />
                  <Typography fontSize="12px">{errors.wallet}</Typography>
                </Box>
              )}
            </Box>

            <Box flex={1}>
              {/* Month Input */}
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Month (Duration) <span style={{ color: "red" }}>*</span>
              </Typography>
              <Box display="flex" alignItems="center">
                <CustomInput
                  mb={2}
                  width="100%"
                  fullWidth={true}
                  type="number"
                  name="month"
                  id="month"
                  value={month}
                  // error={monthValidate}
                  endAdornment={{
                    decrease: handleDecrease,
                    increase: handleIncrease,
                  }}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    errors.month = "";
                  }}
                  // onChange={(e) => setMonthValidate(e.target.value < 1 || e.target.value > 12)}
                />
              </Box>

              {errors.month && (
                <Box display="flex" gap={1} sx={{ color: "red" }}>
                  <ErrorOutlineIcon fontSize="xs" />
                  <Typography fontSize="12px">{errors.month}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            {/* Region Selection */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Support Region <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="select"
                name="supportRegion"
                id="supportRegion"
                value={supportRegion}
                onChange={(e) => {
                  setSupportRegion(e.target.value);
                  errors.supportRegion = "";
                }}
                options={supportRegions.map((item) => ({
                  value: item.SupportRegionID,
                  label: item.Region,
                }))}
              />
              {errors.supportRegion && (
                <Box display="flex" gap={1} sx={{ color: "red" }}>
                  <ErrorOutlineIcon fontSize="xs" />
                  <Typography fontSize="12px">
                    {errors.supportRegion}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box flex={1}>
              {/* Donor Country Selection */}
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>Donor Country 
                {/* <span style={{ color: "red" }}>*</span> */}
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="select"
                name="donorCountry"
                id="donorCountry"
                value={baseCountry}
                onChange={(e) => {
                  setBaseCountry(e.target.value);
                  setErrors((prev) => ({ ...prev, donorCountry: "" }));
                }}
                options={baseCountryList.map((item) => ({
                  value: item.BaseCountryID,
                  label: item.BaseCountryName,
                }))}
              />
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            {/* ManyChat ID Input */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                ManyChat ID <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="text"
                name="manychatId"
                id="manychatId"
                placeholder="ManyChat ID"
                value={manyChatId}
                onChange={(e) => {
                  const value = e.target.value;
                  setManyChatId(value);

                  if (value === "") {
                    setErrors((prev) => ({ ...prev, manyChatId: "ManyChat ID required." }));
                  } else if (!/^\d+$/.test(value)) {
                    setErrors((prev) => ({ ...prev, manyChatId: "Only numeric values are allowed for ManyChat ID." }));
                  } else {
                    setErrors((prev) => ({ ...prev, manyChatId: "" }));
                  }
                }}
              />
              {errors.manyChatId && (
                <Box display="flex" gap={1} sx={{ color: "red" }}>
                  <ErrorOutlineIcon fontSize="xs" />
                  <Typography fontSize="12px">{errors.manyChatId}</Typography>
                </Box>
              )}
            </Box>

            {/* Contact Link Input */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Contact Person Link
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="text"
                name="contactLink"
                id="contactLink"
                placeholder="Contact Person Link"
                value={contactLink}
                onChange={(e) => setContactLink(e.target.value)}
              />
            </Box>
          </Box>

          {/* Note Input */}
          <Box>
            <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
              Note
            </Typography>
            <CustomInput
              mb={2}
              width="100%"
              fullWidth={true}
              type="text"
              name="note"
              id="note"
              placeholder="Note"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          height="auto"
        >
          {/* Screenshot Upload */}
          <Box fullwidth="true" sx={{ maxWidth: 280 }}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
              Screenshot <span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomDropzone
              handleDrop={handleDrop}
              uploadProgress={uploadProgress}
            />
            {errors.files && (
              <Box display="flex" gap={1} sx={{ color: "red" }}>
                <ErrorOutlineIcon fontSize="xs" />
                <Typography fontSize="12px">{errors.files}</Typography>
              </Box>
            )}
          </Box>

          <Box display="flex" justifyContent="center" gap={2} mt={4} mb={2}>
            <CustomButton
              width={true}
              variant="outlined"
              type="button"
              text="Cancel"
              fontWeight="normal"
              onClick={() => location.reload()}
            />
            <CustomButton
              width={true}
              variant="contained"
              type="submit"
              text="Register"
              fontWeight="normal"
              disabled={!btnDisable}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CreateForm;
