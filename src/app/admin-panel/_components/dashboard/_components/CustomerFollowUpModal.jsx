import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StatusDropdown from "./StatusDropdown";
import StatusFilter from "./StatusFilter";

export default function FollowUpModal({ open, onClose, customers }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography fontSize={20} fontWeight={700}>
          Follow-Up Customers
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb={3}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "background.paper",
            px: 3,
            pt: 2,
            borderBottom: "1px solid #E2E8F0",
            mb: 2,
            pb: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "24px",
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
              },
            }}
          />
          <StatusFilter
            onApply={(statusId) => {
              console.log("Filter applied with status:", statusId);
              // Update filter state or fetch from API
            }}
            onClear={() => {
              console.log("Filter cleared");
              // Reset filter logic
            }}
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={2} px={3} pb={3}>
          {customers.map((customer, idx) => (
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

                <Box flex={1}>
                  <Typography fontSize={14}>
                    Manychat ID: {customer.manyChatId}
                    <IconButton size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Typography>
                </Box>

                <Box flex={1}>
                  <StatusDropdown
                    statusId={2}
                    onChange={(newStatusId) => {
                      console.log("Selected Status:", newStatusId);
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
                  >
                    Extend Subscription
                  </Button>
                </Box>
              </Box>

              <Box sx={{ borderBottom: "1px solid #E2E8F0", mb: 2, mt: 2 }} />

              <Box
                display="flex"
                gap={2}
                flexWrap="wrap"
                mt={1}
                justifyContent="space-between"
                maxWidth="md"
              >
                <Typography fontSize={14} sx={{ textAlign: "left", flex: 1 }}>
                  <strong>Last Form Filling Agent:</strong>{" "}
                  {customer.lastFormAgent || "-"}
                </Typography>
                <Box sx={{ borderRight: "1px solid #E2E8F0" }} />
                <Typography fontSize={14} sx={{ textAlign: "left", flex: 1 }}>
                  <strong>Agent's Note:</strong> {customer.note || "-"}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
