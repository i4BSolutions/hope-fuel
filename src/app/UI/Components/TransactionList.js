import React from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

const TransactionList = ({ transactions }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 1200, mx: "auto", my: 4, borderRadius: 2 }}
    >
      <Table>
        <TableBody>
          {transactions.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ fontWeight: 400, fontSize: 14, color: "#000000" }}
                    >
                      {row.HopeFuelID}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 600 }}
                    >
                      {row.Name}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.Email}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      Card ID - {row.CardID}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {dayjs(row.TransactionDate).format("YYYY-MM-DD")}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.Amount}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.CurrencyCode}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.Month}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      Month
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      Manychat ID
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.ManyChatId}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      Form Filled Person
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.FormFilledPerson}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      Note
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.Note}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Chip
                    label={row.TransactionStatus}
                    sx={{
                      borderRadius: 4,
                      backgroundColor: "#34D399",
                      color: "#000000",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;
