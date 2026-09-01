import React from "react";
import { Box, Chip } from "@mui/material";

export default function DisclaimerBox() {
  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        padding: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Chip
        variant="outlined"
        sx={{ backgroundColor: "rgba(255,255,255,0.4)" }}
        label="This resource does not provide up-to-date information of HAB-related shellfishing closures. Check with state and/or local authorities before harvesting"
      />
    </Box>
  );
}
