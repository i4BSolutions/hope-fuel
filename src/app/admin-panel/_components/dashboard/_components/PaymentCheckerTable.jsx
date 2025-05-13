import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import WalletPopover from "./WalletPopover";

const checkers = [
  {
    name: "Hla Hla",
    checked: 300,
    pending: 500,
    wallets: ["Wallet A(500)", "Wallet X"],
    avgTime: "N/A",
    over48Percent: "10%",
  },
  {
    name: "Pa Pa",
    checked: 500,
    pending: 200,
    wallets: ["Wallet D(500)", "Wallet Y"],
    avgTime: "N/A",
    over48Percent: "10%",
  },
  {
    name: "Mya Mya",
    checked: 100,
    pending: 500,
    wallets: ["Wallet F(200)", "Wallet G(200)", "Wallet H(200)"],
    avgTime: "N/A",
    over48Percent: "10%",
  },
  {
    name: "Mya Mya",
    checked: 100,
    pending: 500,
    wallets: ["Wallet F(200)", "Wallet G(200)", "Wallet H(200)"],
    avgTime: "N/A",
    over48Percent: "10%",
  },
  {
    name: "Mya Mya",
    checked: 100,
    pending: 500,
    wallets: ["Wallet F(200)", "Wallet G(200)", "Wallet H(200)"],
    avgTime: "N/A",
    over48Percent: "10%",
  },
];

export default function PaymentCheckerTable() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWallets, setSelectedWallets] = useState([]);

  const handleClick = (event, wallets) => {
    setAnchorEl(event.currentTarget);
    setSelectedWallets(wallets);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #E0E0E0" }}
      >
        <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>Payment Checked</TableCell>
              <TableCell>Payment Check Pending</TableCell>
              <TableCell>Wallets Assigned</TableCell>
              <TableCell>Average Time to Complete</TableCell>
              <TableCell>Over 48 Hrs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkers.map((checker, index) => (
              <TableRow key={index} sx={{ borderBottom: "none" }}>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {index + 1}. {checker.name}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.checked}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.pending}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.wallets.slice(0, 1).join(", ")}...
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      ml: 1,
                      fontSize: "0.75rem",
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                    onClick={(e) => handleClick(e, checker.wallets)}
                  >
                    View All
                  </Button>
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.avgTime}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.over48Percent}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <WalletPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        wallets={selectedWallets}
      />
    </>
  );
}
