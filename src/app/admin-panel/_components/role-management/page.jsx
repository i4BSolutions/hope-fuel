import {
  Box,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const AGENTS = [
  {
    id: 1,
    name: "Agent Aung Aung",
  },
  {
    id: 2,
    name: "Agent Mg Mg",
  },
  {
    id: 3,
    name: "Agent Hla Hla",
  },
  {
    id: 4,
    name: "Agent Mya Mya",
  },
  {
    id: 5,
    name: "Agent Ko Ko",
  },
  {
    id: 6,
    name: "Agent Nu Nu",
  },
];

const RoleManagementPage = () => {
  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Role Management
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
                <b>Role</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {AGENTS.map((agent, index) => (
              <TableRow key={index}>
                <TableCell>{`${index + 1}. ${agent.name}`}</TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      disabled
                      label="Not Assigned"
                      value="Not Assigned"
                      displayEmpty
                      sx={{
                        borderRadius: 2,
                        fontWeight: "medium",
                        backgroundColor: "#F8FAFC",
                      }}
                    >
                      <MenuItem>
                        <Typography>Not Assigned</Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default RoleManagementPage;
