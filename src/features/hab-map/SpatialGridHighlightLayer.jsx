import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Source, Layer } from "react-map-gl/maplibre";
// local
import { selectBinLocations } from "./binLocationsSlice";
import { selectActiveGridSquare } from "./habMapDataSlice";

const SOURCE_ID = "grid-highlight-src";

// Index of the grid cell a coordinate falls in. Comparing the indexes rather
// than the snapped coordinates keeps this exact, the API groups Bins into grid
// squares the same way with round(value / grid_level)
function getGridIndex(value, gridLength) {
  return Math.round(value / gridLength);
}

export default function SpatialGridHighlightLayer({ gridLength }) {
  const binLocations = useSelector(selectBinLocations);
  const activeGridSquare = useSelector(selectActiveGridSquare);

  const highlightedLocations = useMemo(() => {
    if (!binLocations || !activeGridSquare) {
      return null;
    }

    const lngIndex = getGridIndex(activeGridSquare.longitude, gridLength);
    const latIndex = getGridIndex(activeGridSquare.latitude, gridLength);

    const features = binLocations.features.filter((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return (
        getGridIndex(lng, gridLength) === lngIndex &&
        getGridIndex(lat, gridLength) === latIndex
      );
    });

    return { type: "FeatureCollection", features: features };
  }, [binLocations, activeGridSquare, gridLength]);

  // Set default layer styles. Light yellow stands out against the light grey
  // Plankton Image Locations points, with a dark outline to keep the dots
  // readable against the pale basemap
  const layerHighlight = {
    id: "grid-highlight-layer",
    type: "circle",
    source: SOURCE_ID,
    paint: {
      "circle-radius": 5,
      "circle-color": "#fff176",
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
