"use client";

import { SnackbarProvider } from "@/components/shared/SnackbarProvider";
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
          <SnackbarProvider>
            <Sidebar />
            <Box
              component="main"
              sx={{ flexGrow: 1, marginLeft: "80px", padding: 2.5 }}
            >
              {children}
            </Box>
          </SnackbarProvider>
        </AuthGuard>
      </ThemeProvider>
    </Authenticator>
  );
}
