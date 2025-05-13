"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Sidebar from "../app/UI/SidebarNav";
import theme from "../app/UI/theme";
import "./amplifyClient";
import AuthGuard from "./AuthGuard";

export default function MainProvider({ children }) {
  return (
    <Authenticator>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthGuard>
          <Sidebar />
          <Box
            component="main"
            sx={{ flexGrow: 1, marginLeft: "80px", padding: 3 }}
          >
            {children}
          </Box>
        </AuthGuard>
      </ThemeProvider>
    </Authenticator>
  );
}
