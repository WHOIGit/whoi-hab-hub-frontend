/* eslint-disable no-unused-vars */
import React from "react";
import { Divider, List, ListItem } from "@mui/material";

import DataLayersSelect from "../data-layers/DataLayersSelect";
import MaxMeanSelect from "../data-layers/MaxMeanSelect";

export default function DataLayersTab() {
  return (
    <List>
      <ListItem>
        <DataLayersSelect />
      </ListItem>
      <Divider variant="middle" component="li" sx={{ mt: 1, mb: 1 }} />
      <ListItem>
        <MaxMeanSelect />
      </ListItem>
    </List>
  );
}
