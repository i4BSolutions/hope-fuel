"use client";

import { useEffect, useState, startTransition } from "react";
import { useAgentStore } from "@/stores/agentStore";
import {
  Box,
  Button,
  Chip,
  Divider,
  Typography,
  CircularProgress,
  Stack,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddNewFAQModal from "./components/AddFaqModal";
import EditFAQModal from "./components/EditFaqModal";
import FaqItem from "./components/FaqItem";

export default function FAQ() {
  const { agent } = useAgentStore();

  const [open, setOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState();
  const [openEdit, setOpenEdit] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  useEffect(() => {
    safeRefreshCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`/api/v1/faq-categories`);
    const json = await res.json();
    if (!res.ok) throw json;
    setCategories(json.data || []);
  };

  const safeRefreshCategories = async () => {
    setRefreshing(true);
    try {
      await fetchCategories();
    } catch (e) {
      console.error(e);
      setToast({
        open: true,
        msg: e?.message || "Failed to fetch categories",
        severity: "error",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedCategoryId) {
      fetchFaqsByCategory(selectedCategoryId);
    } else {
      setFaqs([]);
    }
  }, [selectedCategoryId]);

  const fetchFaqsByCategory = async (categoryId) => {
    setLoadingFaqs(true);
    try {
      const res = await fetch(`/api/v1/faqs?categoryId=${categoryId}`);
      const json = await res.json();
      if (!res.ok) {
        console.error(json);
        setToast({
          open: true,
          msg: json.message || "Failed to fetch FAQs",
          severity: "error",
        });
        setFaqs([]);
        return;
      }
      setFaqs(json.data?.faqs || []);
    } catch (e) {
      setToast({ open: true, msg: "Failed to fetch FAQs", severity: "error" });
      setFaqs([]);
    } finally {
      setLoadingFaqs(false);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchCategories(),
        selectedCategoryId
          ? fetchFaqsByCategory(selectedCategoryId)
          : Promise.resolve(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 150);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleSubmit(payload) {
    try {
      const res = await fetch("/api/v1/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error(json);
        setToast({
          open: true,
          msg: json.message || "Failed to create FAQ",
          severity: "error",
        });
        return;
      }

      handleClose();

      startTransition(() => {
        refreshAll();
      });

      setToast({ open: true, msg: "FAQ created", severity: "success" });
      return json.data;
    } catch {
      setToast({ open: true, msg: "Failed to create FAQ", severity: "error" });
    }
  }

  return (
    <Box>
      {refreshing && <LinearProgress />}

      {/* Header */}
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
          FAQ Management
        </Typography>
        {agent.roleId === 2 && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              onClick={handleOpen}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 20,
                height: 40,
                textTransform: "none",
                borderColor: "#DC2626",
                color: "#DC2626",
                "&:hover": {
                  borderColor: "#CBD5E1",
                  backgroundColor: "#F1F5F9",
                },
              }}
            >
              New FAQ
            </Button>
          </Box>
        )}
      </Box>

      <Divider sx={{ margin: "0 24px" }} />

      {/* Category chips */}
      <Box sx={{ margin: "0 24px" }}>
        {categories?.length
          ? categories.map((category) => (
              <Chip
                key={category.Id}
                label={
                  (category.Name ?? "Unnamed") +
                  (category.faqCount != null ? ` (${category.faqCount})` : "")
                }
                variant={
                  selectedCategoryId === category.Id ? "filled" : "outlined"
                }
                color={
                  selectedCategoryId === category.Id ? "primary" : "default"
                }
                size="medium"
                clickable
                onClick={() =>
                  setSelectedCategoryId(
                    selectedCategoryId === category.Id ? null : category.Id
                  )
                }
                sx={{
                  borderRadius: "22px",
                  mr: "4px",
                  mt: "12px",
                  fontWeight: 600,
                  fontSize: 14,
                  px: "12px",
                  py: "6px",
                  transition: "filter 180ms ease",
                  ...(refreshing && { filter: "grayscale(0.3)" }),
                }}
              />
            ))
          : null}
      </Box>

      {/* FAQs */}
      <Box sx={{ margin: "16px 24px 24px" }}>
        {loadingFaqs ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Loading FAQs…</Typography>
          </Box>
        ) : selectedCategoryId && faqs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No FAQs found in this category.
          </Typography>
        ) : faqs.length ? (
          <Stack
            spacing={2}
            sx={{ opacity: refreshing ? 0.7 : 1, transition: "opacity 180ms" }}
          >
            {faqs.map((f) => (
              <FaqItem
                key={f.Id}
                id={f.Id}
                question={f.Question}
                explanation={f.Explanation}
                response={f.Response}
                explanationImages={f.explanationImages}
                responseImages={f.responseImages}
                onEdit={(id) => {
                  const data = faqs.find((x) => x.Id === id) || null;
                  setSelectedFaq(data);
                  setOpenEdit(true);
                }}
                onDelete={async ({ id }) => {
                  try {
                    const res = await fetch(`/api/v1/faqs/${id}`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                    });
                    if (!res.ok) {
                      const json = await res.json().catch(() => ({}));
                      throw new Error(json.message || "Failed to delete FAQ");
                    }

                    startTransition(() => {
                      refreshAll();
                    });
                    setToast({
                      open: true,
                      msg: "FAQ deleted",
                      severity: "success",
                    });
                  } catch (e) {
                    setToast({
                      open: true,
                      msg: e?.message || "Failed to delete FAQ",
                      severity: "error",
                    });
                  }
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Select a category to view its FAQs.
          </Typography>
        )}
      </Box>

      {/* Create Modal */}
      <AddNewFAQModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      {/* Edit Modal */}
      <EditFAQModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        faq={selectedFaq}
        onSubmit={async ({ id, payload }) => {
          try {
            const res = await fetch(`/api/v1/faqs/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) {
              throw new Error(json.message || "Failed to update FAQ");
            }

            setOpenEdit(false);

            startTransition(() => {
              refreshAll();
            });

            setToast({ open: true, msg: "FAQ updated", severity: "success" });
          } catch (e) {
            setToast({
              open: true,
              msg: e?.message || "Failed to update FAQ",
              severity: "error",
            });
          }
        }}
      />

      {/* Toasts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
