import { Box, Skeleton } from "@mui/material";

export default function CustomerStatsSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexShrink: 0,
          flexGrow: 0,
          gap: 2.5,
          flexWrap: "wrap",
          width: 520,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            variant="rectangular"
            width={250}
            height={206}
            key={i}
            sx={{ borderRadius: 5 }}
          />
        ))}
      </Box>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={432}
        sx={{ borderRadius: 5 }}
      />
    </Box>
  );
}
