"use client";

import styled from "@emotion/styled";
import {
  Box,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 160,
  height: 84,
  padding: 0,
  "@media (max-width: 600px)": {
    width: 120,
    height: 64,
  },
  "& .MuiSwitch-switchBase": {
    padding: 10,
    "&.Mui-checked": {
      transform: "translateX(76px)",
      "@media (max-width: 600px)": {
        transform: "translateX(56px)",
      },
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#FBC02D",
        opacity: 1,
        transition: "background-color 0.3s ease",
      },
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 42,
    backgroundColor: "#CBD5E1",
    transition: "background-color 0.3s ease",
  },
  "& .MuiSwitch-thumb": {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
    "@media (max-width: 600px)": {
      width: 44,
      height: 44,
    },
  },
}));

const StatusBadge = ({ status }) => {
  const isOpen = status === "Form Opened";
  return (
    <Box
      sx={{
        display: "inline-block",
        px: { xs: 1, sm: 2 },
        py: 0.5,
        borderRadius: 10,
        bgcolor: isOpen ? "#34D399" : "#EF4444",
        color: "#000000",
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        lineHeight: "18px",
      }}
    >
      {status}
    </Box>
  );
};

const FormStatus = ({ isFormOpen, setIsFormOpen, data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "auto",
        minHeight: "100vh",
        marginTop: { xs: "1.5rem", sm: "2rem" },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#000000",
          fontSize: "20px",
          fontWeight: 600,
          lineHeight: "28px",
        }}
      >
        {isFormOpen ? "Form Opened" : "Form Closed"}
      </Typography>
      <CustomSwitch
        checked={isFormOpen}
        onChange={(e) => setIsFormOpen(e.target.checked)}
      />
      <Box
        sx={{
          mt: { xs: "40px", sm: "80px" },
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#000000",
            fontSize: { xs: "18px", sm: "23px" },
            fontWeight: 700,
            lineHeight: { xs: "22px", sm: "28px" },
            textAlign: "center",
            mb: { xs: 2, sm: 3 },
          }}
        >
          History
        </Typography>
        <Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ bgcolor: "transparent" }}
          >
            <Table
              size="small"
              sx={{
                "& .MuiTableCell-root": {
                  "@media (min-width: 600px)": {
                    padding: "16px 16px 16px 0",
                  },
                },
              }}
            >
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <TableCell
                      sx={{
                        pl: 0,
                        borderBottom: "none",
                        py: { xs: 1.5, sm: 2 },
                        width: { xs: "30%", sm: "40%" },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          lineHeight: "20px",
                          color: "#000000",
                        }}
                      >
                        {row.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        py: { xs: 1.5, sm: 2 },
                        width: { xs: "40%", sm: "35%" },
                      }}
                    >
                      <Typography
                        color="#000000"
                        sx={{
                          fontSize: "14px",
                          display: { xs: "block", sm: "block" },
                          fontWeight: 400,
                          lineHeight: "17px",
                        }}
                      >
                        <Box sx={{ display: { xs: "block", sm: "none" } }}>
                          {row.timestamp.split(" ")[0]}
                        </Box>
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                          {row.timestamp}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        pr: 0,
                        borderBottom: "none",
                        py: { xs: 1.5, sm: 2 },
                        width: { xs: "30%", sm: "25%" },
                      }}
                    >
                      <StatusBadge status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default FormStatus;
