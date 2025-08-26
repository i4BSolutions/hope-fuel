import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const ExtendOrNot = ({ userInfo, onConfirm, onDecline }) => {
  return (
    <>
      {/* <Typography sx={{ mt: 3 }}>
        ယခုလအတွင်း ဖော်ပြပါထောက်ပို့တပ်သားအတွက် စာရင်းသွင်းထားပြီးပါပြီ။
        ထူးခြားဖြစ်စဥ် ဖြစ်ပါက Admin ကိုဆက်သွယ်ပါ
      </Typography> */}
      <Typography
        component="h1"
        sx={{ fontSize: "23px", marginTop: 4 }}
        variant="h5"
        fontWeight="bold"
        align="center"
      >
        Customer Membership Registration
      </Typography>
      <Box sx={{ mt: 4 }}>
        {/* Warning alert message */}
        <Alert severity="warning">
          <AlertTitle>User Already Exists</AlertTitle>
          The user <strong>{userInfo.Name}</strong> already exists. Do you want
          to extend their membership?
        </Alert>

        {/* User details in table format */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="user details table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Customer Name</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>Email</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>ID No</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>Expire Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{userInfo.name}</TableCell>
                <TableCell>{userInfo.email || "N/A"}</TableCell>
                <TableCell>{userInfo.prf_no || "N/A"}</TableCell>
                <TableCell>
                  {userInfo.expire_date
                    ? new Date(userInfo.expire_date).toLocaleDateString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action buttons */}
        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          sx={{ mt: 3, mb: 2 }}
        >
          {/* Continue button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => onConfirm(true)}
          >
            Continue
          </Button>

          {/* Cancel button */}
          <Button variant="outlined" color="error" onClick={() => onDecline()}>
            Decline
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ExtendOrNot;
