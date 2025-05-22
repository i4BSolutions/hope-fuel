import { Box, Typography, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import createFormSubmit from "../utilites/createForm/createformSubmit";
import filehandler from "../utilites/createForm/fileHandler";
import { remove } from "aws-amplify/storage";

import { useAgentStore } from "../../stores/agentStore";
import CustomButton from "../components/Button";
import CustomDropzone from "../components/Dropzone";
import CustomInput from "../components/Input";
import ErrorMessage from "./components/errorMessage";

const schema = z.object({
  currency: z.string().min(1, "Currency is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  walletId: z.coerce.number().min(1, "Wallet is required"),
  supportRegion: z.coerce.number().min(1, "Support region is required"),
  donorCountry: z.coerce.number().min(1, "Donor country is required"),
  month: z.coerce.number().min(1, "Month must be at least 1"),
  manyChatId: z.string().regex(/^\d+$/, "Numeric ID only"),
  contactLink: z.string().optional(),
  note: z.string().optional(),
});

const CreateForm = ({ userInfo, setloading, onSuccess }) => {
  const { agent } = useAgentStore();

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

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: "",
      amount: 0,
      walletId: "",
      month: 1,
      supportRegion: "",
      donorCountry: "",
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

  const onSubmit = async (data) => {
    setHasSubmitted(true);
    if (!files.length) return;
    setloading(true);
    await createFormSubmit(
      data,
      files,
      userInfo,
      setloading,
      agent.id,
      onSuccess
    );
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold" align="center" sx={{ mt: 8 }}>
        Customer Membership Registration
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        gap={4}
        sx={{ maxWidth: 980, mx: "auto", my: 4, p: 3 }}
      >
        <Box width="100%">
          {/* Name and Email Input */}
          <Box gap={2} display="flex" flexDirection="column">
            {/* Username Input */}
            <Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                name="username"
                type="text"
                value={userInfo.name}
                fullWidth
                disabled
                sx={{
                  height: "48px",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                  },
                  "& .MuiInputBase-input": {
                    height: "100%",
                    padding: "0px 12px",
                    fontSize: "14px",
                  },
                }}
              />
            </Box>

            {/* Email Input */}
            <Box width="100%">
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Email <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                name="email"
                type="email"
                value={userInfo.email}
                fullWidth
                disabled
                sx={{
                  height: "48px",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                  },
                  "& .MuiInputBase-input": {
                    height: "100%",
                    padding: "0px 12px",
                    fontSize: "14px",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Currency and Amount Input */}
          <Box display="flex" alignItems="start" gap={2} mt={2}>
            {/* Currency Input */}
            <Box flex={1} sx={{ maxWidth: 120 }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Amount <span style={{ color: "red" }}>*</span>
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
            <Box flex={2} sx={{ maxWidth: 180 }}>
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
          <Box maxWidth={300} mb={2}>
            {minAmountError && <ErrorMessage message={minAmountError} />}
          </Box>

          {/* Wallet and Month Input */}
          <Box display="flex" alignItems="start" gap={2}>
            {/* Wallet Input */}
            <Box flex={1} sx={{ maxWidth: 150 }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Wallet <span style={{ color: "red" }}>*</span>
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

            {/* Month Input */}
            <Box flex={1} sx={{ maxWidth: 150 }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Month(Duration) <span style={{ color: "red" }}>*</span>
              </Typography>
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

          {/* SupportRegion and DonorCountry Input */}
          <Box display="flex" alignItems="start" gap={2} mt={1}>
            {/* SupportRegion Input */}
            <Box flex={1} sx={{ maxWidth: 150 }}>
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

            {/* DonorCountry Input */}
            <Box flex={1} sx={{ maxWidth: 150 }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                Donor Country <span style={{ color: "red" }}>*</span>
              </Typography>
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
            </Box>
          </Box>

          {/* ManyChatId and ContactPersonLink Input */}
          <Box display="flex" alignItems="start" gap={2} mt={1}>
            {/* ManyChatId Input */}
            <Box flex={1} sx={{ maxWidth: 150 }}>
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

            {/* ContactPersonLink Input */}
            <Box flex={1} sx={{ maxWidth: 150 }}>
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
          <Box sx={{ maxWidth: 400 }} mt={2}>
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
          <Box fullwidth="true" sx={{ width: 300 }}>
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

          <Box display="flex" justifyContent="center" gap={2} mt={4}>
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
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CreateForm;
