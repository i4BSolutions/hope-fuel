"use client";

import { useCallback, useEffect, useState } from "react";
import CustomButton from "../components/Button";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import FundraiserCard from "./components/FundraiserCard";
import { Box, CircularProgress, Container, Grid2, Modal } from "@mui/material";
import FundraiserDetails from "./components/FundraiserDetails";

const FundraisingFormPage = () => {
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState([]);
  const [fundraiserDetails, setFundraiserDetails] = useState(null);
  const [fetchFundraiserLoading, setFetchFundraiserLoading] = useState(false);
  const [fundraiserDetailLoading, setFundraiserDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFundraiserDetailsModal, setOpenFundraiserDetailsModal] =
    useState(false);

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
                />
              </Grid2>
            ))}
          </Grid2>
        </Container>
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
            />
          )}
        </Modal>
      </Box>
    </>
  );
};
export default FundraisingFormPage;
