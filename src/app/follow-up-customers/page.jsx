"use client";

import {
  Box,
  InputAdornment,
  TextField,
  Typography,
  Button,
  FormControl,
  Select,
  Modal,
  Paper,
  MenuItem,
  Skeleton,
  Tooltip,
  IconButton,
  Divider,
  Chip,
  Pagination,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StatusDropdown from "../admin-panel/_components/dashboard/_components/StatusDropdown";

import CommentModal from "./components/CommentModal";
import { useAgentStore } from "@/stores/agentStore";

export default function FollowUpCustomers() {
  const { agent } = useAgentStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedStatus, setTempSelectedStatus] = useState("");
  const [tempSelectedAgent, setTempSelectedAgent] = useState([]);

  const [agents, setAgents] = useState([]);
  const [followUpdData, setFollowUpData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const [commentData, setCommentData] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [openFilterModal, setOpenFilterModal] = useState(false);

  const currentMonth = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  const [modalOpen, setModalOpen] = useState(false);

  const availableStatus = [
    {
      label: "To Follow Up",
      value: 1,
      color: "#FACC15", // Yellow
      textColor: "#78350F",
    },
    {
      label: "Contacted",
      value: 2,
      color: "#A5B4FC", // Soft blue
      textColor: "#1E3A8A",
    },
    {
      label: "Replied",
      value: 3,
      color: "#6EE7B7", // Mint green
      textColor: "#065F46",
    },
  ];

  useEffect(() => {
    fetchAllAgents();
  }, []);

  useEffect(() => {
    fetchFollowUpData();
  }, [pagination.page, pagination.pageSize, searchQuery]);

  const fetchAllAgents = async () => {
    try {
      const response = await fetch("/api/agent/get-all");
      const data = await response.json();
      setAgents(data.data);
    } catch (error) {
      alert(error);
    }
  };

  // UPDATED: support multi-agent filter via &agentIds=1,2,3
  const fetchFollowUpData = async (statusId = null, agentIds = []) => {
    try {
      setLoading(true);

      let url = `/api/v1/follow-up?year=${year}&month=${month}`;
      if (statusId) url += `&statusId=${statusId}`;
      if (agentIds && agentIds.length > 0)
        url += `&agentIds=${agentIds.join(",")}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      url += `&page=${pagination.page}&pageSize=${pagination.pageSize}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.success) {
        const rawData = json.data || [];

        setFollowUpData(rawData);
        setPagination({
          page: json.pagination.page,
          pageSize: json.pagination.pageSize,
          total: json.pagination.total,
          totalPages: Math.ceil(
            json.pagination.total / json.pagination.pageSize
          ),
        });
      }
    } catch (err) {
      console.error("Failed to fetch follow-up data", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    const committed = searchInput.trim();

    if (committed === (searchQuery || "").trim()) {
      fetchFollowUpData();
    } else {
      setSearchQuery(committed);
    }
  };

  const handleOpenFilterModal = () => {
    setOpenFilterModal((prev) => !prev);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal((prev) => !prev);
  };

  const handleClearFilter = () => {
    setTempSelectedStatus("");
    setTempSelectedAgent([]);
    fetchFollowUpData(); // fetch without filters
    handleCloseFilterModal();
  };

  const handleApplyFilter = () => {
    const statusId = tempSelectedStatus ? Number(tempSelectedStatus) : null;
    const agentIds = (tempSelectedAgent || [])
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v) && v > 0);
    fetchFollowUpData(statusId, agentIds);
    handleCloseFilterModal();
  };

  const handleStatusChange = (event) => {
    setTempSelectedStatus(event.target.value);
  };

  // UPDATED: multiple agent selection
  const handleAgentChange = (event) => {
    const value = event.target.value;
    const normalized = (Array.isArray(value) ? value : [value])
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
    setTempSelectedAgent(normalized);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          padding: "24px",
        }}
      >
        <Typography sx={{ color: "#000000", fontSize: 34, fontWeight: 600 }}>
          Follow-Up Customers
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            name="search"
            placeholder="Search"
            sx={{ width: 642 }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                triggerSearch();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 20, height: 40 },
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
      </Box>
      <Divider sx={{ margin: "0 24px" }} />
      <Box display="flex" flexDirection="column" gap={2} px={3} pb={3} mt={2}>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: 3,
                p: 2,
                backgroundColor: "white",
                boxShadow: 1,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
                mb={2}
              >
                <Skeleton variant="text" width="20%" height={28} />
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="15%" height={20} />
                <Skeleton variant="text" width="25%" height={20} />
                <Skeleton
                  variant="rectangular"
                  width={150}
                  height={36}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={160}
                  height={36}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
              <Skeleton
                variant="text"
                width="100%"
                height={20}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          ))
        ) : followUpdData.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            No customers found.
          </Typography>
        ) : (
          followUpdData.map((customer, idx) => (
            <Box
              key={idx}
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: 3,
                p: 2,
                backgroundColor: "white",
                boxShadow: 1,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
                mb={1}
              >
                <Box flex={1}>
                  <Typography fontWeight={700}>{customer.name}</Typography>
                </Box>

                <Box flex={1}>
                  <Typography fontSize={14} color="text.secondary">
                    {customer.email}
                  </Typography>
                </Box>

                <Box minWidth={130}>
                  <Typography fontSize={14}>
                    Card ID: {customer.cardId}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" flex={1}>
                  <Typography fontSize={14}>
                    Manychat ID: {customer.manyChatId}
                  </Typography>
                  <Tooltip title="Copy">
                    <IconButton
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          customer.manyChatId || ""
                        );
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box flex={1}>
                  <StatusDropdown
                    statusId={customer.followUpStatus?.statusId || 1}
                    onChange={async (newStatusId) => {
                      await fetch("/api/v1/follow-up/update-status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          customerId: customer.customerId,
                          statusId: newStatusId,
                        }),
                      });

                      fetchFollowUpData();
                    }}
                  />
                </Box>

                <Box flex={1}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#DC2626",
                      "&:hover": { backgroundColor: "#b91c1c" },
                      borderRadius: "24px",
                      fontSize: 14,
                      textTransform: "none",
                    }}
                    onClick={() => {
                      router.push("/extendUser");
                    }}
                  >
                    Extend Subscription
                  </Button>
                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
                py={1}
                sx={{
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                {/* Left: Last Form Filling Agent */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography fontSize={14} noWrap>
                    <strong>Last Form Filling Agent:</strong>{" "}
                    {customer.lastFormAgent || "-"}
                  </Typography>
                </Box>

                {/* Middle: Comment */}
                <Box sx={{ flex: 1.5, textAlign: "center", minWidth: 200 }}>
                  {customer.comments?.length > 0 ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={0.5}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color="text.primary"
                        >
                          {customer.comments[0].agentUsername ||
                            "Unknown Agent"}
                        </Typography>
                        <Typography fontSize={12} color="text.secondary">
                          {new Date(
                            customer.comments[0].createdAt || Date.now()
                          ).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography fontSize={14} noWrap>
                        {customer.comments[0].comment}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography fontSize={14} color="text.secondary" noWrap>
                      No Comment
                    </Typography>
                  )}
                </Box>

                {/* Right: COMMENT button */}
                <Box sx={{ flexShrink: 0 }}>
                  <Button
                    onClick={async () => {
                      setSelectedCustomerId(customer.customerId);
                      setModalOpen(true);
                      await fetchCommentsForCustomer(customer.customerId);
                    }}
                    sx={{
                      borderRadius: 18,
                      bgcolor: "#E2E8F0",
                      color: "black",
                    }}
                    variant="contained"
                    size="small"
                  >
                    Comment
                  </Button>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={(event, value) => {
            setPagination((prev) => ({ ...prev, page: value }));
          }}
          color="primary"
          shape="rounded"
        />
      </Box>

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
            <Typography sx={{ mb: 1 }}>Status</Typography>
            <FormControl fullWidth>
              <Select
                value={tempSelectedStatus}
                onChange={handleStatusChange}
                displayEmpty
                renderValue={tempSelectedStatus ? undefined : () => "Select"}
                sx={{ borderRadius: 2 }}
              >
                {availableStatus.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      borderRadius: 10,
                      backgroundColor: option.color,
                      color: option.textColor,
                      fontWeight: 600,
                      justifyContent: "center",
                      m: 2,
                      "&:hover": {
                        backgroundColor: option.color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1 }}>Agent</Typography>
            <FormControl fullWidth>
              <Select
                multiple
                value={tempSelectedAgent}
                onChange={handleAgentChange}
                displayEmpty
                renderValue={(selected) => {
                  const ids = Array.isArray(selected) ? selected : [];
                  if (ids.length === 0) return "Select";
                  const names = ids
                    .map((id) => agents.find((a) => a.AgentId === id)?.Username)
                    .filter(Boolean);
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {names.map((name) => (
                        <Chip key={name} label={name} size="small" />
                      ))}
                    </Box>
                  );
                }}
                sx={{ borderRadius: 2 }}
              >
                {agents.map((agent) => (
                  <MenuItem key={agent.AgentId} value={agent.AgentId}>
                    {agent.Username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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

      <CommentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCommentData([]);
          setSelectedCustomerId(null);
        }}
        data={commentData}
        submitComment={handleSubmitComment}
        onToggleResolve={handleToggleResolveComment}
      />
    </Box>
  );

  async function handleSubmitComment(commentText) {
    try {
      const response = await fetch("/api/v1/follow-up/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentText,
          customerId: selectedCustomerId,
          agentId: agent.id,
        }),
      });

      if (response.ok) {
        fetchFollowUpData();
        await fetchCommentsForCustomer(selectedCustomerId);
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  }

  async function fetchCommentsForCustomer(customerId) {
    try {
      const response = await fetch(
        `/api/v1/follow-up/comment?customerId=${customerId}`
      );

      if (response.ok) {
        const comments = await response.json();
        const transformedComments = comments.data.map((comment) => ({
          id: comment.Id,
          text: comment.Comment,
          author: comment.Agent?.Username || "Unknown Agent",
          timestamp: new Date(comment.CreatedAt).toLocaleDateString(),
          isResolved: comment.Is_Resolved,
        }));
        setCommentData(transformedComments);
      } else {
        setCommentData([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentData([]);
    }
  }

  async function handleToggleResolveComment(commentId, currentResolvedStatus) {
    try {
      const response = await fetch("/api/v1/follow-up/comment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: commentId,
          isResolved: !currentResolvedStatus,
        }),
      });

      if (response.ok) {
        await fetchCommentsForCustomer(selectedCustomerId);
        fetchFollowUpData();
      } else {
        console.error("Failed to update comment status");
      }
    } catch (error) {
      console.error("Error updating comment status:", error);
    }
  }
}
