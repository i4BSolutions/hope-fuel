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
                      {row.hopeId}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 600 }}
                    >
                      {row.name}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.email}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      Card ID - {row.cardId}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.date}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.amount}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.currency}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.period}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ color: "#000000", fontSize: 14, fontWeight: 400 }}
                    >
                      {row.periodUnit}
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
                      {row.manychatId}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                  <Chip
                    label="ငွေတောင်းမည်"
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
