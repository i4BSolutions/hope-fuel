import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useState } from "react";
import WalletPopover from "./WalletPopover";

// TODO: Add an assigned wallet (currently wallet assign function is not implemented)
export default function PaymentCheckerTable({ data }) {
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
        sx={{
          borderRadius: 6,
          boxShadow: "none",
          border: "1px solid #E0E0E0",
          overflowX: "auto",
        }}
      >
        <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <TableHead>
            <TableRow
              sx={{ paddingTop: 1, paddingBottom: 1, textAlign: "left" }}
            >
              <TableCell sx={{ fontWeight: "bold", verticalAlign: "top" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", verticalAlign: "top" }}>
                Payment <br /> Checked
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", verticalAlign: "top" }}>
                Payment Check <br /> Pending
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", verticalAlign: "top" }}>
                Wallets <br /> Assigned
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", verticalAlign: "top" }}>
                Average Time <br /> to Complete
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", verticalAlign: "top" }}>
                Over <br /> 48 Hrs
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((checker, index) => (
              <TableRow key={index} sx={{ borderBottom: "none" }}>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {index + 1}. {checker.checkerId}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.checked}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.pending}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {/* {checker.wallets.slice(0, 1).join(", ")}...
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      ml: 1,
                      fontSize: "0.75rem",
                      textTransform: "none",
                      borderRadius: 4,
                      backgroundColor: "#E2E8F0",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => handleClick(e, checker.wallets)}
                  >
                    View All
                  </Button> */}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.averageTimeHours}
                </TableCell>
                <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                  {checker.over48hPercent}
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
