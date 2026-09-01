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
          width: 20,
          height: 20,
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "2px",
          backgroundColor: value,
          cursor: "pointer",
          padding: 0,
          verticalAlign: "middle",
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
                  width: 18,
                  height: 18,
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "2px",
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
