"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Modal,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useAgentStore } from "../../stores/agentStore";
import SubscriptionCard from "../UI/Components/SubscriptionCard";
import CardDisplay from "./components/CardDisplay";
import CardInfo from "./components/CardInfo";
import CustomerInfoEdit from "./components/CustomerInfoEdit";
import EditHistory from "./components/EditHistory";
import Sidebar from "./components/Sidebar";
import UserInfoCard from "./components/UserInfoCard";

const mockCards = [
  {
    id: "HOPEID-12345",
    name: "Geek Squad Studio",
    status: "၁ - ဖောင်တင်သွင်း",
  },
  {
    id: "HOPEID-67890",
    name: "Geek Squad Studio",
    status: "၁ - ဖောင်တင်သွင်း",
  },
  {
    id: "HOPEID-24680",
    name: "Geek Squad Studio",
    status: "၁ - ဖောင်တင်သွင်း",
  },
];

const PAGE_SIZE = 10;

const CustomerListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { agent } = useAgentStore();
  const [searchText, setSearchText] = useState("");
  const [selectedEditId, setSelectedEditId] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [hoveredProfileId, setHoveredProfileId] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [profileDetailData, setProfileDetailData] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const [countries, setCountries] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [editHistoryLoading, setEditHistoryLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openEditHistoryModal, setOpenEditHistoryModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [error, setError] = useState(null);

  const [debouncedSearch] = useDebounce(searchText, 100);
  const initialLoadRef = useRef(false);

  const filteredCustomers = customerData.filter((customer) => {
    const s = debouncedSearch.toLowerCase();
    return (
      customer.Name?.toLowerCase().includes(s) ||
      customer.Email?.toLowerCase().includes(s) ||
      customer.ManyChatId?.toLowerCase().includes(s)
    );
  });

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchCustomerData(1, true);
      fetchBaseCountry();
    }
  }, []);

  const fetchCustomerData = useCallback(
    async (pageNumber, isNewSearch = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/customers?page=${pageNumber}&limit=${PAGE_SIZE}`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch customers (${response.status})`);

        const result = await response.json();
        const newCustomers = result.data || [];

        if (isNewSearch) {
          setCustomerData(newCustomers);
          setPage(pageNumber);
        } else {
          setCustomerData((prev) => [...prev, ...newCustomers]);
          setPage((prev) => prev + 1);
        }

        setHasMore(newCustomers.length >= PAGE_SIZE);

        if (newCustomers.length > 0 && isNewSearch) {
          const firstId = newCustomers[0].CustomerId;
          setSelectedProfileId(firstId);
          setHoveredProfileId(firstId);
          fetchProfileDetails(firstId);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setHasMore(false);
        if (isNewSearch) {
          setCustomerData([]);
          setSelectedProfileId(null);
          setProfileDetailData(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const fetchBaseCountry = useCallback(async () => {
    try {
      const res = await fetch("/api/countries");
      if (!res.ok) throw new Error(`Failed to fetch countries`);
      const data = await res.json();
      setCountries(data.Countries || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchSubscriptionByHopeFuelID = async (hopeFuelId) => {
    try {
      const res = await fetch(
        `/api/hopeFuelList/details/${hopeFuelId}/subscription`
      );
      if (!res.ok)
        throw new Error(
          `Failed to fetch subscription for HopeFuelID ${hopeFuelId}`
        );
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchCardIssuedByID = async (hopeFuelId) => {
    try {
      const res = await fetch(`/api/v1/card-issued/${hopeFuelId}`);

      if (!res.ok)
        throw new Error(`Failed to fetch card issued HopeFuelID ${hopeFuelId}`);
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchProfileDetails = useCallback(async (id) => {
    if (!id) return;
    setProfileLoading(true);
    try {
      const res = await fetch(`/api/customers/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch profile`);
      const { customer } = await res.json();
      const subscriptions = customer?.HopeFuelID
        ? await fetchSubscriptionByHopeFuelID(customer.HopeFuelID)
        : [];
      const cardIssued = customer?.HopeFuelID
        ? await fetchCardIssuedByID(customer?.HopeFuelID)
        : [];
      setProfileDetailData({ ...customer, subscriptions, cardIssued });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchEditHistory = useCallback(async (id) => {
    setEditHistoryLoading(true);
    try {
      const res = await fetch(`/api/customers/${id}/edit/history`);
      if (!res.ok) throw new Error("Failed to fetch edit history");
      const data = await res.json();
      setEditHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEditHistoryLoading(false);
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) fetchCustomerData(page, false);
  }, [loading, hasMore, page, fetchCustomerData]);

  const handleProfileSelect = (id) => {
    setSelectedProfileId(id);
    setHoveredProfileId(id);
    fetchProfileDetails(id);
  };

  const handleSave = useCallback(
    async (data) => {
      try {
        const res = await fetch(`/api/customers/${selectedEditId}/edit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: agent.id,
            updates: [
              { field: "Name", newValue: data.name },
              { field: "Email", newValue: data.email },
              { field: "UserCountry", newValue: data.country },
            ],
          }),
        });

        if (!res.ok) throw new Error("Failed to update customer");

        const resData = await res.json();
        setSnackbarMessage(resData.message);
        setSnackbarSeverity("success");
        fetchProfileDetails(selectedProfileId);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
        setOpenEditHistoryModal(false);
      }
    },
    [selectedEditId, agent.id, fetchProfileDetails, selectedProfileId]
  );
  console.log(profileDetailData?.cardIssued);
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Sidebar
            profiles={filteredCustomers}
            selectedProfileId={selectedProfileId}
            hoveredProfileId={hoveredProfileId}
            onSelectedProfile={handleProfileSelect}
            onHoverProfile={setHoveredProfileId}
            onLoadMore={handleLoadMore}
            searchValue={searchText}
            onSearch={(e) => setSearchText(e.target.value)}
            loading={loading}
            hasMore={hasMore}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          {profileLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "60vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : filteredCustomers.length === 0 && !loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Typography variant="h5">No customers found</Typography>
            </Box>
          ) : profileDetailData ? (
            <>
              <UserInfoCard
                userRole={agent.roleId}
                data={profileDetailData}
                isMobile={isMobile}
                onEdit={() => {
                  setCustomerInfo({
                    name: profileDetailData.Name || "",
                    email: profileDetailData.Email || "",
                    country: profileDetailData.UserCountry || "",
                  });
                  setSelectedEditId(profileDetailData.CustomerId);
                  setOpenEditHistoryModal(true);
                }}
                onViewEditHistory={(id) => {
                  fetchEditHistory(id);
                  setOpenDetailModal(true);
                }}
              />
              <Box sx={{ mt: theme.spacing(2), mx: theme.spacing(3) }}>
                <CardInfo data={profileDetailData} />
              </Box>
              <Grid container spacing={2} sx={{ pt: theme.spacing(5) }}>
                <SubscriptionCard
                  cards={profileDetailData.subscriptions || []}
                />
              </Grid>
              <Grid container spacing={2} sx={{ px: 1, pt: theme.spacing(3) }}>
                {profileDetailData?.cardIssued.map((card) => (
                  <Grid item key={card.id}>
                    <CardDisplay
                      hopeFuelID={card.HopeFuelID}
                      transactionStatus={card.TransactionStatus}
                      currency={card.CurrencyCode}
                      amount={card.Amount}
                      date={card.TransactionDate}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Typography variant="h5">
                {error || "No customer data available"}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Edit History Modal */}
      <Modal open={openDetailModal} onClose={() => setOpenDetailModal(false)}>
        <Box sx={{ p: 4, maxHeight: "80vh", overflowY: "auto" }}>
          {editHistoryLoading ? (
            <CircularProgress />
          ) : editHistory ? (
            <EditHistory historyData={editHistory.data} />
          ) : (
            <Typography>No Edit History Found</Typography>
          )}
        </Box>
      </Modal>

      {/* Edit Info Modal */}
      <Modal
        open={openEditHistoryModal}
        onClose={() => setOpenEditHistoryModal(false)}
      >
        <CustomerInfoEdit
          customerInfo={customerInfo}
          countries={countries}
          setCustomerInfo={setCustomerInfo}
          onSave={handleSave}
          onCancel={() => setOpenEditHistoryModal(false)}
        />
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerListPage;
