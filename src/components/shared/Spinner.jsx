import { CircularProgress } from "@mui/material";

export default function Spinner() {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "600px" }}>
      <CircularProgress />
    </div>
  );
}
