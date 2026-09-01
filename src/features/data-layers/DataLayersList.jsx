import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";

import { DATA_LAYERS } from "../../Constants";
import DiamondMarker from "../../images/diamond.svg";
import CircleMarker from "../../images/circle.svg";
import TriangleMarker from "../../images/triangle.svg";
import ClosureIcon from "../../images/icon-shellfish-closure.png";
import { selectVisibleLayers } from "./dataLayersSlice";

export default function DataLayersList() {
  const dataLayers = useSelector(selectVisibleLayers);

  const renderLayerGrid = (dataLayer) => {
    let imgSrc;
    if (dataLayer.id === DATA_LAYERS.stationsLayer) {
      imgSrc = DiamondMarker;
    } else if (
      dataLayer.id === DATA_LAYERS.cellConcentrationLayer ||
      dataLayer.id === DATA_LAYERS.biovolumeLayer
    ) {
      imgSrc = CircleMarker;
    } else if (
      dataLayer.id === DATA_LAYERS.cellConcentrationSpatialGridLayer ||
      dataLayer.id === DATA_LAYERS.biovolumeSpatialGridLayer
    ) {
      imgSrc = TriangleMarker;
    } else if (
      dataLayer.id === DATA_LAYERS.closuresLayer ||
      dataLayer.id === DATA_LAYERS.closuresSeasonalLayer
    ) {
      imgSrc = ClosureIcon;
    }

    return (
      <Grid container spacing={2} key={dataLayer.id}>
        <Grid item xs={2}>
          {imgSrc && (
            <Box>
              <img
                src={imgSrc}
                alt={dataLayer.name}
                style={{
                  width: "25px",
                  ...(dataLayer.id === DATA_LAYERS.closuresLayer && {
                    backgroundColor: "#f2b036",
                  }),
                  ...(dataLayer.id === DATA_LAYERS.closuresSeasonalLayer && {
                    backgroundColor: "#FFEB3B",
                  }),
                }}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={10}>
          <Typography variant="body2" color="textSecondary">
            {dataLayer.name}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return dataLayers.map((layer) => renderLayerGrid(layer));
}
