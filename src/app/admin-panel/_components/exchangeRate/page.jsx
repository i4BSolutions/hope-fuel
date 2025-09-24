"use client";

import {
  Box,
  Button,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomInput from "../../../components/CustomInput";

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [editableRates, setEditableRates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const half = Math.ceil(rates.length / 2);
  const leftColumn = rates.slice(0, half);
  const rightColumn = rates.slice(half);

  useEffect(() => {
    fetch("/api/v1/exchange-rates")
      .then((response) => response.json())
      .then((data) => setRates(data.data))
      .catch((error) => console.error("Error fetching exchange rates: ", error))
      .finally(() => setLoading(false));
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

  const renderSkeletonRow = () => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}>
      <Skeleton variant="text" width="40%" height="24px" />
      <Skeleton variant="text" width="15%" height="24px" />
      <Skeleton
        variant="rounded"
        width="120px"
        height="48px"
        sx={{ borderRadius: "12px" }}
      />
    </Box>
  );

  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  return (
    <Box sx={{ mt: "20px" }}>
      <Typography sx={{ fontSize: "23px", fontWeight: 600 }}>
        {currentMonthName} 2025 Exchange Rates (1 USD = )
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
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={`left-skeleton-${i}`}>{renderSkeletonRow()}</div>
                  ))
                : leftColumn.map((item, index) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ flex: 1, fontWeight: "bold" }}>
                        {item.BaseCountry.BaseCountryName}
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", minWidth: "50px" }}>
                        {item.Currency.CurrencyCode}
                      </Typography>
                      <Box>
                        <CustomInput
                          type="number"
                          name="leftExchangeRate"
                          id="leftExchangeRate"
                          value={
                            isEditing
                              ? editableRates[index]?.ExchangeRate ?? ""
                              : item.ExchangeRate ?? ""
                          }
                          readOnly={!isEditing}
                          onChange={(e) =>
                            handleRateChange(index, e.target.value, "left")
                          }
                        />
                      </Box>
                    </Box>
                  ))}
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderRightWidth: 2 }}
            />

            {/* Right Column */}
            <Box sx={{ flex: 1 }}>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={`right-skeleton-${i}`}>{renderSkeletonRow()}</div>
                  ))
                : rightColumn.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ flex: 1, fontWeight: "bold" }}>
                        {item.BaseCountry.BaseCountryName}
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", minWidth: "50px" }}>
                        {item.Currency.CurrencyCode}
                      </Typography>
                      <Box>
                        <CustomInput
                          type="number"
                          name="rightExchangeRate"
                          id="rightExchangeRate"
                          value={
                            isEditing
                              ? editableRates[index + half]?.ExchangeRate ?? ""
                              : item.ExchangeRate ?? ""
                          }
                          readOnly={!isEditing}
                          onChange={(e) =>
                            handleRateChange(index, e.target.value, "right")
                          }
                        />
                      </Box>
                    </Box>
                  ))}
            </Box>
          </Box>
        </Paper>

        {!loading && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
              >
                Edit Rates
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
