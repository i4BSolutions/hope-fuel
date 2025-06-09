import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CardItem from "./CardItem";

const CardsIssuedList = ({ data }) => {
  const [cards, setCards] = useState([]); // State to hold fetched cards data

  useEffect(() => {
    if (data?.Email && data?.Name) {
      const fetchCards = async () => {
        try {
          const response = await fetch(
            `/api/transactions?customerName=${encodeURIComponent(
              data.Name
            )}&customerEmail=${encodeURIComponent(data.Email)}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch cards issued");
          }
          const result = await response.json();
          setCards(result.cardIssuedData || []); // Update state with the fetched data
        } catch (error) {
          console.error("Error fetching cards issued:", error);
        }
      };

      fetchCards();
    }
  }, [data?.Email, data?.Name]); // Re-fetch data if Email or Name changes
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // This converts to the full month name
      day: "numeric",
    });
  };
  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
        List of Cards Issued
      </Typography>

      <Box
        sx={{
          marginTop: 2,
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: 1,
        }}
      >
        <Stack direction="row" spacing={2}>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <CardItem
                key={index}
                date={formatDate(card.TransactionDate)}
                amount={card.Amount.toFixed(2).toLocaleString()}
                currency={card.CurrencyCode}
              />
            ))
          ) : (
            <Typography>No cards issued for this customer.</Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default CardsIssuedList;
