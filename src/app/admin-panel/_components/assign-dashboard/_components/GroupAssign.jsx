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
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export default function GroupAssignTable() {
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editedAssignAgents, setEditedAssignAgents] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignedAgents();
  }, []);

  const fetchAssignedAgents = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/agent/agent-group");
      const json = await response.json();

      const groups = json.data.result;
      setGroups(groups.map((group) => group.GroupName));

      const flatAgents = json.data.result.flatMap((group) =>
        group.AssignedAgents.map((agent) => ({
          AgentId: agent.AgentId,
          Username: agent.Username,
          TransactionCount: agent.TransactionCount,
          GroupName: group.GroupName,
        }))
      );

      setAssignedAgents(flatAgents);
    } catch (error) {
      console.error("Error fetching assigned wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback(() => {
    const initial = {};
    assignedAgents.forEach((agent) => {
      initial[agent.AgentId] = agent.GroupName ?? "Not assigned";
    });
    setEditedAssignAgents(initial);
    setIsEditing(true);
  }, [assignedAgents]);

  const handleCancel = () => {
    setEditedAssignAgents({});
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const groupMap = {};

      assignedAgents.forEach((agent) => {
        const selectedGroup =
          editedAssignAgents[agent.AgentId] ?? agent.GroupName;
        if (selectedGroup && selectedGroup !== "Not assigned") {
          if (!groupMap[selectedGroup]) groupMap[selectedGroup] = [];
          groupMap[selectedGroup].push(agent.AgentId);
        }
      });

      for (const groupName of Object.keys(groupMap)) {
        const agentIds = groupMap[groupName];
        if (agentIds.length === 0) continue;

        const res = await fetch("/api/agent/agent-group", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupName, agentIds }),
        });

        const result = await res.json();

        if (!res.ok) {
          console.error("PUT error:", result);
          throw new Error(`Failed to update ${groupName}: ${result.message}`);
        }
      }
      fetchAssignedAgents();
      setIsEditing(false);
      setEditedAssignAgents({});
    } catch (err) {
      console.error("PUT error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!assignedAgents || !groups) return null;

  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Group Assign
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #CBD5E0",
          borderRadius: 4,
          p: 2,
          flex: 1,
        }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="text" width={120} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" width={220} height={36} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Group</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedAgents.map((agent, index) => (
                <TableRow key={index}>
                  <TableCell>{`${index + 1}. ${agent.Username}`}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        disabled={!isEditing}
                        label="Not Assigned"
                        value={
                          editedAssignAgents[agent.AgentId] ??
                          agent.GroupName ??
                          "Not assigned"
                        }
                        onChange={(e) =>
                          setEditedAssignAgents((prev) => ({
                            ...prev,
                            [agent.AgentId]: e.target.value,
                          }))
                        }
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          fontWeight: "medium",
                          color:
                            (editedAssignAgents[agent.Username] ??
                              agent.GroupName) === "Not assigned"
                              ? "gray"
                              : "#334155",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        {groups.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

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
                disabled={loading}
                sx={{
                  borderRadius: 5,
                  px: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              color="error"
              disabled={loading}
              onClick={handleEdit}
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
