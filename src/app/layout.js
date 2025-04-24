"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Sidebar from "./UI/SidebarNav";
import theme from "./UI/theme";
import { AgentProvider } from "./context/AgentContext";
import { UserProvider } from "./context/UserContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Authenticator>
          {({ signOut, user }) => (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AgentProvider>
                <UserProvider>
                  <Sidebar />
                  <Box
                    component="main"
                    sx={{ flexGrow: 1, marginLeft: "80px", padding: 3 }}
                  >
                    {children}
                  </Box>
                  {console.log(user)}
                </UserProvider>
              </AgentProvider>
            </ThemeProvider>
          )}
        </Authenticator>
      </body>
    </html>
  );
}
