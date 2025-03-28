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
  Grid2,
  Modal,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import FundraiserDetails from "./components/FundraiserDetails";
import CustomButton from "../components/Button";

const FundraisingFormPage = () => {
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState([]);
  const [fundraiserDetails, setFundraiserDetails] = useState(null);
  const [fundraiserID, setFundraiserID] = useState(null);
  const [fetchFundraiserLoading, setFetchFundraiserLoading] = useState(false);
  const [fundraiserDetailLoading, setFundraiserDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openFundraiserDetailsModal, setOpenFundraiserDetailsModal] =
    useState(false);
  const [openFundraiserDeleteModal, setOpenFundraiserDeleteModal] =
    useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    getAllFundraisers();
  }, []);

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
      setFundraisers(data.fundraisers || []);
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
  }

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

  if (fetchFundraiserLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CustomButton
        onClick={() => {
          router.push("/fundraisers/create", { scroll: false });
        }}
        text="Create New"
        icon={<AddCircleOutlineOutlinedIcon />}
      />
      <Box
        sx={{
          flexGrow: 1,
          pt: 2,
        }}
      >
        {fundraisers.length > 0 ? (
  <Container maxWidth="xl">
    <Grid2
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
    >
      {fundraisers.map((fundraiser, index) => (
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
      There are no fundraisers!
    </Typography>
  </Box>
)}


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
