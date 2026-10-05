import React, { useSyncExternalStore } from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
// local
import {
  getPendingCount,
  subscribeToPendingCount,
} from "../../app/apiLoading";

export default function MapLoadingIndicator() {
  const pendingCount = useSyncExternalStore(
    subscribeToPendingCount,
    getPendingCount
  );

  if (!pendingCount) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        top: 48,
        p: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <Chip
        color="primary"
        icon={<CircularProgress color="inherit" size={14} thickness={5} />}
        label="Loading data..."
        sx={{
          // MUI hides the Chip icon color behind its own class, CircularProgress
          // needs to inherit the Chip text color to stay visible
          "& .MuiChip-icon": { color: "inherit", ml: "10px" },
        }}
      />
    </Box>
  );
}
