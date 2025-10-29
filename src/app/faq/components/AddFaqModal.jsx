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
import CreateCategoryModal from "./CreateCategoryModal";
import CustomDropzone from "@/app/components/Dropzone";
import filehandler from "@/app/utilites/createForm/fileHandler";
import { remove } from "aws-amplify/storage";

import { useEffect, useState } from "react";

export default function AddNewFAQModal({
  open = true,
  onClose = () => {},
  onSubmit = () => {},
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // form state
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // upload state (explanation)
  const [expUploadedFiles, setExpUploadedFiles] = useState([]);
  const [expFiles, setExpFiles] = useState([]);
  const [expProgress, setExpProgress] = useState("");

  // upload state (response)
  const [resUploadedFiles, setResUploadedFiles] = useState([]);
  const [resFiles, setResFiles] = useState([]);
  const [resProgress, setResProgress] = useState("");

  const resetForm = () => {
    setCreateOpen(false);
    setSelectedCategoryId("");
    setQuestion("");
    setExplanation("");
    setResponse("");
    setSubmitting(false);

    setExpUploadedFiles([]);
    setExpFiles([]);
    setExpProgress("");

    setResUploadedFiles([]);
    setResFiles([]);
    setResProgress("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateCategory = async (name) => {
    await createCategory(name);
    await fetchCategories();
    setCreateOpen(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      let url = `/api/v1/faq-categories`;

      const res = await fetch(url);
      const json = await res.json();

      setCategories(json.data);
    } catch (error) {
      alert("Failed to fetch categories", error);
    }
  };

  const createCategory = async (name) => {
    try {
      let url = `/api/v1/faq-categories`;

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    } catch (error) {
      alert("Failed to create new category", error);
    }
  };

  // Image Upload
  const onDropExplanation = async (acceptedFiles) => {
    setExpUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    const uploaded = await filehandler(
      acceptedFiles,
      setExpFiles,
      expFiles,
      setExpProgress
    );

    if (uploaded?.length) setExpFiles((prev) => [...prev]);
  };

  const onDropResponse = async (acceptedFiles) => {
    setResUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    const uploaded = await filehandler(
      acceptedFiles,
      setResFiles,
      resFiles,
      setResProgress
    );
    if (uploaded?.length) setResFiles((prev) => [...prev]);
  };

  const removeExplanationFile = async (name) => {
    const file = expFiles.find((f) => f.name === name);
    if (!file) return;
    await remove({ key: file.key });
    setExpFiles((prev) => prev.filter((f) => f.name !== name));
    setExpUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const removeResponseFile = async (name) => {
    const file = resFiles.find((f) => f.name === name);
    if (!file) return;
    await remove({ key: file.key });
    setResFiles((prev) => prev.filter((f) => f.name !== name));
    setResUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleSubmit = async () => {
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

      onSubmit({
        categoryId: Number(selectedCategoryId),
        question: question.trim(),
        explanation: explanation.trim(),
        response: response.trim(),
        images,
      });

      resetForm();
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
      onClose={handleClose}
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
        <Typography sx={{ fontWeight: 500, fontSize: 20 }}>
          Add New FAQ
        </Typography>
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

          {/* Explanation (To Agent) */}
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

          {/* Response (To Customer) */}
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
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleSubmit}
          color="error"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add FAQ"}
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
