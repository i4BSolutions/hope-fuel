import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRef, useLayoutEffect, useState } from "react";
import ItemCard from "./ItemCard";

function ItemList({
  items,
  onItemClick,
  onLoadMore,
  hasInput,
  hasMore,
  isLoadingMore,
}) {
  const scrollContainerRef = useRef(null);
  const [lastItemCount, setLastItemCount] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  useLayoutEffect(() => {
    if (items.length > lastItemCount && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - scrollHeight;

      if (heightDifference > 0 && lastItemCount > 0) {
        container.scrollTop = container.scrollTop + heightDifference;
      }

      setScrollHeight(newScrollHeight);
    }
    setLastItemCount(items.length);
  }, [items.length, lastItemCount, scrollHeight]);

  const handleLoadMore = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setScrollHeight(container.scrollHeight);
    }
    onLoadMore();
  };

  return (
    <Box
      ref={scrollContainerRef}
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
              key={item.HopeFuelID || `item-${index}`}
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

      {/* Load More Section */}
      {!hasInput && items.length > 0 && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          {hasMore ? (
            <>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                sx={{ mb: 1 }}
              >
                {isLoadingMore ? "Loading..." : "Load More..."}
              </Button>
              {isLoadingMore && <CircularProgress size={20} />}
            </>
          ) : (
            <Typography variant="body2" sx={{ color: "gray" }}>
              No more items
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ItemList;
