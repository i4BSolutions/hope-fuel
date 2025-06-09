"use client";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const PaymentTeam = () => {
  // State for holding the row that's being confirmed/denied
  const [selectedRow, setSelectedRow] = React.useState(null); // Holds the row data for the active dialog
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deinedOpen, setDeinedOpen] = React.useState(false);

  function createData(
    HopeFuelID,
    currency,
    amount,
    wallet,
    customername,
    formfillperson,
    month,
    screenshot,
    manychatid,
    status,
    email
  ) {
    return {
      HopeFuelID,
      currency,
      amount,
      wallet,
      customername,
      formfillperson,
      month,
      screenshot,
      manychatid,
      status,
      email,
    };
  }

  const [data, setData] = React.useState([]);

  const rows = Array.isArray(data)
    ? data.map((row) => {
        return createData(
          row["HopeFuelID"],
          row["CurrencyCode"],
          row["Amount"],
          row["WalletName"],
          row["Name"],
          row["AWSID"],
          row["Month"],
          row["ScreenShots"] || [],
          row["ManyChatID"],
          "Pending",
          row["Email"]
        );
      })
    : [];

  const handleScreenShotClick = async (url) => {
    let tmpURLObj = url;
    if (tmpURLObj) {
      window.open(tmpURLObj, "_blank");
    }
  };

  const handleConfirmOpen = (row) => {
    setSelectedRow(row); // Set the row that's being confirmed
    setConfirmOpen(true);
  };

  const handleDeinedOpen = (row) => {
    setSelectedRow(row); // Set the row that's being denied
    setDeinedOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleDeinedClose = () => {
    setDeinedOpen(false);
  };

  const handleAgree = (row) => {
    // console.log("agree");
    // console.log(row);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      denied: 0,
      HopeFuelID: row.HopeFuelID,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("api/paymentConfirmOrDeined", requestOptions).then((response) => {
      if (response.ok) {
        console.log("Payment Confirmed");
        setData((prevData) =>
          prevData.filter((item) => item.HopeFuelID !== row.HopeFuelID)
        );
      }
    });
    setConfirmOpen(false);
  };

  const handleDeined = (row) => {
    console.log("deined");
    console.log(row);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      denied: 1,
      HopeFuelID: row.HopeFuelID,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("api/paymentConfirmOrDeined", requestOptions).then((response) => {
      if (response.ok) {
        console.log("Payment Denied");
        setData(
          (prevData) =>
            prevData.filter((item) => item.HopeFuelID !== row.HopeFuelID) // Use TransactionID here
        );
      }
    });
    setDeinedOpen(false);
  };

  React.useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("/api/transactions?paymentCheckStatus=0", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.paymentData);
        setData(result.paymentData);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>HopeFuel ID</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Wallet</TableCell>
            <TableCell align="right">Customer Name</TableCell>
            <TableCell align="right">FormFill Person</TableCell>
            <TableCell align="right">Month</TableCell>
            <TableCell align="right">ScreenShot</TableCell>
            <TableCell align="right">ManyChat ID</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.HopeFuelID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.HopeFuelID}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.currency}
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.wallet}</TableCell>
                <TableCell align="right">{row.customername}</TableCell>
                <TableCell align="right">{row.formfillperson}</TableCell>
                <TableCell align="right">{row.month}</TableCell>

                <TableCell align="center">
                  <ButtonGroup variant="text" aria-label="Basic button group">
                    {row.screenshot.map((sh) => (
                      <Button
                        onClick={() => handleScreenShotClick(sh)}
                        key={sh}
                      >
                        One
                      </Button>
                    ))}
                  </ButtonGroup>
                </TableCell>
                <TableCell align="right">{row.manychatid}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">
                  <ButtonGroup variant="text" aria-label="Basic button group">
                    <Button
                      variant="contained"
                      onClick={() => handleConfirmOpen(row)}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeinedOpen(row)}
                    >
                      Deny
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Confirm Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you Sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedRow &&
              `Are you sure that you want to confirm this payment: ${selectedRow.customername}, ${selectedRow.email} with ${selectedRow.amount} ${selectedRow.currency} for ${selectedRow.month} months`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Discard</Button>
          <Button onClick={() => handleAgree(selectedRow)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Deny Dialog */}
      <Dialog
        open={deinedOpen}
        onClose={handleDeinedClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you Sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedRow &&
              `Are you sure that you want to deny this payment: ${selectedRow.customername}, ${selectedRow.email} with ${selectedRow.amount} ${selectedRow.currency} for ${selectedRow.month} months`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeinedClose}>Discard</Button>
          <Button onClick={() => handleDeined(selectedRow)} autoFocus>
            Deny
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default PaymentTeam;
