import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Button,
  Stack,
  IconButton,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import CustomDropzone from "@/app/components/Dropzone";
import filehandler from "@/app/utilites/createForm/fileHandler";
import { remove } from "aws-amplify/storage";
import getSignedUrl from "@/app/utilites/getSignedUrl";

import CreateCategoryModal from "./CreateCategoryModal";
import { useEffect, useState } from "react";

export default function EditFAQModal({
  open = false,
  onClose = () => {},
  onSubmit = async () => {},
  faq,
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // form state
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    faq?.Category?.Id ?? ""
  );
  const [question, setQuestion] = useState(faq?.Question ?? "");
  const [explanation, setExplanation] = useState(faq?.Explanation ?? "");
  const [response, setResponse] = useState(faq?.Response ?? "");
  const [submitting, setSubmitting] = useState(false);

  // upload state (explanation)
  const [expUploadedFiles, setExpUploadedFiles] = useState([]);
  const [expFiles, setExpFiles] = useState([]);
  const [expProgress, setExpProgress] = useState("");

  // upload state (response)
  const [resUploadedFiles, setResUploadedFiles] = useState([]);
  const [resFiles, setResFiles] = useState([]);
  const [resProgress, setResProgress] = useState("");

  // Load categories
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch(`/api/v1/faq-categories`);
        const json = await res.json();
        setCategories(json.data || []);
      } catch {
        console.error("Error");
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open || !faq) return;
    setSelectedCategoryId(faq?.Category?.Id ?? "");
    setQuestion(faq?.Question ?? "");
    setExplanation(faq?.Explanation ?? "");
    setResponse(faq?.Response ?? "");
  }, [open, faq]);

  useEffect(() => {
    if (!open || !faq) return;

    const loadExisting = async () => {
      const exp = Array.isArray(faq.explanationImages)
        ? faq.explanationImages
        : [];
      const res = Array.isArray(faq.responseImages) ? faq.responseImages : [];

      const toThumb = async (keyOrUrl) => {
        const isKey =
          typeof keyOrUrl === "string" && !keyOrUrl.startsWith("http");
        const url = isKey ? await getSignedUrl(keyOrUrl) : keyOrUrl;
        const key = isKey ? keyOrUrl : keyOrUrl;
        const name = keyOrUrl.split("/").pop() || "image";
        return { key, url, name };
      };

      const expThumbs = await Promise.all(exp.map(toThumb));
      const resThumbs = await Promise.all(res.map(toThumb));

      setExpFiles(expThumbs);
      setResFiles(resThumbs);
      setExpUploadedFiles([]);
      setResUploadedFiles([]);
    };

    loadExisting();
  }, [open, faq]);

  const handleCreateCategory = async (name) => {
    await createCategory(name);
    await fetchCategories();
    setCreateOpen(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/v1/faq-categories`);
      const json = await res.json();
      setCategories(json.data);
    } catch (error) {
      alert("Failed to fetch categories", error);
    }
  };

  const createCategory = async (name) => {
    try {
      await fetch(`/api/v1/faq-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    } catch (error) {
      alert("Failed to create new category", error);
    }
  };

  // Upload handlers (Explanation)
  const onDropExplanation = async (acceptedFiles) => {
    setExpUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    await filehandler(
      acceptedFiles,

      (newState) => {
        const merged = Array.isArray(newState) ? newState : [];
        setExpFiles((prev) => {
          const prevKeys = new Set(prev.map((p) => p.key));
          const additions = merged.filter((m) => !prevKeys.has(m.key));
          const flagged = additions.map((a) => ({ ...a, isNew: true }));
          return [...prev, ...flagged];
        });
      },
      expFiles,
      setExpProgress
    );
  };

  // Upload handlers (Response)
  const onDropResponse = async (acceptedFiles) => {
    setResUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    await filehandler(
      acceptedFiles,
      (newState) => {
        const merged = Array.isArray(newState) ? newState : [];
        setResFiles((prev) => {
          const prevKeys = new Set(prev.map((p) => p.key));
          const additions = merged.filter((m) => !prevKeys.has(m.key));
          const flagged = additions.map((a) => ({ ...a, isNew: true }));
          return [...prev, ...flagged];
        });
      },
      resFiles,
      setResProgress
    );
  };

  const removeExplanationFile = async (nameOrFile) => {
    const name = typeof nameOrFile === "string" ? nameOrFile : nameOrFile?.name;
    const file = expFiles.find((f) => f.name === name);
    if (!file) return;

    if (file.isNew && file.key) {
      try {
        await remove({ key: file.key });
      } catch {}
    }
    setExpFiles((prev) => prev.filter((f) => f.name !== name));
    setExpUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const removeResponseFile = async (nameOrFile) => {
    const name = typeof nameOrFile === "string" ? nameOrFile : nameOrFile?.name;
    const file = resFiles.find((f) => f.name === name);
    if (!file) return;

    if (file.isNew && file.key) {
      try {
        await remove({ key: file.key });
      } catch {}
    }
    setResFiles((prev) => prev.filter((f) => f.name !== name));
    setResUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleSubmit = async () => {
    if (!faq?.Id) return;

    if (
      !selectedCategoryId ||
      !question.trim() ||
      !explanation.trim() ||
      !response.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const images = [
        ...expFiles.map((f) => ({ url: f.key, type: "explanation" })),
        ...resFiles.map((f) => ({ url: f.key, type: "response" })),
      ];

      await onSubmit({
        id: faq.Id,
        payload: {
          categoryId: Number(selectedCategoryId),
          question: question.trim(),
          explanation: explanation.trim(),
          response: response.trim(),
          images,
        },
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const Thumbs = ({ files, onRemove }) => (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {files.map((f) => (
        <Paper
          key={f.key}
          elevation={0}
          sx={{
            position: "relative",
            width: 120,
            height: 90,
            borderRadius: 1.5,
            overflow: "hidden",
            border: (t) => `1px solid ${t.palette.divider}`,
            backgroundImage: `url(${f.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={() => onRemove(f.name)}
            sx={{
              position: "absolute",
              right: 4,
              top: 4,
              bgcolor: "rgba(255,255,255,0.9)",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      ))}
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: "10px" } }}
    >
      <DialogTitle
        sx={{ pr: 6, display: "flex", alignItems: "center", gap: 1 }}
      >
        <AddIcon
          sx={{ color: "#FFF", background: "#DC2626", borderRadius: "100%" }}
        />
        <Typography sx={{ fontWeight: 500, fontSize: 20 }}>Edit FAQ</Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {/* Category */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle2" color="text.secondary">
                * Category
              </Typography>
              <Link
                href="#"
                underline="hover"
                fontSize={14}
                sx={{ mr: 0.5, color: "#3460DC" }}
                onClick={(e) => {
                  e.preventDefault();
                  setCreateOpen(true);
                }}
              >
                Create New
              </Link>
            </Stack>
            <FormControl fullWidth size="medium">
              <InputLabel id="faq-category-label">Select category</InputLabel>
              <Select
                labelId="faq-category-label"
                label="Select category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              >
                {categories.length ? (
                  categories.map((category) => (
                    <MenuItem key={category.Id} value={category.Id}>
                      {category.Name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    There's no categories yet. Please create one.
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Question */}
          <Box>
            <Typography sx={{ fontSize: "14px" }}>
              <span style={{ color: "red" }}>*</span> <span>Question</span>
            </Typography>
            <TextField
              name="question"
              multiline
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              fullWidth
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
          </Box>

          {/* Explanation */}
          <Box>
            <Typography sx={{ fontSize: "14px" }}>
              <span style={{ color: "red" }}>*</span>{" "}
              <span>Explanation (To Agent)</span>
            </Typography>
            <TextField
              name="agent_explanation"
              multiline
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              fullWidth
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            <Box mt={1.5}>
              <CustomDropzone
                handleDrop={onDropExplanation}
                uploadProgress={expProgress}
                files={expUploadedFiles}
                onDelete={(file) => removeExplanationFile(file.name ?? file)}
              />
            </Box>

            {expFiles.length ? (
              <Box mt={1}>
                <Thumbs files={expFiles} onRemove={removeExplanationFile} />
              </Box>
            ) : null}
          </Box>

          {/* Response */}
          <Box>
            <Typography sx={{ fontSize: "14px" }}>
              <span style={{ color: "red" }}>*</span>{" "}
              <span>Response (To Customer)</span>
            </Typography>
            <TextField
              name="customer_response"
              multiline
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              fullWidth
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            <Box mt={1.5}>
              <CustomDropzone
                handleDrop={onDropResponse}
                uploadProgress={resProgress}
                files={resUploadedFiles}
                onDelete={(file) => removeResponseFile(file.name ?? file)}
              />
            </Box>

            {resFiles.length ? (
              <Box mt={1}>
                <Thumbs files={resFiles} onRemove={removeResponseFile} />
              </Box>
            ) : null}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleSubmit}
          color="error"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>

      <CreateCategoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateCategory}
      />
    </Dialog>
  );
}
