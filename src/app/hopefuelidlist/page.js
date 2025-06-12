"use client";

import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import DetailModal from "../UI/Components/Modal";
import SubscriptionCard from "../UI/Components/SubscriptionCard";
import theme from "../UI/theme";
import getSignedUrl from "../utilites/getSignedUrl";
import HopeFuelIDListDetails from "./_components/HopeFuelIDListDetails";
import HopeFuelIDListItem from "./_components/HopeFuelIDListItem";
import ImageCarouselModal from "./_components/ImageCarousel";

const PAGE_SIZE = 10;

const HopeFuelIdListPage = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [details, setDetails] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [openScreenshotModal, setOpenScreenshotModal] = useState(false);
  const [screenshotsLists, setScreenshotsLists] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [debouncedSearch] = useDebounce(searchText, 100);

  useEffect(() => {
    setError(null);
  }, [searchText]);

  const fetchData = useCallback(
    async (isNewSearch = false) => {
      if (!hasMore && !isNewSearch) return;

      setLoading(true);
      setError(null);

      try {
        const url = debouncedSearch
          ? `api/hopeFuelList/search?q=${encodeURIComponent(debouncedSearch)}`
          : `api/hopeFuelList/items?page=${page}&limit=${PAGE_SIZE}`;

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch data (${response.status})`
          );
        }

        const newData = await response.json();
        if (isNewSearch) {
          setData(newData.data || []);
        } else {
          setData((prev) => [...prev, ...(newData.data || [])]);
        }

        setHasMore((newData.data || []).length === PAGE_SIZE);
      } catch (error) {
        setError(error.message);
        setData(isNewSearch ? [] : data);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, page, hasMore, data]
  );

  const fetchDetails = async (hopeId) => {
    setLoadingDetails(true);
    setDetails(null);

    try {
      const response = await fetch(`/api/hopeFuelList/details/${hopeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch details");
      }
      const result = await response.json();

      setDetails(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchSubscriptionByHopeFuelID = async (hopeId) => {
    console.log(hopeId);
    setLoadingDetails(true);
    setScreenshotsLists([]);

    try {
      const response = await fetch(
        `/api/hopeFuelList/details/${hopeId}/subscription`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch subscription for HopeFuelID ${hopeFuelId}`
        );
      }
      const result = await response.json();
      setSubscriptions(result.data);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleOpenScreenshots = async (screenshots) => {
    if (!Array.isArray(screenshots)) {
      screenshots = [screenshots];
    }
    const signedUrls = await Promise.all(
      screenshots.map(async (screenshot) => {
        if (typeof screenshot === "string") {
          return await getSignedUrl(screenshot);
        }
      })
    );
    setScreenshotsLists(signedUrls);
    setOpenScreenshotModal((prev) => !prev);
  };

  const handleCloseScreenshots = () => {
    setOpenScreenshotModal((prev) => !prev);
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchData(true);
  }, [debouncedSearch]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore, error]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page]);

  const handleOpen = (hopeFuelId) => {
    fetchDetails(hopeFuelId);
    fetchSubscriptionByHopeFuelID(hopeFuelId);
    setOpenModal((prev) => !prev);
  };

  const handleClose = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          maxWidth: 445,
          margin: "0 auto",
          padding: "14px",
          backgroundColor: "#F1F5F9",
          borderRadius: 20,
          mt: 3,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Box>
      <Divider
        sx={{
          mx: { md: "1rem", lg: "2rem", xl: "3rem" },
          my: "2rem",
          borderColor: "#CBD5E1",
        }}
      />

      {!loading && data.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>No Details Found</Typography>
        </Box>
      )}

      <HopeFuelIDListItem
        data={data}
        onClick={handleOpen}
        onClickScreenShot={handleOpenScreenshots}
      />
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            height: "70vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <DetailModal direction="left" open={openModal} onClose={handleClose}>
        <Paper
          sx={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "100%",
            pb: 4,
            maxWidth: "600px",
            height: "100vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            overflow: "auto",
            zIndex: 1300,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          {loadingDetails ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <HopeFuelIDListDetails data={details} />
          )}
          <Box sx={{ mt: theme.spacing(2), mx: theme.spacing(3) }}>
            <SubscriptionCard cards={subscriptions} />
          </Box>
        </Paper>
      </DetailModal>
      <ImageCarouselModal
        open={openScreenshotModal}
        onClose={handleCloseScreenshots}
        screenshots={screenshotsLists}
        activeImage={activeImage}
        activeImageHandler={setActiveImage}
      />
    </>
  );
};

export default HopeFuelIdListPage;
