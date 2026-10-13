import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Source, Layer } from "react-map-gl/maplibre";
// local
import { loadBinLocations, selectBinLocations } from "./binLocationsSlice";

export default function IfcbBinLocationsLayer({ layerID }) {
  const dateFilter = useSelector((state) => state.dateFilter);
  const binLocations = useSelector(selectBinLocations);
  const dispatch = useDispatch();

  useEffect(() => {
    // the locations are shared with the Spatial Grid highlight, so this only
    // fetches when they are missing for the current date filter
    dispatch(loadBinLocations());
  }, [dateFilter]);

  // Set default layer styles. These are reference points for where image data
  // exists, so they sit under the species markers in light grey
  const layerBinLocations = {
    id: layerID,
    type: "circle",
    source: layerID + "-src",
    paint: {
      "circle-radius": 3,
      "circle-color": "#bdbdbd",
      "circle-opacity": 0.8,
      "circle-stroke-width": 0.5,
      "circle-stroke-color": "#9e9e9e",
    },
    layout: {
      visibility: "visible",
    },
  };

  if (!binLocations) {
    return null;
  }

  return (
    <Source
      id={layerID + "-src"}
      key={layerID + "-src"}
      type="geojson"
      data={binLocations}
      buffer={10}
    >
      <Layer {...layerBinLocations} />
    </Source>
  );
}
