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
import HopeFuelIDListDetails from "./components/HopeFuelIDListDetails";
import HopeFuelIDListItem from "./components/HopeFuelIDListItem";
import ImageCarouselModal from "./components/ImageCarousel";

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
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [openScreenshotModal, setOpenScreenshotModal] = useState(false);
  const [screenshotsLists, setScreenshotsLists] = useState([]);

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

  const handleOpenScreenshots = (screenshots) => {
    console.log(typeof screenshots);
    if (!Array.isArray(screenshots)) {
      screenshots = [screenshots];
    }
    setScreenshotsLists(screenshots);
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
    setOpenModal((prev) => !prev);
  };

  const handleClose = () => {
    setOpenModal((prev) => !prev);
  };

  if (loading) {
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <CircularProgress />
    </Box>;
  }

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
          mx: "5rem",
          my: "2rem",
          borderColor: "#CBD5E1",
        }}
      />
      {data.length > 0 ? (
        <>
          <HopeFuelIDListItem
            data={data}
            onClick={handleOpen}
            onClickScreenShot={handleOpenScreenshots}
          />
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#334155",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: "28px",
            }}
          >
            No Result Found
          </Typography>
        </Box>
      )}
      <DetailModal direction="left" open={openModal} onClose={handleClose}>
        <Paper
          sx={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "100%",
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
          ) : details ? (
            <HopeFuelIDListDetails data={details} />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ textAlign: "center" }}>
                No Details Found
              </Typography>
            </Box>
          )}
          {/* <SubscriptionCard cards={SUBSCRIPTION_DATA} /> */}
        </Paper>
      </DetailModal>
      <ImageCarouselModal
        open={openScreenshotModal}
        onClose={handleCloseScreenshots}
        screenshots={screenshotsLists}
      />
    </>
  );
};

export default HopeFuelIdListPage;
