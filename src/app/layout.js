"use client";
import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import ResponsiveAppBar from "./UI/AppBar/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./UI/theme";
import { AgentProvider } from "./context/AgentContext";
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
import { UserProvider, useUser } from "./context/UserContext";
import { useRouter } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
Amplify.configure(awsconfig);

import Sidebar from "./UI/Sidebar";

function AppLayout({ children }) {
  // const router = useRouter();
  // const { currentUser } = useUser();

  // console.log("User from Layout: ", currentUser);

  // useEffect(() => {
  //   // Redirect to login if user is not authenticated
  //   if (currentUser === undefined) {
  //     console.log("User undefined, redirecting to login...");
  //     router.push("/login");
  //   }
  // }, [currentUser, router]);

  return <></>;
}

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
                  <ResponsiveAppBar />
                   <Sidebar /> 
                  {children}
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
