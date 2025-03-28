"use client";
import { useState } from "react";
import { Container, Typography, Tab, Tabs, Divider } from "@mui/material";

import FormOpenClosePage from "../formopenclose/page";
import ExchangeRates from "./exchange-rates/page";

export default function AdminPanel() {
    const [tabIndex, setTabIndex] = useState(1);
  
    return (
        <Container>
            <Typography sx={{ fontSize: "34px", fontWeight: 600 }}>Admin Panel</Typography>

            <Tabs
                value={tabIndex}
                onChange={(event, newValue) => setTabIndex(newValue)}
                sx={{
                    width: "100%",
                    position: "relative",
                    "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#E0E0E0",
                    },
                }}
                TabIndicatorProps={{ style: { backgroundColor: "red", height: "3px" } }}
            >
                <Tab
                    label="Form Open/Close"
                    sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        textTransform: "none",
                        color: tabIndex === 0 ? "black" : "gray",
                        padding: "14px 12px 14px 0"
                    }}
                />
                <Tab
                    label="Currency Exchange Rate"
                    sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        textTransform: "none",
                        color: tabIndex === 1 ? "red" : "gray",
                    }}
                />
            </Tabs>

            {tabIndex === 0 && (
                <FormOpenClosePage />
            )}
            
            {tabIndex === 1 && (
                <ExchangeRates />
            )}
        </Container>
    );
}
  