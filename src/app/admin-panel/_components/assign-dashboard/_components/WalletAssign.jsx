import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
} from "@mui/material";

const walletData = ["Hla Hla", "Pa Pa", "Mya Mya", "Ma Ma", "Phyu Phyu"];

export default function WalletAssignTable() {
  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Wallet Assign
      </Typography>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid #CBD5E0",
          borderRadius: 4,
          p: 2,
          flex: 1,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Wallet</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {walletData.map((name, index) => (
              <TableRow key={index}>
                <TableCell>{`${index + 1}. ${name}`}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 6,
                      color: "#64748B",
                      borderColor: "#CBD5E0",
                      textTransform: "none",
                      fontWeight: "medium",
                      px: 2,
                    }}
                  >
                    Not assigned
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={2}>
          <Button
            variant="outlined"
            color="error"
            sx={{
              borderRadius: 5,
              px: 3,
              textTransform: "none",
              borderWidth: 2,
              fontWeight: "bold",
            }}
          >
            Edit Assigns
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
