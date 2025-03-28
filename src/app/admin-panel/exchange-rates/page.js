"use client";

import { useState, useEffect } from "react";
import { Typography, TextField, Divider, Button, Paper, Box } from "@mui/material";

export default function ExchangeRates() {
    const [rates, setRates] = useState([]);
    const [editableRates, setEditableRates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const half = Math.ceil(rates.length / 2);
    const leftColumn = rates.slice(0, half);
    const rightColumn = rates.slice(half);

    useEffect(() => {
        fetch("/api/v1/exchange-rates")
            .then((response) => response.json())
            .then((data) => setRates(data.data))
            .catch((error) => console.error("Error fetching exchange rates: ", error));
    }, []);

    useEffect(() => {
        if (isEditing) {
            setEditableRates([...rates]);
        }
    }, [isEditing]);

    const handleRateChange = (index, value, column = "left") => {
        const half = Math.ceil(rates.length / 2);
        const actualIndex = column === "left" ? index : index + half;
    
        const updatedRates = [...editableRates];
        updatedRates[actualIndex].ExchangeRate = value;
        setEditableRates(updatedRates);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditableRates([]);
    };

    const handleSave = async (event) => {
        event.preventDefault();
    
        try {
            const res = await fetch("/api/v1/exchange-rates", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: editableRates }),
            });
        
            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
        
            const result = await res.json();
        
            setRates(result.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save exchange rates", error);
        }
    };
    
    return (
        <Box sx={{ 
            mt: "20px"
        }}>
            <Typography
                sx={{ 
                    fontSize: "23px",
                    fontWeight: 600
                }}
            >
                March 2025 Exchange Rates (1 USD = )
            </Typography>

            <Box sx={{ mt: 1 }}>
                <Paper sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 4,
                            maxWidth: "100%",
                            margin: "auto 0",
                        }}
                    >

                        {/* Left Column */}
                        <Box sx={{ flex: 1 }}>
                            {leftColumn.map((item, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Typography sx={{ flex: 1, fontWeight: "bold" }}>{item.BaseCountry.BaseCountryName}</Typography>
                                    <Typography sx={{ fontWeight: "bold", minWidth: "50px" }}>{item.Currency.CurrencyCode}</Typography>
                                    {/* TODO: use custom input */}
                                    <TextField
                                        value={
                                            isEditing
                                                ? editableRates[index]?.ExchangeRate ?? ""
                                                : item.ExchangeRate ?? ""
                                        }
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            width: "20%",
                                            ml: 1,
                                        }}
                                        slotProps={{
                                            input: {
                                                readOnly: !isEditing,
                                            }
                                        }}
                                        onChange={(e) => handleRateChange(index, e.target.value, "left")}
                                    />
                                </Box>
                            ))}
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />

                        {/* Right Column */}
                        <Box sx={{ flex: 1 }}>
                            {rightColumn.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <Typography sx={{ flex: 1, fontWeight: "bold" }}>{item.BaseCountry.BaseCountryName}</Typography>
                                <Typography sx={{ fontWeight: "bold", minWidth: "50px" }}>{item.Currency.CurrencyCode}</Typography>
                                {/* TODO: use custom input */}
                                <TextField
                                    value={
                                        isEditing
                                            ? editableRates[index]?.ExchangeRate ?? ""
                                            : item.ExchangeRate ?? ""
                                    }
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                        width: "160px", 
                                        ml: 1
                                    }}
                                    slotProps={{
                                        input: {
                                            readOnly: !isEditing,
                                        }
                                    }}
                                    onChange={(e) => handleRateChange(index, e.target.value, "right")}
                                />
                            </Box>
                            ))}
                        </Box>
                    </Box>
                </Paper>

                {/* TODO: use custom button */}
                {isEditing ? (
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button onClick={() => handleCancel()} variant="outlined" color="error" sx={{ mt: 2 }}>Cancel</Button> 
                        <Button onClick={(event) => handleSave(event)} variant="contained" color="error" sx={{ mt: 2 }}>Save Changes</Button> 
                    </Box>
                ) : (
                    <Button onClick={() => setIsEditing(!isEditing)} variant="contained" color="error" sx={{ mt: 2 }}>Edit Rates</Button> 
                )}
            </Box>
        </Box>
    );
}