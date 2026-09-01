import React from "react";
import { useSelector } from "react-redux";
import { Chip, Box } from "@mui/material";
import { parseISO, format } from "date-fns";

export default function CurrentDateChip() {
  const startDate = format(
    parseISO(useSelector(state => state.dateFilter.startDate)),
    "MMM dd, yyyy"
  );
  const endDate = format(
    parseISO(useSelector(state => state.dateFilter.endDate)),
    "MMM dd, yyyy"
  );

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        top: 0,
        p: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <Chip
        color="primary"
        label={`Selected Date Range: ${startDate} - ${endDate}`}
      />
    </Box>
  );
}
