import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Source, Layer } from "react-map-gl/maplibre";
// local
import { selectBinLocations } from "./binLocationsSlice";
import { selectActiveGridSquares } from "./habMapDataSlice";

const SOURCE_ID = "grid-highlight-src";

// Index of the grid cell a coordinate falls in. Comparing the indexes rather
// than the snapped coordinates keeps this exact, the API groups Bins into grid
// squares the same way with round(value / grid_level)
function getGridIndex(value, gridLength) {
  return Math.round(value / gridLength);
}

export default function SpatialGridHighlightLayer({ gridLength }) {
  const binLocations = useSelector(selectBinLocations);
  const activeGridSquares = useSelector(selectActiveGridSquares);

  const highlightedLocations = useMemo(() => {
    if (!binLocations || !activeGridSquares.length) {
      return null;
    }

    // the color each highlighted cell is drawn in, so a location only has to be
    // matched once no matter how many squares are highlighted at the same time
    const cellColors = new Map(
      activeGridSquares.map((gridSquare) => [
        `${getGridIndex(gridSquare.longitude, gridLength)}:${getGridIndex(
          gridSquare.latitude,
          gridLength
        )}`,
        gridSquare.highlightColor,
      ])
    );

    const features = [];
    binLocations.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const highlightColor = cellColors.get(
        `${getGridIndex(lng, gridLength)}:${getGridIndex(lat, gridLength)}`
      );
      if (!highlightColor) {
        return;
      }
      // the color travels on the feature so one layer can draw every square
      features.push({
        ...feature,
        properties: { ...feature.properties, highlightColor: highlightColor },
      });
    });

    return { type: "FeatureCollection", features: features };
  }, [binLocations, activeGridSquares, gridLength]);

  // Set default layer styles. Each open square has its own shade of yellow to
  // orange, outlined to keep the dots readable against the pale basemap and
  // apart from the grey Plankton Image Locations points
  const layerHighlight = {
    id: "grid-highlight-layer",
    type: "circle",
    source: SOURCE_ID,
    paint: {
      "circle-radius": 5,
      "circle-color": ["get", "highlightColor"],
      "circle-opacity": 1,
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "#827e7e",
    },
    layout: {
      visibility: "visible",
    },
  };

  if (!highlightedLocations?.features.length) {
    return null;
  }

  return (
    <Source id={SOURCE_ID} type="geojson" data={highlightedLocations}>
      <Layer {...layerHighlight} />
    </Source>
  );
}
