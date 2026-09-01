/* eslint-disable no-unused-vars */
import React from "react";
import { Divider, List, ListItem } from "@mui/material";

import HabSpeciesSelect from "../hab-species/HabSpeciesSelect";

export default function HabSpeciesTab() {
  return (
    <List>
      <ListItem sx={{ pr: 0 }}>
        <HabSpeciesSelect />
      </ListItem>
    </List>
  );
}
