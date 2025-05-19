import { Box } from "@mui/material";
import GroupAssignTable from "./_components/GroupAssign";
import WalletAssignTable from "./_components/WalletAssign";

export default function AssignDashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        width: "100%",
        mt: 4,
      }}
    >
      <GroupAssignTable />
      <WalletAssignTable />
    </Box>
  );
}
