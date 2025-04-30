import React from "react";
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  Divider,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Sidebar = ({
  profiles,
  selectedProfileId = null,
  hoveredProfileId = null,
  onHoverProfile,
  onSelectedProfile,
  onLoadMore,
  searchValue = "",
  onSearch,
  loading = false,
  hasMore = false,
}) => {
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Box sx={{ backgroundColor: "#F1F5F9" }}>
        <TextField
          size="small"
          placeholder="Search..."
          fullWidth
          variant="outlined"
          value={searchValue}
          onChange={onSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={16} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {profiles.length === 0 && !loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No customers found
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {profiles.map((profile, index) => (
              <React.Fragment key={profile.CustomerId}>
                <ListItem
                  button
                  selected={selectedProfileId === profile.CustomerId}
                  onClick={() => onSelectedProfile(profile.CustomerId)}
                  onMouseEnter={() => onHoverProfile(profile.CustomerId)}
                  divider
                  sx={{
                    backgroundColor:
                      selectedProfileId === profile.CustomerId
                        ? "action.selected"
                        : hoveredProfileId === profile.CustomerId
                        ? "action.hover"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      cursor: "pointer",
                    },
                    // Ensure the first item is visually distinct when none are selected
                    ...(index === 0 && !selectedProfileId && !hoveredProfileId
                      ? {
                          borderLeft: "4px solid",
                          borderLeftColor: "primary.main",
                        }
                      : {}),
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{profile.Name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.Email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.ManyChatId}
                    </Typography>
                  </Box>
                </ListItem>
                {index < profiles.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {profiles.length > 0 && hasMore && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={onLoadMore}
            disabled={loading}
            fullWidth
            startIcon={loading && <CircularProgress size={16} />}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              "Load More"
            )}
          </Button>
        </Box>
      )}

      {loading && profiles.length === 0 && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading customers...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Sidebar;
