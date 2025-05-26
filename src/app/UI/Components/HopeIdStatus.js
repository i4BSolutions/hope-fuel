import { Chip, Stack } from "@mui/material";

export default function HopeFuelIdStatus({ data }) {
  if (!data) {
    return (
      <div>
        <h1>No data found</h1>
      </div>
    );
  }
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
  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center" // Align items vertically in the center
        justifyContent="space-between" // Space between the elements
        sx={{
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "8px",
          marginBottom: "16px",
        }}
      >
        <Stack spacing={1}>
          <h1 style={{ margin: 0 }}>HOPEID - {data.HopeFuelID}</h1>
          <h2 style={{ margin: 0, fontSize: "16px", color: "#757575" }}>
            {formatDate(data.TransactionDate)}
          </h2>
        </Stack>
        <Chip
          label={`${data.TransactionStatus} `}
          sx={{
            backgroundColor: "#ffd700",
            color: "#000",
            fontWeight: "bold",
            padding: "4px 8px",
          }}
        />
      </Stack>
    </div>
  );
}
