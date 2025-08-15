"use client";

import { useSnackbar } from "@/components/shared/SnackbarProvider";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import DetailModal from "../UI/Components/Modal";
import SubscriptionCard from "../UI/Components/SubscriptionCard";
import theme from "../UI/theme";
import getSignedUrl from "../utilites/getSignedUrl";
import HopeFuelIDListDetails from "./_components/HopeFuelIDListDetails";
import HopeFuelIDListItem from "./_components/HopeFuelIDListItem";
import ImageCarouselModal from "./_components/ImageCarousel";

const PAGE_SIZE = 10;

const HopeFuelIdListPage = () => {
  const { showSnackbar } = useSnackbar();
  const searchRef = useRef("");
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
  const [formStatusDialog, setFormStatusDialog] = useState(false);
  const [formStatusValues, setFormStatusValues] = useState({
    statusId: null,
    formStatusId: null,
    hopeFuelId: null,
  });
  const [formStatusLoading, setFormStatusLoading] = useState(false);

  const formStatusDialogHandler = async (values) => {
    console.log(values);
    if (values) {
      try {
        setFormStatusLoading(true);
        const response = await fetch("/api/hopeFuelList/form-status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          showSnackbar("Failed to update form status", "error");
          setFormStatusDialog(false);
          return;
        }
        showSnackbar("Form status updated successfully", "success");
        if (values.hopeFuelId) {
          await fetchDetails(values.hopeFuelId);
        }
      } catch (error) {
        console.error("Error updating form status:", error);
      } finally {
        setFormStatusLoading(false);
      }
    }
    setFormStatusDialog((prev) => !prev);
  };

  useEffect(() => {
    if (searchRef.current === "") {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const url = `api/hopeFuelList/items?page=${page}&limit=${PAGE_SIZE}`;
          const response = await fetch(url);
          const { data } = await response.json();
          setData((prev) => (page === 1 ? data : [...prev, ...data]));
          setHasMore(data.length === PAGE_SIZE);
        } catch (error) {
          setError(error.message);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [page, formStatusDialog]);

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
      setFormStatusValues({
        statusId: result.data.TransactionStatusID,
        formStatusId: result.data.FormStatusID,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchSubscriptionByHopeFuelID = async (hopeId) => {
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

  const onSearchHandler = async () => {
    try {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      if (searchRef.current === "") {
        const response = await fetch(
          `api/hopeFuelList/items?page=1&limit=${PAGE_SIZE}`
        );
        const { data } = await response.json();
        setData(data);
        setHasMore(data.length === PAGE_SIZE);
      } else {
        const url = `api/hopeFuelList/search?q=${encodeURIComponent(
          searchRef.current
        )}`;
        const response = await fetch(url);
        const { data } = await response.json();
        setData(data);
        setHasMore(false);
      }
    } catch (error) {
      setError(error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

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
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: 445,
          margin: "0 auto",
          px: 2,
          py: 1,
          backgroundColor: "#F1F5F9",
          borderRadius: 20,
          mt: 3,
        }}
      >
        <TextField
          sx={{ px: 1 }}
          fullWidth
          variant="standard"
          placeholder="Search..."
          onChange={(e) => {
            searchRef.current = e.target.value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearchHandler();
            }
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />

        <IconButton aria-label="search" size="large" onClick={onSearchHandler}>
          <SearchIcon />
        </IconButton>
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
        formStatusDialogHandler={formStatusDialogHandler}
        setFormStatusValues={setFormStatusValues}
      />

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            height: "30vh",
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
            <HopeFuelIDListDetails
              data={details}
              formStatusDialogHandler={formStatusDialogHandler}
              setFormStatusValues={setFormStatusValues}
            />
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

      {/* Form Status Dialog */}
      <Dialog
        open={formStatusDialog}
        onClose={() => {
          formStatusDialogHandler();
        }}
      >
        <DialogTitle>Change Form Status Manually</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1 }} fullWidth>
              <InputLabel id="form-status-dialog-select-label">
                Form Status
              </InputLabel>
              <Select
                labelId="form-status-dialog-select-label"
                id="form-status-dialog-select"
                input={<OutlinedInput label="Form Status" />}
                value={formStatusValues.statusId}
                onChange={(e) =>
                  setFormStatusValues((prev) => ({
                    ...prev,
                    statusId: e.target.value,
                  }))
                }
              >
                <MenuItem value={1}>Form Entry</MenuItem>
                <MenuItem value={2}>Payment Checked</MenuItem>
                <MenuItem value={3}>Card Issued</MenuItem>
                <MenuItem value={4}>Cancel</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              formStatusDialogHandler();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              formStatusDialogHandler(formStatusValues);
            }}
            loading={formStatusLoading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HopeFuelIdListPage;
