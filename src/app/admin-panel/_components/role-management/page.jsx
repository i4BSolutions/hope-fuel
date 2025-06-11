"use client";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const RoleManagementPage = () => {
  const [agents, setAgents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editedRoles, setEditedRoles] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/agent/roles");
      const data = await res.json();
      setRoles(data.data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/get-all");

      if (!res.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await res.json();
      if (!data.data) {
        throw new Error("Invalid response format");
      }
      setAgents(data.data);

      const initial = {};
      data.data.forEach((agent) => {
        initial[agent.AgentId] = agent.UserRoleId ?? "";
      });
      setEditedRoles(initial);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchAgents();
  }, [isEditing]);

  const handleEdit = useCallback(() => {
    const initial = {};
    agents.forEach((agent) => {
      initial[agent.AgentId] = agent.UserRoleId ?? "";
    });
    setEditedRoles(initial);
    setIsEditing(true);
  }, [agents]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedRoles({});
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const changedRoles = Object.entries(editedRoles).filter(
        ([agentId, roleId]) => {
          const agent = agents.find((a) => a.AgentId === Number(agentId));
          return agent && agent.UserRoleId !== roleId;
        }
      );

      const payload = changedRoles.map(([agentId, userRoleId]) => ({
        agentId: Number(agentId),
        userRoleId: userRoleId === "" ? null : Number(userRoleId),
      }));

      if (payload.length === 0) {
        setIsEditing(false);
        return;
      }

      const res = await fetch("/api/agent/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }

      await fetchAgents();
      setEditedRoles({});
      setIsEditing(false);
    } catch (err) {
      console.error("POST error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderRoleValue = (selected) => {
    if (!selected) return <em>Unassigned</em>;
    const role = roles.find((r) => r.UserRoleID === Number(selected));
    return role?.UserRole ?? <em>Unassigned</em>;
  };

  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <Typography variant="h6" fontWeight="bold" my={2}>
        Role Management
      </Typography>
      <Paper
        elevation={0}
        sx={{ border: "1px solid #CBD5E0", borderRadius: 4, p: 2, flex: 1 }}
      >
        {loading && !isEditing ? (
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
                  <b>Role</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents?.map((agent, index) => (
                <TableRow key={agent.AgentId}>
                  <TableCell>{`${index + 1}. ${agent.Username}`}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        disabled={!isEditing}
                        value={editedRoles[agent.AgentId] ?? ""}
                        onChange={(e) =>
                          setEditedRoles((prev) => ({
                            ...prev,
                            [agent.AgentId]: e.target.value,
                          }))
                        }
                        displayEmpty
                        renderValue={renderRoleValue}
                        sx={{
                          borderRadius: 2,
                          fontWeight: "medium",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem
                            key={role.UserRoleID}
                            value={role.UserRoleID}
                          >
                            {role.UserRole}
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
                disabled={loading}
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
              onClick={handleEdit}
              disabled={loading}
              sx={{
                borderRadius: 5,
                px: 3,
                textTransform: "none",
                borderWidth: 2,
                fontWeight: "bold",
              }}
            >
              Edit Roles
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RoleManagementPage;
