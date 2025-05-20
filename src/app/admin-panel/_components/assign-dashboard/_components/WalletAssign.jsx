import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function WalletAssignTable() {
  const [wallets, setWallets] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [editedAssignments, setEditedAssignments] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all wallets
  useEffect(() => {
    fetch("/api/wallets")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) setWallets(data.data);
        else console.error("Error fetching wallets:", data.message);
      })
      .catch((err) => console.error("Error fetching wallets:", err));
  }, []);

  // Fetch assigned wallets
  useEffect(() => {
    fetchAssignedWallets();
  }, []);

  const fetchAssignedWallets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/wallets/assigned-wallets");
      const data = await res.json();

      if (data.status === 200) {
        setAssignedData(data.data);
      } else {
        console.error("Error fetching assigned wallets:", data.message);
      }
    } catch (err) {
      console.error("Error fetching assigned wallets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    const initial = {};

    assignedData.forEach((agent) => {
      initial[agent.AgentId] = agent.wallets.map((w) => w.WalletId);
    });

    console.log("Initial edited assignments:", initial);
    setEditedAssignments(initial);
    setIsEditing(true);
  };

  const handleWalletChange = (agentId, newWalletIds) => {
    setEditedAssignments((prev) => ({
      ...prev,
      [agentId]: newWalletIds,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      for (const agentId in editedAssignments) {
        const walletIds = editedAssignments[agentId];

        const res = await fetch(
          `/api/v1/wallets/assigned-wallets?agentId=${agentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ walletId: walletIds }),
          }
        );

        const result = await res.json();

        if (result.status !== 200) {
          console.error(`Failed to update agent ${agentId}:`, result.message);
        }
      }

      setIsEditing(false);
      setEditedAssignments({});
      fetchAssignedWallets();
    } catch (err) {
      console.error("Error saving assignments:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAssignments({});
  };

  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Wallet Assign
      </Typography>

      <Paper
        elevation={0}
        sx={{ border: "1px solid #CBD5E0", borderRadius: 4, p: 2, flex: 1 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Wallet</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={120} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={220} height={36} />
                    </TableCell>
                  </TableRow>
                ))
              : assignedData.map((agent, index) => (
                  <TableRow key={agent.AgentId}>
                    <TableCell>{`${index + 1}. ${agent.AgentId}`}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          multiple
                          size="small"
                          variant="outlined"
                          value={editedAssignments[agent.AgentId] ?? []}
                          onChange={(e) =>
                            handleWalletChange(agent.AgentId, e.target.value)
                          }
                          renderValue={(selected) =>
                            wallets
                              .filter((wallet) =>
                                selected.includes(wallet.WalletId)
                              )
                              .map((wallet) => wallet.WalletName)
                              .join(", ")
                          }
                          sx={{
                            borderRadius: 2,
                            minWidth: 200,
                            fontWeight: "medium",
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 280,
                                borderRadius: 3,
                              },
                            },
                          }}
                        >
                          {wallets.map((wallet) => (
                            <MenuItem
                              key={wallet.WalletID}
                              value={wallet.WalletID}
                            >
                              <Checkbox
                                checked={
                                  editedAssignments[agent.AgentId]?.includes(
                                    wallet.WalletID
                                  ) || false
                                }
                              />
                              <ListItemText primary={wallet.WalletName} />
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 6,
                            color: "#64748B",
                            borderColor: "#CBD5E0",
                            textTransform: "none",
                            fontWeight: "medium",
                            px: 2,
                          }}
                        >
                          {agent.wallets.length > 0
                            ? agent.wallets.map((w) => w.WalletName).join(", ")
                            : "Not assigned"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {/* Action buttons */}
        <Box mt={2}>
          {isEditing ? (
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                sx={{
                  borderRadius: 5,
                  px: 3,
                  textTransform: "none",
                  borderWidth: 2,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleSave}
                sx={{
                  borderRadius: 5,
                  px: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Save Changes
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleEdit()}
              disabled={loading}
              sx={{
                borderRadius: 5,
                px: 3,
                textTransform: "none",
                borderWidth: 2,
                fontWeight: "bold",
              }}
            >
              Edit Assigns
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
