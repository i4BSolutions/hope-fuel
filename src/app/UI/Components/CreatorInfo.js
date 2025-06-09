import { Stack, Typography } from "@mui/material";

const CreatorInfo = ({ creator }) => {
  if (!creator) return <p>No data available in Amount Details</p>;

  return (
    <Stack
      spacing={3}
      py={1}
      px={3}
      sx={{ width: "100%" }}
      justifyContent={"space-between"}
    >
      <Stack direction={"column"} spacing={0.5}>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Created by
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          {creator.AgentName}
        </Typography>
      </Stack>
      <Stack direction={"column"} spacing={1}>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>HOPEID</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          {creator.HopeFuelID}
        </Typography>
      </Stack>
      <Stack direction={"column"} spacing={0.5}>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Manychat ID
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          {creator.ManyChatId}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default CreatorInfo;
