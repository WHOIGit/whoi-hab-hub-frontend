import React from "react";
import { useSelector } from "react-redux";
//import { useDrop } from "react-dnd";
import LegendPane from "./LegendPane";
import { selectLayerLegendIds } from "../data-layers/dataLayersSlice";
//import { ItemTypes } from "../../Constants";

const rootStyle = {
  width: 250,
  transition: "all 0.3s",
  position: "absolute",
  bottom: 0,
  left: 0,
  zIndex: 1100,
};

export default function LowerLeftPane() {
  const legendLayerIds = useSelector(selectLayerLegendIds);

  if (!legendLayerIds) {
    return null;
  }

  return (
    <div style={rootStyle}>
      {legendLayerIds.map((legend) => (
        <LegendPane dataLayer={legend} key={legend} />
      ))}
    </div>
  );
}
