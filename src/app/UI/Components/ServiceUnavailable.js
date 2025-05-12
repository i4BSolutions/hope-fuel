import HttpsIcon from "@mui/icons-material/Https";
import { Box, Container, Paper, Typography } from "@mui/material";

const ServiceUnavailable = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
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
            Service Temporarily
          </Typography>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: "48px",
              lineHeight: "56px",
            }}
          >
            Unavailable.
          </Typography>

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "28px",
            }}
          >
            We'll be right back!
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ServiceUnavailable;
