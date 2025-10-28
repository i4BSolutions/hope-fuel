import {
  Box,
  Modal,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Chip,
  Tooltip,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import { useState } from "react";

export default function CommentModal({
  open,
  onClose,
  data,
  submitComment = () => {},
  onToggleResolve = () => {},
}) {
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const handleSend = () => {
    if (commentText.trim()) {
      submitComment(commentText.trim());
      setCommentText("");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Separate comments into resolved and unresolved
  const unresolvedComments =
    data?.filter((comment) => !comment.isResolved) || [];
  const resolvedComments = data?.filter((comment) => comment.isResolved) || [];

  const displayComments =
    activeTab === 0 ? unresolvedComments : resolvedComments;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2,
          m: "auto",
          mt: "10%",
          boxShadow: 24,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight="bold">Comments</Typography>
            {unresolvedComments.length > 0 && (
              <Chip
                label={`${unresolvedComments.length} unresolved`}
                size="small"
                color="warning"
                sx={{ height: 20, fontSize: 10, fontWeight: 600 }}
              />
            )}
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="comment tabs"
          >
            <Tab
              label={`Open (${unresolvedComments.length})`}
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
            <Tab
              label={`Resolved (${resolvedComments.length})`}
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        {/* Comment List */}
        <Box mt={2} flex={1} overflow="auto" sx={{ maxHeight: 300, pr: 1 }}>
          {displayComments && displayComments.length > 0 ? (
            displayComments.map((comment, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="flex-start"
                mb={3}
                sx={{
                  opacity: comment.isResolved ? 0.6 : 1,
                  backgroundColor: comment.isResolved
                    ? "#F8F9FA"
                    : "transparent",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: comment.isResolved ? "#6B7280" : "#E2E8F0",
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    mr: 1,
                  }}
                >
                  {comment.author?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography fontSize={14} fontWeight="bold">
                      {comment.author || "Unknown Agent"}
                    </Typography>
                    <Typography
                      component="span"
                      fontSize={12}
                      color="text.secondary"
                    >
                      {comment.timestamp}
                    </Typography>
                    <Chip
                      label={comment.isResolved ? "Resolved" : "Open"}
                      size="small"
                      color={comment.isResolved ? "success" : "warning"}
                      sx={{
                        height: 20,
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography
                    fontSize={14}
                    sx={{
                      textDecoration: comment.isResolved
                        ? "line-through"
                        : "none",
                      mb: 1,
                    }}
                  >
                    {comment.text}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Tooltip
                      title={
                        comment.isResolved
                          ? "Mark as unresolved"
                          : "Mark as resolved"
                      }
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                          comment.isResolved ? <UndoIcon /> : <CheckIcon />
                        }
                        onClick={() =>
                          onToggleResolve(comment.id, comment.isResolved)
                        }
                        sx={{
                          fontSize: 10,
                          height: 24,
                          minWidth: "auto",
                          px: 1,
                          borderColor: comment.isResolved
                            ? "#6B7280"
                            : "#10B981",
                          color: comment.isResolved ? "#6B7280" : "#10B981",
                          "&:hover": {
                            borderColor: comment.isResolved
                              ? "#4B5563"
                              : "#059669",
                            backgroundColor: comment.isResolved
                              ? "#F3F4F6"
                              : "#ECFDF5",
                          },
                        }}
                      >
                        {comment.isResolved ? "Unresolve" : "Resolve"}
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={100}
            >
              <Typography color="text.secondary" textAlign="center">
                {activeTab === 0
                  ? "No open comments."
                  : "No resolved comments."}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Input Bar */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: "#F1F5F9",
            borderRadius: 8,
            px: 2,
            py: 1,
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Add a comment..."
            InputProps={{
              disableUnderline: true,
            }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <IconButton
            sx={{ ml: 1 }}
            onClick={handleSend}
            disabled={!commentText.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
}
