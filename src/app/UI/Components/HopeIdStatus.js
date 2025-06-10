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
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    };

    return new Intl.DateTimeFormat("en-TH", options).format(date);
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
          width: "100%",
        }}
      >
        <Stack spacing={1}>
          <h1 style={{ margin: 0 }}>HOPEID - {data.HopeFuelID}</h1>
          <h2 style={{ m: 0, fontSize: "20px" }}>
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
