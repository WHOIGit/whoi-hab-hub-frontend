import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import { Typography, Divider, IconButton, Tooltip } from "@mui/material";
import { Launch } from "@mui/icons-material";

import LegendToxicity from "../legends/LegendToxicity";
import LegendCellConcentration from "../legends/LegendCellConcentration";
import HabSpeciesList from "../hab-species/HabSpeciesList";
import DataLayersList from "../data-layers/DataLayersList";
import {
  changeLegendVisibility,
  selectVisibleLayerIds,
} from "../data-layers/dataLayersSlice";
import { DATA_LAYERS } from "../../Constants";

const legendBoxSx = { mt: 2, mb: 2 };
const legendBoxTopSx = { mt: 0 };

export default function LegendTab() {
  const dispatch = useDispatch();
  const dataLayers = useSelector(selectVisibleLayerIds);

  const handleLegendOpen = (layerID) => {
    dispatch(
      changeLegendVisibility({
        layerID: layerID,
        legendVisibility: true,
      })
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={[legendBoxSx, legendBoxTopSx]}>
        <Typography variant="subtitle1" display="block" gutterBottom>
          Data Sources
        </Typography>

        <DataLayersList />
      </Box>
      <Divider />

      <Box sx={legendBoxSx}>
        <Typography variant="subtitle1" display="block" gutterBottom>
          HAB Species/Syndrome
        </Typography>

        <HabSpeciesList />
      </Box>
      <Divider />

      {(dataLayers.includes(DATA_LAYERS.cellConcentrationLayer) ||
        dataLayers.includes(DATA_LAYERS.cellConcentrationSpatialGridLayer)) && (
        <>
          <Box sx={legendBoxSx}>
            <Typography variant="subtitle1" display="block" gutterBottom>
              Cell Concentration
              <Tooltip
                title="Open window"
                slotProps={{
                  popper: { sx: { zIndex: 9999 } },
                }}
              >
                <IconButton
                  onClick={() =>
                    handleLegendOpen(DATA_LAYERS.cellConcentrationLayer)
                  }
                  aria-label="open Cell Concentration legend on map"
                >
                  <Launch />
                </IconButton>
              </Tooltip>
            </Typography>
            <LegendCellConcentration />
          </Box>
          <Divider />
        </>
      )}

      {dataLayers.includes(DATA_LAYERS.stationsLayer) && (
        <>
          <Box sx={legendBoxSx}>
            <Typography variant="subtitle1" display="block" gutterBottom>
              Shellfish Toxicity
              <Tooltip
                title="Open window"
                slotProps={{
                  popper: { sx: { zIndex: 9999 } },
                }}
              >
                <IconButton
                  onClick={() => handleLegendOpen(DATA_LAYERS.stationsLayer)}
                  aria-label="open Shellfish Toxicity legend on map"
                >
                  <Launch />
                </IconButton>
              </Tooltip>
            </Typography>
            <LegendToxicity />
          </Box>
          <Divider />
        </>
      )}
    </Box>
  );
}
