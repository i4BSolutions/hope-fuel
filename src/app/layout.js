"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import AuthGuard from "../lib/AuthGuard";
import "../lib/amplifyClient";
import Sidebar from "./UI/SidebarNav";
import theme from "./UI/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Authenticator>
          {({ signOut, user }) => (
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
          )}
        </Authenticator>
      </body>
    </html>
  );
}
