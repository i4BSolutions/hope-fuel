import { Box, Button, Stack, Typography } from "@mui/material";
import ItemCard from "./ItemCard";

function ItemList({ items, onItemClick, onLoadMore, hasInput, hasMore }) {
  return (
    <Box
      sx={{
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        width: "100%",
      }}
    >
      {/* List of Items */}
      <Stack>
        {items.length > 0 ? (
          items.map((item, index) => (
            <ItemCard
              key={index}
              item={item}
              onClick={() => onItemClick(item.HopeFuelID)}
            />
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ p: 2 }}>
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
          <Typography variant="body2" sx={{ py: 2, color: "gray" }}>
            No more items
          </Typography>
        ))}
    </Box>
  );
}

export default ItemList;
