import React from "react";
import { useDispatch } from "react-redux";
import { useDrag } from "react-dnd";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import LegendCellConcentration from "./LegendCellConcentration";
import LegendToxicity from "./LegendToxicity";
import { changeLegendVisibility } from "../data-layers/dataLayersSlice";
import { DATA_LAYERS } from "../../Constants";
import { ITEM_TYPES } from "../../Constants";

export default function LegendPane({ dataLayer, left, bottom, id }) {
  const dispatch = useDispatch();

  const [, drag] = useDrag(
    () => ({
      type: ITEM_TYPES.PANE,
      item: { id, left, bottom },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, bottom]
  );

  let title;

  if (
    dataLayer === DATA_LAYERS.cellConcentrationLayer ||
    dataLayer === DATA_LAYERS.cellConcentrationSpatialGridLayer
  ) {
    title = "Cell Concentration";
  } else if (dataLayer === DATA_LAYERS.stationsLayer) {
    title = "Shellfish Toxicity";
  }

  return (
    <Card
      ref={drag}
      sx={{
        m: 1,
        width: 300,
        transition: "all 0.3s",
        zIndex: 1100,
        position: "absolute",
        left: left,
        bottom: bottom,
        cursor: "move",
      }}
    >
      <CardHeader
        slotProps={{
          root: { sx: { pb: 0 } },
          title: {
            sx: {
              color: (theme) => theme.palette.primary.main,
              fontSize: "1.1rem",
            },
          },
        }}
        action={
          <React.Fragment>
            <IconButton
              onClick={() =>
                dispatch(
                  changeLegendVisibility({
                    layerID: dataLayer,
                    legendVisibility: false,
                  })
                )
              }
              aria-label="close"
            >
              <Close />
            </IconButton>
          </React.Fragment>
        }
        title={title}
      />

      <CardContent>
        {(dataLayer === DATA_LAYERS.cellConcentrationLayer ||
          dataLayer === DATA_LAYERS.cellConcentrationSpatialGridLayer) && (
          <LegendCellConcentration />
        )}

        {dataLayer === DATA_LAYERS.stationsLayer && <LegendToxicity />}
      </CardContent>
    </Card>
  );
}
