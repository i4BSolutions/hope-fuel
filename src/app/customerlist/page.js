"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    cardId: "",
  });

  // Mobile view controls
  const [showSidebar, setShowSidebar] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [editHistoryLoading, setEditHistoryLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openEditHistoryModal, setOpenEditHistoryModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [error, setError] = useState(null);

  const [debouncedSearch] = useDebounce(searchText, 300);
  const initialLoadRef = useRef(false);

  const filteredCustomers = customerData;

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchCustomerData(1, true);
      fetchBaseCountry();
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowSidebar(!selectedProfileId);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile, selectedProfileId]);

  const fetchCustomerData = useCallback(
    async (pageNumber, isNewSearch = false, term = "") => {
      if (loading) return;

      setLoading(true);
      setIsSearching(false);
      setError(null);

      try {
        const url = `/api/customers?page=${pageNumber}&limit=${PAGE_SIZE}${
          term ? `&term=${encodeURIComponent(term)}` : ""
        }`;

        const response = await fetch(url);
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

        setHasMore(!term && newCustomers.length >= PAGE_SIZE);

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

  const fetchProfileDetails = useCallback(
    async (id) => {
      if (!id) return;
      setProfileLoading(true);
      try {
        const res = await fetch(`/api/customers/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch profile`);
        const { customer } = await res.json();
        const subscriptions = customer?.HopeFuelID
          ? await fetchSubscriptionByHopeFuelID(customer.HopeFuelID)
          : [];
        const cardIssued = customer?.CustomerId
          ? await fetchCardIssuedByID(customer?.CustomerId)
          : [];
        setProfileDetailData({ ...customer, subscriptions, cardIssued });

        if (isMobile) {
          setShowSidebar(false);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setProfileLoading(false);
      }
    },
    [isMobile]
  );

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
    if (!loading && hasMore && !isSearching)
      fetchCustomerData(page + 1, false, searchText);
  }, [loading, hasMore, page, fetchCustomerData, isSearching, searchText]);

  const handleProfileSelect = (id) => {
    setSelectedProfileId(id);
    setHoveredProfileId(id);
    fetchProfileDetails(id);

    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
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
              { field: "CardID", newValue: data.cardId },
            ],
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update customer");
        }

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

  const handleSearchChange = (value, submit = false) => {
    setSearchText(value);

    if (!value.trim()) {
      fetchCustomerData(1, true);
      return;
    }

    if (submit) {
      fetchCustomerData(1, true, value);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
    }
  };

  // Profile detail content
  const renderProfileDetails = () => (
    <>
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
          <Typography variant="h5">
            {debouncedSearch
              ? "No matching customers found"
              : "No customers found"}
          </Typography>
        </Box>
      ) : profileDetailData ? (
        <>
          {isMobile && (
            <IconButton onClick={() => setShowSidebar(true)} sx={{ mb: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <UserInfoCard
            userRole={agent.roleId}
            data={profileDetailData}
            isMobile={isMobile}
            onEdit={() => {
              setCustomerInfo({
                name: profileDetailData.Name || "",
                email: profileDetailData.Email || "",
                country: profileDetailData.UserCountry || "",
                cardId: profileDetailData.CardID || "",
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
            <SubscriptionCard cards={profileDetailData.subscriptions || []} />
          </Grid>
          <Grid container spacing={2} sx={{ px: 1, pt: theme.spacing(3) }}>
            {profileDetailData?.cardIssued?.map((card) => (
              <Grid item key={card.id || card.HopeFuelID}>
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
    </>
  );

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            p: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {!showSidebar && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Customer Management
          </Typography>
        </Box>
      )}

      {isMobile ? (
        <>
          {/* Mobile: Show either sidebar or profile details */}
          {showSidebar ? (
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <Sidebar
                profiles={filteredCustomers}
                selectedProfileId={selectedProfileId}
                hoveredProfileId={hoveredProfileId}
                onSelectedProfile={handleProfileSelect}
                onHoverProfile={setHoveredProfileId}
                onLoadMore={handleLoadMore}
                searchValue={searchText}
                onSearch={handleSearchChange}
                loading={loading}
                hasMore={hasMore && !isSearching}
              />
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {renderProfileDetails()}
            </Box>
          )}

          {/* Mobile drawer for sidebar when viewing profile */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 280 }}>
              <Sidebar
                profiles={filteredCustomers}
                selectedProfileId={selectedProfileId}
                hoveredProfileId={hoveredProfileId}
                onSelectedProfile={handleProfileSelect}
                onHoverProfile={setHoveredProfileId}
                onLoadMore={handleLoadMore}
                searchValue={searchText}
                onSearch={handleSearchChange}
                loading={loading}
                hasMore={hasMore && !isSearching}
              />
            </Box>
          </Drawer>
        </>
      ) : (
        /* Desktop: Grid layout with both sidebar and profile details */
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={12} md={3} sx={{ height: "100%", overflow: "auto" }}>
            <Sidebar
              profiles={filteredCustomers}
              selectedProfileId={selectedProfileId}
              hoveredProfileId={hoveredProfileId}
              onSelectedProfile={handleProfileSelect}
              onHoverProfile={setHoveredProfileId}
              onLoadMore={handleLoadMore}
              searchValue={searchText}
              onSearch={handleSearchChange}
              loading={loading}
              hasMore={hasMore && !isSearching}
            />
          </Grid>
          <Grid item xs={12} md={9} sx={{ height: "100%", overflow: "auto" }}>
            {renderProfileDetails()}
          </Grid>
        </Grid>
      )}

      {/* Edit History Modal */}
      <Modal open={openDetailModal} onClose={() => setOpenDetailModal(false)}>
        <Box
          sx={{
            maxHeight: "80vh",
            overflowY: "auto",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "800px",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 1,
          }}
        >
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
