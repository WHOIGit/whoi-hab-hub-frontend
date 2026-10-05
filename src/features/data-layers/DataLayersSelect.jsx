import React from "react";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  Box,
  Stack,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { changeLayerVisibility } from "./dataLayersSlice";
import DiamondMarker from "../../images/diamond.svg";
import TriangleMarker from "../../images/triangle.svg";
import DotMarker from "../../images/dot-grey.svg";
// local
import { DATA_LAYERS } from "../../Constants";

export default function HabSpeciesForm() {
  const dataLayers = useSelector((state) => state.dataLayers.layers);
  const dispatch = useDispatch();

  const handleCheckboxChange = (event, dataLayer) => {
    // only one of cell concentration-layer/biovolume-layer can be active at one time

    if (
      dataLayer.id === DATA_LAYERS.cellConcentrationSpatialGridLayer &&
      event.target.checked
    ) {
      dispatch(
        changeLayerVisibility({
          checked: false,
          layerID: DATA_LAYERS.biovolumeSpatialGridLayer,
        })
      );
    }

    if (
      dataLayer.id === DATA_LAYERS.biovolumeSpatialGridLayer &&
      event.target.checked
    ) {
      dispatch(
        changeLayerVisibility({
          checked: false,
          layerID: DATA_LAYERS.cellConcentrationSpatialGridLayer,
        })
      );
    }

    dispatch(
      changeLayerVisibility({
        checked: event.target.checked,
        layerID: dataLayer.id,
      })
    );
  };

  const renderLayerControl = (dataLayer) => {
    return (
      <FormControlLabel
        sx={(theme) => ({ ...theme.typography.body2 })}
        slotProps={{
          typography: { sx: { width: "100%" } },
        }}
        key={dataLayer.id}
        control={
          <Checkbox
            color="primary"
            checked={dataLayer.visibility}
            onChange={(event) => handleCheckboxChange(event, dataLayer)}
            name={dataLayer.name}
          />
        }
        label={
          <Grid container spacing={0}>
            <Grid item xs={11}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ pt: "5px" }}
              >
                {dataLayer.name}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Box>
                {dataLayer.id === DATA_LAYERS.stationsLayer && (
                  <img
                    src={DiamondMarker}
                    alt="Station Toxicity Legend Icon"
                    style={{ width: "25px" }}
                  />
                )}

                {dataLayer.id ===
                  DATA_LAYERS.cellConcentrationSpatialGridLayer && (
                  <img
                    src={TriangleMarker}
                    alt="Spatial Grid Legend Icon"
                    style={{ width: "25px" }}
                  />
                )}

                {dataLayer.id === DATA_LAYERS.ifcbBinLocationsLayer && (
                  <img
                    src={DotMarker}
                    alt="Plankton Image Locations Legend Icon"
                    style={{ width: "25px" }}
                  />
                )}

                {dataLayer.id === DATA_LAYERS.closuresLayer && (
                  <img
                    src="/images/icon-shellfish-closure.png"
                    alt="Closures Legend Icon"
                    style={{ width: "25px", backgroundColor: "#f2b036" }}
                  />
                )}

                {dataLayer.id === DATA_LAYERS.closuresSeasonalLayer && (
                  <img
                    src="/images/icon-shellfish-closure.png"
                    alt="Closures Legend Icon"
                    style={{ width: "25px", backgroundColor: "#FFEB3B" }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        }
      />
    );
  };

  return (
    <Stack spacing={2}>
    <Box sx={{ mt: 1 }}>
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <FormLabel component="legend">Data Layers</FormLabel>
        <FormGroup>
          {dataLayers.map((layer) => renderLayerControl(layer))}
        </FormGroup>
      </FormControl>
      </Box>
      
    </Stack>
  );
}
