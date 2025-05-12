import HttpsIcon from "@mui/icons-material/Https";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function NotAuthorizedPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            textAlign: "center",
          }}
        >
          <HttpsIcon
            fontSize="large"
            color="error"
            sx={{ width: 48, height: 48 }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: "48px",
              lineHeight: "56px",
            }}
          >
            Service Unavailable.
          </Typography>

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "28px",
            }}
          >
            Agent not authorized.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
