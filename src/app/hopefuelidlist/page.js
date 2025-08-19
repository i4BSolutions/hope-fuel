// "use client";

// import { useSnackbar } from "@/components/shared/SnackbarProvider";
// import SearchIcon from "@mui/icons-material/Search";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   FormControl,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   OutlinedInput,
//   Paper,
//   Select,
//   TextField,
//   Typography,
//   Pagination,
// } from "@mui/material";
// import { useCallback, useEffect, useRef, useState } from "react";
// import DetailModal from "../UI/Components/Modal";
// import SubscriptionCard from "../UI/Components/SubscriptionCard";
// import theme from "../UI/theme";
// import getSignedUrl from "../utilites/getSignedUrl";
// import HopeFuelIDListDetails from "./_components/HopeFuelIDListDetails";
// import HopeFuelIDListItem from "./_components/HopeFuelIDListItem";
// import ImageCarouselModal from "./_components/ImageCarousel";

// const PAGE_SIZE = 10;

// const HopeFuelIdListPage = () => {
//   const { showSnackbar } = useSnackbar();
//   const searchRef = useRef("");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   const [openModal, setOpenModal] = useState(false);
//   const [details, setDetails] = useState({});
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   const [openScreenshotModal, setOpenScreenshotModal] = useState(false);
//   const [screenshotsLists, setScreenshotsLists] = useState([]);
//   const [activeImage, setActiveImage] = useState(0);
//   const [formStatusDialog, setFormStatusDialog] = useState(false);
//   const [formStatusValues, setFormStatusValues] = useState({
//     statusId: null,
//     formStatusId: null,
//     hopeFuelId: null,
//   });
//   const [formStatusLoading, setFormStatusLoading] = useState(false);

//   const formStatusDialogHandler = async (values) => {
//     console.log(values);
//     if (values) {
//       try {
//         setFormStatusLoading(true);
//         const response = await fetch("/api/hopeFuelList/form-status", {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(values),
//         });
//         if (!response.ok) {
//           showSnackbar("Failed to update form status", "error");
//           setFormStatusDialog(false);
//           return;
//         }
//         showSnackbar("Form status updated successfully", "success");
//         if (values.hopeFuelId) {
//           await fetchDetails(values.hopeFuelId);
//         }
//       } catch (error) {
//         console.error("Error updating form status:", error);
//       } finally {
//         setFormStatusLoading(false);
//       }
//     }
//     setFormStatusDialog((prev) => !prev);
//   };

//   useEffect(() => {
//     if (searchRef.current === "") {
//       const fetchData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//           const url = `api/hopeFuelList/items?page=${page}&limit=${PAGE_SIZE}`;
//           const response = await fetch(url);
//           const { data, total: totalCount } = await response.json();
//           setData((prev) => (page === 1 ? data : [...prev, ...data]));
//           setHasMore(data.length === PAGE_SIZE);
//           setTotal(totalCount);
//         } catch (error) {
//           setError(error.message);
//           setHasMore(false);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [page, formStatusDialog]);

//   const fetchDetails = async (hopeId) => {
//     setLoadingDetails(true);
//     setDetails(null);

//     try {
//       const response = await fetch(`/api/hopeFuelList/details/${hopeId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch details");
//       }
//       const result = await response.json();

//       setDetails(result.data);
//       setFormStatusValues({
//         statusId: result.data.TransactionStatusID,
//         formStatusId: result.data.FormStatusID,
//       });
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const fetchSubscriptionByHopeFuelID = async (hopeId) => {
//     setLoadingDetails(true);
//     setScreenshotsLists([]);

//     try {
//       const response = await fetch(
//         `/api/hopeFuelList/details/${hopeId}/subscription`
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch subscription for HopeFuelID ${hopeFuelId}`
//         );
//       }
//       const result = await response.json();
//       setSubscriptions(result.data);
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   };

//   const handleOpenScreenshots = async (screenshots) => {
//     if (!Array.isArray(screenshots)) {
//       screenshots = [screenshots];
//     }
//     const signedUrls = await Promise.all(
//       screenshots.map(async (screenshot) => {
//         if (typeof screenshot === "string") {
//           return await getSignedUrl(screenshot);
//         }
//       })
//     );
//     setScreenshotsLists(signedUrls);
//     setOpenScreenshotModal((prev) => !prev);
//   };

//   const handleCloseScreenshots = () => {
//     setOpenScreenshotModal((prev) => !prev);
//   };

//   const onSearchHandler = async () => {
//     try {
//       setLoading(true);
//       setPage(1);
//       setHasMore(true);
//       if (searchRef.current === "") {
//         const response = await fetch(
//           `api/hopeFuelList/items?page=1&limit=${PAGE_SIZE}`
//         );
//         const { data, total: totalCount } = await response.json();
//         setData(data);
//         setHasMore(data.length === PAGE_SIZE);
//         setTotal(totalCount);
//       } else {
//         const url = `api/hopeFuelList/search?q=${encodeURIComponent(
//           searchRef.current
//         )}&page=${1}&limit=${PAGE_SIZE}`;
//         const response = await fetch(url);
//         const { data, total: totalCount } = await response.json();
//         setData(data);
//         setHasMore(false);
//         setTotal(totalCount);
//       }
//     } catch (error) {
//       setError(error.message);
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpen = (hopeFuelId) => {
//     fetchDetails(hopeFuelId);
//     fetchSubscriptionByHopeFuelID(hopeFuelId);
//     setOpenModal((prev) => !prev);
//   };

//   const handleClose = () => {
//     setOpenModal((prev) => !prev);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           width: "100%",
//           maxWidth: 445,
//           margin: "0 auto",
//           px: 2,
//           py: 1,
//           backgroundColor: "#F1F5F9",
//           borderRadius: 20,
//           mt: 3,
//         }}
//       >
//         <TextField
//           sx={{ px: 1 }}
//           fullWidth
//           variant="standard"
//           placeholder="Search..."
//           onChange={(e) => {
//             searchRef.current = e.target.value;
//           }}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               onSearchHandler();
//             }
//           }}
//           InputProps={{
//             disableUnderline: true,
//           }}
//         />

//         <IconButton aria-label="search" size="large" onClick={onSearchHandler}>
//           <SearchIcon />
//         </IconButton>
//       </Box>
//       <Divider
//         sx={{
//           mx: { md: "1rem", lg: "2rem", xl: "3rem" },
//           my: "2rem",
//           borderColor: "#CBD5E1",
//         }}
//       />

//       {!loading && data.length === 0 && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Typography sx={{ textAlign: "center" }}>No Details Found</Typography>
//         </Box>
//       )}

//       <HopeFuelIDListItem
//         data={data}
//         onClick={handleOpen}
//         onClickScreenShot={handleOpenScreenshots}
//         formStatusDialogHandler={formStatusDialogHandler}
//         setFormStatusValues={setFormStatusValues}
//       />

//       {loading && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             mt: 2,
//             height: "30vh",
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       )}

//       {!loading && total > 0 && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             my: 4,
//             mx: { md: "1rem", lg: "2rem", xl: "3rem" },
//           }}
//         >
//           <Pagination
//             count={Math.max(1, Math.ceil(total / PAGE_SIZE))}
//             page={page}
//             onChange={(_, value) => {
//               setPage(value);
//               setData([]);
//             }}
//             color="primary"
//             shape="rounded"
//           />
//         </Box>
//       )}

//       <DetailModal direction="left" open={openModal} onClose={handleClose}>
//         <Paper
//           sx={{
//             position: "fixed",
//             right: 0,
//             top: 0,
//             width: "100%",
//             pb: 4,
//             maxWidth: "600px",
//             height: "100vh",
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             overflow: "auto",
//             zIndex: 1300,
//             borderTopLeftRadius: 20,
//             borderBottomLeftRadius: 20,
//           }}
//         >
//           {loadingDetails ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100vh",
//               }}
//             >
//               <CircularProgress />
//             </Box>
//           ) : (
//             <HopeFuelIDListDetails
//               data={details}
//               formStatusDialogHandler={formStatusDialogHandler}
//               setFormStatusValues={setFormStatusValues}
//             />
//           )}
//           <Box sx={{ mt: theme.spacing(2), mx: theme.spacing(3) }}>
//             <SubscriptionCard cards={subscriptions} />
//           </Box>
//         </Paper>
//       </DetailModal>
//       <ImageCarouselModal
//         open={openScreenshotModal}
//         onClose={handleCloseScreenshots}
//         screenshots={screenshotsLists}
//         activeImage={activeImage}
//         activeImageHandler={setActiveImage}
//       />

//       {/* Form Status Dialog */}
//       <Dialog
//         open={formStatusDialog}
//         onClose={() => {
//           formStatusDialogHandler();
//         }}
//       >
//         <DialogTitle>Change Form Status Manually</DialogTitle>
//         <DialogContent>
//           <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
//             <FormControl sx={{ m: 1 }} fullWidth>
//               <InputLabel id="form-status-dialog-select-label">
//                 Form Status
//               </InputLabel>
//               <Select
//                 labelId="form-status-dialog-select-label"
//                 id="form-status-dialog-select"
//                 input={<OutlinedInput label="Form Status" />}
//                 value={formStatusValues.statusId}
//                 onChange={(e) =>
//                   setFormStatusValues((prev) => ({
//                     ...prev,
//                     statusId: e.target.value,
//                   }))
//                 }
//               >
//                 <MenuItem value={1}>Form Entry</MenuItem>
//                 <MenuItem value={2}>Payment Checked</MenuItem>
//                 <MenuItem value={3}>Card Issued</MenuItem>
//                 <MenuItem value={4}>Cancel</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               formStatusDialogHandler();
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               formStatusDialogHandler(formStatusValues);
//             }}
//             loading={formStatusLoading}
//           >
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default HopeFuelIdListPage;

"use client";

import { useSnackbar } from "@/components/shared/SnackbarProvider";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
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
  Pagination,
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
  const [total, setTotal] = useState(0);
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

  // --- Filters UI state ---
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    statusId: "", // TransactionStatusID
    currency: "", // CurrencyCode
    formFillPerson: "", // AgentID
  });
  const [currencyOptions, setCurrencyOptions] = useState([]); // ["USD","EUR",...]
  const [personOptions, setPersonOptions] = useState([]);

  const [searchKey, setSearchKey] = useState(0);

  const buildItemsUrl = useCallback(
    (pageNum = 1) => {
      const url = new URL(
        `/api/hopeFuelList/items`,
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost"
      );
      url.searchParams.set("page", String(pageNum));
      url.searchParams.set("limit", String(PAGE_SIZE));

      const q = (searchRef.current || "").trim();
      if (q) url.searchParams.set("q", q);
      if (appliedFilters.statusId)
        url.searchParams.set("statusId", appliedFilters.statusId);
      if (appliedFilters.currency)
        url.searchParams.set("currency", appliedFilters.currency);
      if (appliedFilters.formFillPerson)
        url.searchParams.set("formFillPerson", appliedFilters.formFillPerson);

      return url.pathname + "?" + url.searchParams.toString();
    },
    [appliedFilters]
  );

  // Single source of truth for fetching (uses items endpoint for get-all + search + filters)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = buildItemsUrl(page);
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch items");
        const { data: rows, total: totalCount } = await res.json();

        setData((prev) => (page === 1 ? rows : [...prev, ...rows]));
        setHasMore(rows.length === PAGE_SIZE);
        setTotal(totalCount || 0);

        const curSet = new Set(currencyOptions);
        const perSet = new Set(personOptions);

        rows.forEach((r) => {
          if (r?.CurrencyCode) curSet.add(r.CurrencyCode);
          if (r?.FormFilledPerson) perSet.add(r.FormFilledPerson);
        });

        setCurrencyOptions(Array.from(curSet).sort());
        setPersonOptions(Array.from(perSet).sort());
      } catch (e) {
        setError(e.message);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, formStatusDialog, buildItemsUrl, searchKey]);

  const resetOptionLists = () => {
    setCurrencyOptions([]);
    setPersonOptions([]);
  };

  const formStatusDialogHandler = async (values) => {
    if (values) {
      try {
        setFormStatusLoading(true);
        const response = await fetch("/api/hopeFuelList/form-status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  const fetchDetails = async (hopeId) => {
    setLoadingDetails(true);
    setDetails(null);
    try {
      const response = await fetch(`/api/hopeFuelList/details/${hopeId}`);
      if (!response.ok) throw new Error("Failed to fetch details");
      const result = await response.json();

      setDetails(result.data);
      setFormStatusValues({
        statusId: result.data.TransactionStatusID,
        formStatusId: result.data.FormStatusID,
        hopeFuelId: hopeId,
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
          `Failed to fetch subscription for HopeFuelID ${hopeId}`
        );
      }
      const result = await response.json();
      setSubscriptions(result.data);
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenScreenshots = async (screenshots) => {
    if (!Array.isArray(screenshots)) screenshots = [screenshots];
    const signedUrls = await Promise.all(
      screenshots.map(async (screenshot) => {
        if (typeof screenshot === "string") {
          return await getSignedUrl(screenshot);
        }
        return null;
      })
    );
    setScreenshotsLists(signedUrls.filter(Boolean)); // optional: drop nulls
    setOpenScreenshotModal((prev) => !prev);
  };

  const onSearchHandler = () => {
    // If already on page 1, we still need to trigger a refetch → bump searchKey
    setData([]);
    if (page !== 1) {
      setPage(1);
    } else {
      setSearchKey((k) => k + 1);
    }
  };

  const applyFilters = () => {
    setFiltersOpen(false);
    setAppliedFilters({
      statusId: selectedStatus || "",
      currency: (selectedCurrency || "").trim().toUpperCase(),
      formFillPerson: (selectedPerson || "").trim(),
    });
    setData([]);
    if (page !== 1) setPage(1);
    else setSearchKey((k) => k + 1);
  };

  const clearFilters = () => {
    setSelectedStatus("");
    setSelectedCurrency("");
    setSelectedPerson("");
    setAppliedFilters({ statusId: "", currency: "", formFillPerson: "" });
    setData([]);
    resetOptionLists();
    setFiltersOpen(false);
    if (page !== 1) setPage(1);
    else setSearchKey((k) => k + 1);
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
          gap: 1,
        }}
      >
        <TextField
          sx={{ px: 1, flex: 1 }}
          fullWidth
          variant="standard"
          placeholder="Search..."
          onChange={(e) => {
            searchRef.current = e.target.value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearchHandler();
          }}
          InputProps={{ disableUnderline: true }}
        />

        <IconButton aria-label="search" size="large" onClick={onSearchHandler}>
          <SearchIcon />
        </IconButton>

        <IconButton
          aria-label="filters"
          size="large"
          onClick={() => setFiltersOpen(true)}
        >
          <FilterListIcon />
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

      {!loading && total > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            my: 4,
            mx: { md: "1rem", lg: "2rem", xl: "3rem" },
          }}
        >
          <Pagination
            count={Math.max(1, Math.ceil(total / PAGE_SIZE))}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              setData([]);
            }}
            color="primary"
            shape="rounded"
          />
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
        onClose={() => setOpenScreenshotModal((prev) => !prev)}
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

      {/* Filters Dialog */}
      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Hope Fuel List</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="filter-status-label">Form Status</InputLabel>
              <Select
                labelId="filter-status-label"
                label="Form Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">Form Entry</MenuItem>
                <MenuItem value="2">Payment Checked</MenuItem>
                <MenuItem value="3">Card Issued</MenuItem>
                <MenuItem value="4">Cancel</MenuItem>
              </Select>
            </FormControl>

            {/* Currency SELECT */}
            <FormControl size="small" fullWidth>
              <InputLabel id="filter-currency-label">Currency</InputLabel>
              <Select
                labelId="filter-currency-label"
                label="Currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {currencyOptions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Form Fill Person SELECT */}
            <FormControl size="small" fullWidth>
              <InputLabel id="filter-person-label">Form Fill Person</InputLabel>
              <Select
                labelId="filter-person-label"
                label="Form Fill Person"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {personOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={clearFilters} color="secondary" variant="outlined">
            Clear
          </Button>
          <Button onClick={applyFilters} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HopeFuelIdListPage;
