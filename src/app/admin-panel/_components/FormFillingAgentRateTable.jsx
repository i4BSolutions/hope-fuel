import {
  Box,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const itemsPerPage = 4;

const FormFillingAgentRateTable = ({
  data,
  page = 1,
  setPage,
  headerColor = "#DC2626",
  progressColor = "#DC2626",
}) => {
  const totalPages = Math.ceil(data.agents.length / itemsPerPage);

  const currentAgents = data.agents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 620, minHeight: 392 }}>
      <Paper
        elevation={3}
        sx={{
          overflow: "hidden",
          borderRadius: 4,
          maxWidth: 620,
          minHeight: 392,
        }}
      >
        <Box
          sx={{
            backgroundColor: headerColor,
            color: "white",
            py: 1,
            px: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h5"
            fontWeight="bold"
            sx={{
              color: "#FFFFFF",
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "-2%",
            }}
          >
            {data.groupName}
          </Typography>
          <Typography
            variant="h2"
            component="div"
            fontWeight="bold"
            sx={{
              color: "#FFFFFF",
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "56px",
              letterSpacing: "-4%",
            }}
          >
            {data.totalValue.toLocaleString()}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableBody>
              {currentAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell
                    sx={{
                      px: 4,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: "#0F172A",
                        fontSize: "20px",
                        fontWeight: 500,
                        letterSpacing: "-2%",
                        lineHeight: "34px",
                      }}
                    >
                      {`${agent.id}. ${agent.name}`}
                    </Typography>
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(agent.value / data.totalValue) * 100}
                        sx={{
                          height: 12,
                          borderRadius: 2,
                          backgroundColor: "#E2E8F0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: progressColor,
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      px: 4,
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        color: "#0F172A",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "34px",
                        letterSpacing: "-2%",
                      }}
                    >
                      {agent.value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
            borderTop: "1px solid #eee",
          }}
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>&lt;</Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              hideNextButton
              hidePrevButton
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 0,
                  mx: 0.5,
                },
                "& .Mui-selected": {
                  backgroundColor: "#fff",
                  border: "1px solid #1976d2",
                  color: "#1976d2",
                },
              }}
            />
            <Typography>&gt;</Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormFillingAgentRateTable;
