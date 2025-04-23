"use client";

import { useCallback, useEffect, useState } from "react";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import FundraiserCard from "./components/FundraiserCard";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid2,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FundraiserDetails from "./components/FundraiserDetails";
import CustomButton from "../components/Button";
import FundraisingForm from "./components/FundraisingForm";

const FundraisingFormPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [fundraisers, setFundraisers] = useState([]);
  const [filteredFundraisers, setFilteredFundraisers] = useState([]);
  const [fundraiserDetails, setFundraiserDetails] = useState(null);
  const [fundraiserID, setFundraiserID] = useState(null);
  const [fetchFundraiserLoading, setFetchFundraiserLoading] = useState(false);
  const [fundraiserDetailLoading, setFundraiserDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  const [openFundraiserDetailsModal, setOpenFundraiserDetailsModal] =
    useState(false);
  const [openFundraiserDeleteModal, setOpenFundraiserDeleteModal] =
    useState(false);
  const [openCreateFundraiserModal, setOpenCreateFundraiserModal] =
    useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    getAllFundraisers();
  }, []);

  useEffect(() => {
    if (!fundraisers || fundraisers.length === 0) return;

    const countries = [
      ...new Set(
        fundraisers
          .map((f) => f.BaseCountryName)
          .filter((c) => c && typeof c === "string")
      ),
    ];

    const currencyArrays = fundraisers
      .map((f) => f.AcceptedCurrencies)
      .filter((arr) => Array.isArray(arr));

    const currencies = [...new Set(currencyArrays.flat())];

    setAvailableCountries(countries);
    setAvailableCurrencies(currencies);
  }, [fundraisers]);

  useEffect(() => {
    if (!fundraisers) return;

    let filtered = [...fundraisers];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((fundraiser) => {
        const nameMatch =
          typeof fundraiser.FundraiserName === "string" &&
          fundraiser.FundraiserName.toLowerCase().includes(query);

        const countryNameMatch =
          fundraiser.BaseCountryName &&
          typeof fundraiser.BaseCountryName === "string" &&
          fundraiser.BaseCountryName.toLowerCase().includes(query);

        const idMatch =
          fundraiser.FundraiserCentralID &&
          String(fundraiser.FundraiserCentralID).includes(query);

        return nameMatch || countryNameMatch || idMatch;
      });
    }

    if (selectedCountry) {
      filtered = filtered.filter(
        (fundraiser) => fundraiser.BaseCountryName === selectedCountry
      );
    }

    if (selectedCurrency) {
      filtered = filtered.filter(
        (fundraiser) =>
          Array.isArray(fundraiser.AcceptedCurrencies) &&
          fundraiser.AcceptedCurrencies.includes(selectedCurrency)
      );
    }

    setFilteredFundraisers(filtered);
  }, [searchQuery, fundraisers, selectedCountry, selectedCurrency]);

  const getAllFundraisers = useCallback(async () => {
    if (fetchFundraiserLoading) return;

    setFetchFundraiserLoading(true);

    try {
      const response = await fetch("/api/v1/fundraisers");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch data (${response.status})`
        );
      }

      const data = await response.json();
      const fundraisersList = data.fundraisers || [];
      setFundraisers(fundraisersList);
      setFilteredFundraisers(fundraisersList);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchFundraiserLoading(false);
    }
  }, []);

  const getFundraiserDetails = useCallback(async (fundraiserId) => {
    if (!fundraiserId) return;

    setFundraiserDetailLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/fundraisers/details/${fundraiserId}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch fundraiser details (${response.status})`
        );
      }

      const details = await response.json();

      setFundraiserDetails(details.data);
    } catch (error) {
      console.error("Error fetching fundraiser details:", err);
      setError(`Failed to load fundraiser details: ${err.message}`);

      setFundraiserDetails(null);
    } finally {
      setFundraiserDetailLoading(false);
    }
  }, []);

  const handleOpenFundraiserDetailsModal = useCallback((id) => {
    getFundraiserDetails(id);
    setOpenFundraiserDetailsModal((prev) => !prev);
  }, []);

  const handleCloseFundraiserDetailsModal = useCallback(
    () => setOpenFundraiserDetailsModal((prev) => !prev),
    []
  );
  const handleEdit = (id) => {
    router.push(`/fundraisers/${id}/edit`);
  };

  const handleOpenFundraiserDeleteModal = useCallback((id) => {
    setFundraiserID(id);
    setOpenFundraiserDeleteModal((prev) => !prev);
  }, []);

  const handleCloseFundraiserDeleteModal = useCallback(() => {
    setOpenFundraiserDeleteModal((prev) => !prev);
  }, []);

  const handleDeleteFundraiserConfirm = useCallback(async () => {
    if (!fundraiserID) return;

    try {
      const response = await fetch(
        `api/v1/fundraisers/delete/${fundraiserID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete fundraiser (${response.status})`
        );
      }
      const result = await response.json();

      await getAllFundraisers();
      setOpenSnackbar(true);
    } catch (error) {
      console.log(error);
    } finally {
      setOpenFundraiserDeleteModal(false);
      setOpenFundraiserDetailsModal(false);
    }
  }, [fundraiserID, getAllFundraisers]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenFilterModal = () => {
    setOpenFilterModal((prev) => !prev);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal((prev) => !prev);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleApplyFilter = () => {
    // Filters are already applied via useEffect
    handleCloseFilterModal();
  };

  const handleClearFilter = () => {
    setSelectedCountry("");
    setSelectedCurrency("");
    handleCloseFilterModal();
  };

  if (fetchFundraiserLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }
  console.log(availableCurrencies);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Typography sx={{ color: "#000000", fontSize: 34, fontWeight: 600 }}>
          Fundraiser
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            name="search"
            placeholder="Search"
            sx={{ width: 642 }}
            value={searchQuery}
            onChange={handleSearchQueryChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 20,
                height: 40,
              },
            }}
          />
          <Button
            onClick={handleOpenFilterModal}
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              borderRadius: 20,
              height: 40,
              textTransform: "none",
              borderColor: "#E2E8F0",
              color: "#64748B",
              "&:hover": {
                borderColor: "#CBD5E1",
                backgroundColor: "#F1F5F9",
              },
            }}
          >
            Filter
          </Button>
        </Box>
        <CustomButton
          onClick={() => {
            setOpenCreateFundraiserModal((prev) => !prev);
          }}
          text="Create New"
          icon={<AddCircleOutlineOutlinedIcon />}
        />
      </Box>
      <Divider sx={{ mb: 3, mt: 1, backgroundColor: "#E2E8F0", height: 3 }} />
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        {filteredFundraisers.length > 0 ? (
          <Container maxWidth="xl">
            <Grid2
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
            >
              {filteredFundraisers.map((fundraiser, index) => (
                <Grid2 xs={12} sm={6} md={3} lg={3} key={index}>
                  <FundraiserCard
                    fundraiser={fundraiser}
                    onClick={handleOpenFundraiserDetailsModal}
                    onEdit={handleEdit}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Container>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {searchQuery
                ? "No fundraisers match your search criteria!"
                : "There are no fundraisers!"}
            </Typography>
          </Box>
        )}

        <Modal
          open={openFilterModal}
          onClose={handleCloseFilterModal}
          aria-labelledby="filter-modal-title"
          aria-describedby="filter-modal-description"
        >
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="filter-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 3 }}
            >
              Filter by
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }}>Country</Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  displayEmpty
                  renderValue={
                    selectedCountry ? undefined : () => "Select Country/ies"
                  }
                  sx={{ borderRadius: 2 }}
                >
                  {availableCountries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1 }}>Accepted Currency</Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  displayEmpty
                  renderValue={
                    selectedCurrency ? undefined : () => "Select Currency/ies"
                  }
                  sx={{ borderRadius: 2 }}
                >
                  {availableCurrencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box> */}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={handleClearFilter}
                sx={{
                  borderRadius: 20,
                  width: "45%",
                  textTransform: "none",
                  border: "1px solid #E2E8F0",
                }}
              >
                Clear
              </Button>
              <Button
                onClick={handleApplyFilter}
                variant="contained"
                sx={{
                  borderRadius: 20,
                  width: "45%",
                  backgroundColor: "#DC2626",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#B91C1C",
                  },
                }}
              >
                Apply Filter
              </Button>
            </Box>
          </Paper>
        </Modal>

        <Modal
          open={openCreateFundraiserModal}
          onClose={() => {
            setOpenCreateFundraiserModal((prev) => !prev);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ alignSelf: "center", justifyItems: "center" }}
        >
          <FundraisingForm
            onCancel={() => {
              setOpenCreateFundraiserModal((prev) => !prev);
            }}
          />
        </Modal>

        <Modal
          open={openFundraiserDetailsModal}
          onClose={handleCloseFundraiserDetailsModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ alignSelf: "center", justifyItems: "center" }}
        >
          {fundraiserDetailLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <FundraiserDetails
              fundraiserDetails={fundraiserDetails}
              onClose={handleCloseFundraiserDetailsModal}
              onEdit={handleEdit}
              onDelete={handleOpenFundraiserDeleteModal}
            />
          )}
        </Modal>
        <Modal
          open={openFundraiserDeleteModal}
          onClose={handleCloseFundraiserDeleteModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ alignSelf: "center", justifyItems: "center" }}
        >
          <Paper
            sx={{
              backgroundColor: "#F8FAFC",
              width: 280,
              height: 146,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Are you sure you want to delete?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                startIcon={<CloseIcon />}
                variant="outlined"
                color="primary"
                onClick={handleCloseFundraiserDeleteModal}
                sx={{
                  minWidth: 80,
                  borderColor: "#DC2626",
                  borderRadius: 10,
                  color: "#DC2626",
                }}
              >
                No
              </Button>

              <Button
                startIcon={<CheckIcon />}
                variant="contained"
                color="error"
                onClick={handleDeleteFundraiserConfirm}
                sx={{
                  color: "#F8FAFC",
                  minWidth: 80,
                  backgroundColor: "#DC2626",
                  borderRadius: 10,
                  "&:hover": {
                    backgroundColor: "#DC2626",
                  },
                }}
              >
                Yes
              </Button>
            </Box>
          </Paper>
        </Modal>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Fundraiser deleted successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};
export default FundraisingFormPage;
