"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircularProgress, Typography } from "@mui/material";
import { remove } from "aws-amplify/storage";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useAgentStore } from "../../stores/agentStore";
import CustomButton from "../components/Button";
import CustomInput from "../components/CustomInput";
import CustomDropzone from "../components/Dropzone";
import filehandler from "../utilites/createForm/fileHandler";
import extendFormSubmit from "../utilites/extendForm/extendFormSubmit";
import ErrorMessage from "./components/errorMessage";

const schema = z.object({
  currency: z.string().min(1, "Currency is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  walletId: z.coerce.number().min(1, "Wallet is required"),
  supportRegion: z.coerce.number().min(1, "Support region is required"),
  donorCountry: z.coerce.number().optional(),
  month: z.coerce.number().min(1, "Month must be at least 1"),
  manyChatId: z.string().regex(/^\d+$/, "Numeric ID only"),
  contactLink: z.string().optional(),
  note: z.string().optional(),
});

const ExtendForm = ({ userInfo, setLoading, onSuccess }) => {
  const { agent } = useAgentStore();
  const [customerId, setCustomerId] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [supportRegions, setSupportRegions] = useState([]);
  const [baseCountryList, setBaseCountryList] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [minAmountError, setMinAmountError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userCountry, setUserCountry] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  if (agent.id === null) {
    return <Typography>Please log in to continue.</Typography>;
  }

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    reValidateMode: "onBlur",
    defaultValues: {
      currency: "",
      amount: null,
      walletId: "",
      month: 1,
      supportRegion: "",
      donorCountry: null,
      manyChatId: "",
      contactLink: "",
      note: "",
    },
  });

  const currency = watch("currency");
  const amount = watch("amount");
  const month = watch("month");
  const walletId = watch("walletId");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/InCustomerTable/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userInfo.name, email: userInfo.email }),
      });
      const ans = await res.json();
      setValue("donorCountry", ans.UserCountry);
      setUserCountry(ans.UserCountry);
      setCustomerId(ans.CustomerId);
    };
    fetchUser();
  }, [userInfo, setValue]);

  useEffect(() => {
    const fetchWallets = async () => {
      if (!currency) return;
      const res = await fetch(
        `/api/loadWalletByCurrency?currencyCode=${currency}`
      );
      const data = await res.json();
      setWallets(data);
    };
    fetchWallets();
  }, [currency]);

  useEffect(() => {
    Promise.all([
      fetch("/api/loadSupportRegion").then((res) => res.json()),
      fetch("/api/countries").then((res) => res.json()),
      fetch("/api/getCurrencies").then((res) => res.json()),
    ]).then(([regions, countries, currencyList]) => {
      setSupportRegions(regions);
      setBaseCountryList(countries.Countries);
      setCurrencies(currencyList);
    });
  }, []);

  useEffect(() => {
    if (!currency) return;
    fetch("/api/v1/exchange-rates/get-by-currency-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency }),
    })
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.data?.ExchangeRate ?? 0));
  }, [currency]);

  useEffect(() => {
    if (!walletId || !amount || !month) return;
    fetch("/api/v1/minimum-amount/check-minimum-amount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, month, walletId }),
    })
      .then((res) => res.json())
      .then((data) => setMinAmountError(data.error));
  }, [walletId, amount, month]);

  const handleDrop = async (acceptedFiles) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    await filehandler(acceptedFiles, setFiles, files, setUploadProgress);
  };

  const handleDeleteFile = async (fileName) => {
    const fileToDelete = files.find((file) => file.name === fileName);
    if (!fileToDelete) return;
    await remove({ key: fileToDelete.key });
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const onSubmit = async (formData) => {
    setHasSubmitted(true);
    if (!files.length) return;
    setLoading(true);
    setFormLoading(true);
    try {
      await extendFormSubmit(
        formData,
        files,
        userInfo,
        setLoading,
        agent.id,
        customerId,
        onSuccess
      );
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  if (formLoading)
    return (
      <Box sx={{ display: "grid", placeItems: "center", height: "500px" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Typography
        component="h1"
        sx={{ fontSize: "23px", marginTop: 8 }}
        variant="h5"
        fontWeight="bold"
        align="center"
      >
        Extend User Membership
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
          <Box display="flex" flexDirection="column" gap={2}>
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
                disabled={true}
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
                disabled={true}
              />
            </Box>

            {/* PRF No */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                PRF No <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomInput
                mb={2}
                width="100%"
                fullWidth={true}
                type="number"
                name="prf_no"
                id="prf_no"
                placeholder="00000000"
                readOnly
                value={userInfo.prf_no}
                disabled={true}
              />
            </Box>
          </Box>

          <Box>
            <Box display="flex" gap={2}>
              {/* Currency Selection */}
              <Box flex={1}>
                <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                  Currency<span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      type="select"
                      options={currencies.map((c) => ({
                        label: c.CurrencyCode,
                        value: c.CurrencyCode,
                      }))}
                      placeholder="Select currency"
                      {...field}
                      error={!!errors.currency}
                      helperText={errors.currency?.message}
                    />
                  )}
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
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label="Amount"
                      type="text"
                      placeholder="Amount"
                      {...field}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box maxWidth={300}>
              {minAmountError && <ErrorMessage message={minAmountError} />}
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            {/* Wallet Selection */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Wallet<span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="walletId"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Wallet"
                    type="select"
                    options={wallets.map((w) => ({
                      label: w.WalletName,
                      value: w.WalletID,
                    }))}
                    {...field}
                    error={!!errors.walletId}
                    helperText={errors.walletId?.message}
                  />
                )}
              />
            </Box>

            <Box flex={1}>
              {/* Month Input */}
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Month (Duration) <span style={{ color: "red" }}>*</span>
              </Typography>
              <Box display="flex" alignItems="center">
                <Controller
                  name="month"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label="Month"
                      type="number"
                      {...field}
                      error={!!errors.month}
                      helperText={errors.month?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            {/* Region Selection */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Support Region <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="supportRegion"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Region"
                    type="select"
                    options={supportRegions.map((r) => ({
                      label: r.Region,
                      value: r.SupportRegionID,
                    }))}
                    {...field}
                    error={!!errors.supportRegion}
                    helperText={errors.supportRegion?.message}
                  />
                )}
              />
            </Box>

            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Donor Country
              </Typography>

              {userCountry === null ? (
                <Controller
                  name="donorCountry"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label="Country"
                      type="select"
                      options={baseCountryList.map((c) => ({
                        label: c.BaseCountryName,
                        value: c.BaseCountryID,
                      }))}
                      {...field}
                      error={!!errors.donorCountry}
                      helperText={errors.donorCountry?.message}
                    />
                  )}
                />
              ) : (
                <Controller
                  name="donorCountry"
                  control={control}
                  render={({ field }) => {
                    const selected = baseCountryList.find(
                      (c) => c.BaseCountryID === field.value
                    );
                    return (
                      <CustomInput
                        disabled
                        label="Country"
                        type="text"
                        value={selected?.BaseCountryName || "N/A"}
                        error={!!errors.donorCountry}
                        helperText={errors.donorCountry?.message}
                      />
                    );
                  }}
                />
              )}
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            {/* ManyChat ID Input */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                ManyChat ID <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="manyChatId"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="ManyChat ID"
                    type="text"
                    placeholder="123456"
                    {...field}
                    error={!!errors.manyChatId}
                    helperText={errors.manyChatId?.message}
                  />
                )}
              />
            </Box>

            {/* Contact Link Input */}
            <Box flex={1}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Contact Person Link
              </Typography>
              <Controller
                name="contactLink"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Contact Person Link"
                    type="text"
                    placeholder="https://..."
                    {...field}
                    error={!!errors.contactLink}
                    helperText={errors.contactLink?.message}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Note Input */}
          <Box>
            <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
              Note
            </Typography>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Note"
                  type="text"
                  placeholder="Additional comments..."
                  {...field}
                  error={!!errors.note}
                  helperText={errors.note?.message}
                />
              )}
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
              files={uploadedFiles}
              onDelete={handleDeleteFile}
            />
            {hasSubmitted && !files.length && (
              <ErrorMessage message="Please upload at least one screenshot." />
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
              text="Extend"
              fontWeight="normal"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ExtendForm;
