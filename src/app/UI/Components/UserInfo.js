import { Stack, Typography } from "@mui/material";
// Format the TransactionDate
function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    month: "long", // Full month name
    day: "numeric", // Day of the month
    year: "numeric", // Full year
    hour: "2-digit", // Hour in 24-hour format
    minute: "2-digit", // Minute
    hour12: false, // Use 24-hour format
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
const UserInfo = ({ user }) => (
  <Stack spacing={1}>
    <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: "20px" }}>
      {user.Name}
    </Typography>
    <Stack direction="row" spacing={4}>
      <Stack direction={"column"} spacing={0.5}>
        <Typography>Email</Typography>
        <Typography>{user.Email}</Typography>
      </Stack>
      <Stack direction={"column"} spacing={0.5}>
        <Typography>Expire Date</Typography>
        <Typography>
          {user.ExpireDate ? formatDate(user.ExpireDate) : "N/A"}
        </Typography>
      </Stack>{" "}
      <Stack direction={"column"} spacing={0.5}>
        <Typography>Card No</Typography>
        <Typography>{user.CardID ? user.CardID : "N/A"}</Typography>
      </Stack>
    </Stack>
  </Stack>
);
export default UserInfo;
