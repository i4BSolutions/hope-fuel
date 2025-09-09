"use client";

import CardsView from "@/components/prfhq/CardsView";
import SubscriptionCards from "@/components/prfhq/SubscriptionCards";
import ImagePreviewModal from "@/components/shared/ImagePreviewModal";
import { useSnackbar } from "@/components/shared/SnackbarProvider";
import Spinner from "@/components/shared/Spinner";
import { RestartAlt } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Modal from "../UI/Components/Modal";
import getSignedUrl from "../utilites/getSignedUrl";

export default function AllHopefuelPage() {
  const { showSnackbar } = useSnackbar();

  // Card Data States
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs().endOf("month"));
  const [pageSize, setPageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [cardData, setCardData] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Screenshot States
  const [openScreenshotModal, setOpenScreenshotModal] = useState(false);
  const [screenshotsLists, setScreenshotsLists] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  // Form status States
  const [formStatusDialog, setFormStatusDialog] = useState(false);
  const [formStatusValues, setFormStatusValues] = useState({
    statusId: null,
    formStatusId: null,
  });
  const [formStatusLoading, setFormStatusLoading] = useState(false);

  // Subscription States
  const [subscriptions, setSubscriptions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [currentHopefuelId, setCurrentHopefuelId] = useState(null);

  // Fetch the card data based on filters and pagination
  const fetchCardData = async () => {
    let queryString = `?status=${status}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}&page=${page}&pageSize=${pageSize}`;

    if (!query) {
      queryString = queryString;
    } else if (query.includes("@")) {
      queryString = queryString + `&email=${query}`;
    } else if (query.toLowerCase().replace(/\s/g, "").startsWith("prfhq-")) {
      queryString = queryString + `&hopefuelID=${query.split("-")[1]}`;
    } else if (!isNaN(query.charAt(0))) {
      queryString = queryString + `&cardID=${query}`;
    } else {
      queryString = queryString + `&name=${query}`;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/hopeFuelList${queryString}`);
      const data = await response.json();
      setCardData(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, [query, status, fromDate, toDate, page, pageSize]);

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));

  const goNext = () =>
    setPage((p) => (p < Math.ceil(total / pageSize) ? p + 1 : p));

  const formStatusDialogHandler = async (values) => {
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
        fetchCardData();
        showSnackbar("Form status updated successfully", "success");
      } catch (error) {
        console.error("Error updating form status:", error);
      } finally {
        setFormStatusLoading(false);
      }
    }
    setFormStatusDialog((prev) => !prev);
  };

  const fetchSubscriptionByHopeFuelID = async (hopeId) => {
    setLoadingSubscription(true);
    setScreenshotsLists([]);
    setCurrentHopefuelId(hopeId);

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
    } finally {
      setLoadingSubscription(false);
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

  const handleOpenDrawer = (hopeFuelId) => {
    fetchSubscriptionByHopeFuelID(hopeFuelId);
    setOpenDrawer((prev) => !prev);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const onResetHandler = () => {
    setQuery("");
    setSearchQuery("");
    setStatus("all");
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs().endOf("month"));
    setPageSize(9);
    setPage(1);
  };

  if (!cardData) {
    return <Spinner />;
  }

  return (
    <div style={{ background: "#fff" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #eee", padding: "1rem 2rem" }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          All Hopefuel ID Cards
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Card-based view for Hopefuel IDs with filters and pagination. Review
          payments, notes, and modify statuses.
        </Typography>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: "1rem 2rem",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.5fr",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search by name, email, HopefuelID, CardID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setQuery(e.target.value);
              setPage(1);
            }
          }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
            },
          }}
        />

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="1">Form Entry</MenuItem>
            <MenuItem value="2">Payment Checked</MenuItem>
            <MenuItem value="3">Card Issued</MenuItem>
            <MenuItem value="4">Cancel</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="From"
            value={fromDate}
            onChange={(newValue) => {
              setFromDate(newValue);
              setPage(1);
            }}
            views={["year", "day"]}
            slots={{
              actionBar: () => null,
            }}
          />

          <DateTimePicker
            label="To"
            value={toDate}
            onChange={(newValue) => {
              setToDate(newValue);
              setPage(1);
            }}
            views={["year", "day"]}
            slots={{
              actionBar: () => null,
            }}
          />
        </LocalizationProvider>

        <Button
          startIcon={<RestartAlt />}
          variant="outlined"
          color="inherit"
          size="small"
          onClick={onResetHandler}
        >
          Reset Filters
        </Button>
        {/* </Box> */}
      </div>

      {/* Cards Grid */}
      <CardsView
        cardData={cardData}
        loading={loading}
        handleOpenScreenshots={handleOpenScreenshots}
        formStatusDialogHandler={formStatusDialogHandler}
        setFormStatusValues={setFormStatusValues}
        handleOpenDrawer={handleOpenDrawer}
      />

      {/* Pagination */}
      <div
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body3" color="text.secondary">
          Showing {cardData.length} of {total}
        </Typography>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body3">Cards Per Page:</Typography>
            <TextField
              select
              size="small"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={24}>24</MenuItem>
            </TextField>
          </Box>
          <IconButton onClick={goPrev}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="body2">{page}</Typography>
          <IconButton onClick={goNext}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>

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

      {/* Screenshot Modal */}
      <ImagePreviewModal
        open={openScreenshotModal}
        onClose={handleCloseScreenshots}
        screenshots={screenshotsLists}
        activeImage={activeImage}
        activeImageHandler={setActiveImage}
      />

      {/* List of Cards Issued */}
      <Modal direction="left" open={openDrawer} onClose={handleCloseDrawer}>
        <Paper
          sx={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "100%",
            pb: 4,
            maxWidth: "350px",
            height: "100vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            overflow: "auto",
            zIndex: 1000,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          {loadingSubscription ? (
            <Spinner />
          ) : (
            <Box>
              <Typography variant="h4" sx={{ p: 3 }}>
                PRFHQ - {currentHopefuelId}
              </Typography>
              <Divider />
              <SubscriptionCards cards={subscriptions} />
            </Box>
          )}
        </Paper>
      </Modal>
    </div>
  );
}
