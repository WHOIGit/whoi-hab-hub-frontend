import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import { HexColorPicker } from "react-colorful";
import { PALETTE } from "../../Constants";

export default function SpeciesColorSwatch({ value, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Box sx={{ display: "inline-block" }}>
      <Box
        component="button"
        type="button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label="pick color"
        sx={{
          width: 24,
          height: 24,
          border: "none",
          borderRadius: "4px",
          backgroundColor: value,
          cursor: "pointer",
          padding: 0,
          margin: "0 6px",
          verticalAlign: "middle",
          boxShadow:
            "rgba(50, 50, 93, 0.11) 0px 4px 6px 0px, rgba(0, 0, 0, 0.08) 0px 1px 3px 0px",
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1.5 }}>
          <HexColorPicker color={value} onChange={onChange} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1, maxWidth: 200 }}>
            {Object.entries(PALETTE).map(([name, color]) => (
              <Box
                key={name}
                component="button"
                type="button"
                onClick={() => onChange(color)}
                aria-label={name}
                sx={{
                  width: 20,
                  height: 20,
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  backgroundColor: color,
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
