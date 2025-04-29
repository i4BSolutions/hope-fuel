import React from "react";
import { Stack, Box, Button, Typography } from "@mui/material";
import ItemCard from "./ItemCard";

function ItemList({ items, onItemClick, onLoadMore, hasInput, hasMore }) {
  return (
    <Box
      sx={{
        maxHeight: "80vh", // Set the maximum height for scrolling
        overflowY: "auto", // Enable vertical scrolling
        padding: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 3,
      }}
    >
      {/* List of Items */}
      <Stack spacing={2}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <ItemCard
              key={index}
              item={item}
              onClick={() => onItemClick(item.HopeFuelID)}
            />
          ))
        ) : (
          <Typography variant="h6" align="center">
            No items found
          </Typography>
        )}
      </Stack>

      {/* Conditionally show Load More button if there are 10 or more items */}
      {!hasInput &&
        items.length > 0 &&
        (hasMore ? (
          <Button
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
            onClick={onLoadMore}
          >
            Load More...
          </Button>
        ) : (
          <Typography variant="body2" sx={{ marginTop: 2, color: "gray" }}>
            No more items
          </Typography>
        ))}
    </Box>
  );
}

export default ItemList;
