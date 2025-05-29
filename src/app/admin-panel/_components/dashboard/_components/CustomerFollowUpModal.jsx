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
  Skeleton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StatusDropdown from "./StatusDropdown";
import StatusFilter from "./StatusFilter";
import { useRouter } from "next/navigation";

export default function FollowUpModal({
  open,
  onClose,
  customers,
  loading = false,
  onStatusChange,
  onFilterApply,
  onFilterClear,
  onSearch,
}) {
  const router = useRouter();

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
            onChange={(e) => onSearch(e.target.value)}
          />
          <StatusFilter onApply={onFilterApply} onClear={onFilterClear} />
        </Box>

        <Box display="flex" flexDirection="column" gap={2} px={3} pb={3}>
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
          ) : customers.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 4 }}
            >
              No customers found.
            </Typography>
          ) : (
            customers.map((customer, idx) => (
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
                        onStatusChange();
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
            ))
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
