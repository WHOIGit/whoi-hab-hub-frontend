import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
// local
import { DATA_LAYERS, DATA_LAYER_DEFINITIONS } from "../../Constants";

let INITIAL_MAX_MEAN = "mean";
// eslint-disable-next-line no-undef
if (import.meta.env.VITE_INITIAL_MAX_MEAN) {
  INITIAL_MAX_MEAN = import.meta.env.VITE_INITIAL_MAX_MEAN;
}

let SHOW_DATALAYERS_LIST = null;
// eslint-disable-next-line no-undef
if (import.meta.env.VITE_SHOW_DATALAYERS_LIST) {
  SHOW_DATALAYERS_LIST = import.meta.env.VITE_SHOW_DATALAYERS_LIST.split(",")
    .map((layerID) => layerID.trim())
    .filter((layerID) => layerID);
}

// list of dataLayer IDs that have an available floating Legend window pane
// need to check it against the active layers
const legendLayerIds = [
  DATA_LAYERS.stationsLayer,
  DATA_LAYERS.cellConcentrationSpatialGridLayer,
];
const interactiveLayerIds = [
  DATA_LAYERS.closuresIconsLayer,
  DATA_LAYERS.closuresSeasonalIconsLayer,
];

// layers that start hidden on load. Only one of cell_concentration/biovolume
// can be active at one time, default to cell_concentration
const hiddenOnLoadLayerIds = [
  DATA_LAYERS.closuresLayer,
  DATA_LAYERS.closuresSeasonalLayer,
  DATA_LAYERS.biovolumeSpatialGridLayer,
];

// Build the dataLayers the map starts with. The layers available are the ones
// this client has components for, VITE_SHOW_DATALAYERS_LIST in the local .env
// picks which of those are active, leave it unset to show all of them.
function getActiveLayers() {
  if (SHOW_DATALAYERS_LIST) {
    const unknownLayerIds = SHOW_DATALAYERS_LIST.filter(
      (layerID) =>
        !DATA_LAYER_DEFINITIONS.some((element) => element.id === layerID)
    );
    if (unknownLayerIds.length) {
      console.warn(
        `VITE_SHOW_DATALAYERS_LIST has Data Layer IDs the map cannot render: ${unknownLayerIds.join(
          ", "
        )}`
      );
    }
  }

  const activeLayers = SHOW_DATALAYERS_LIST
    ? DATA_LAYER_DEFINITIONS.filter((element) =>
        SHOW_DATALAYERS_LIST.includes(element.id)
      )
    : DATA_LAYER_DEFINITIONS;

  return activeLayers.map((element) => {
    const layer = {
      ...element,
      visibility: !hiddenOnLoadLayerIds.includes(element.id),
    };

    if (legendLayerIds.includes(element.id)) {
      layer.legendVisibility = true;
    }
    if (interactiveLayerIds.includes(element.id)) {
      layer.interactiveLayer = true;
    }
    return layer;
  });
}

const initialState = {
  layers: getActiveLayers(),
  showMaxMean: INITIAL_MAX_MEAN,
};

export const dataLayersSlice = createSlice({
  name: "dataLayers",
  initialState: initialState,
  reducers: {
    changeLayerVisibility: (state, action) => {
      console.log(action);
      state.layers.forEach((element) => {
        if (element.id === action.payload.layerID) {
          element.visibility = action.payload.checked;
        }
      });
    },
    setAllLayersVisibility: (state, action) => {
      state.layers.forEach((element) => {
        if (action.payload.layerList.includes(element.id)) {
          element.visibility = true;
        } else {
          element.visibility = false;
        }
      });
    },
    changeMaxMean: (state, action) => {
      state.showMaxMean = action.payload.value;
    },
    changeLegendVisibility: (state, action) => {
      state.layers.forEach((element) => {
        if (element.id === action.payload.layerID) {
          element.legendVisibility = action.payload.legendVisibility;
        }
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeLayerVisibility,
  changeMaxMean,
  changeLegendVisibility,
  setAllLayersVisibility,
} = dataLayersSlice.actions;

export default dataLayersSlice.reducer;

// Selector functions
// return only the currently visible layers
export const selectVisibleLayers = (state) =>
  state.dataLayers.layers.filter((layer) => layer.visibility);

// return a memoized flat array of just the visible dataLayer IDs
export const selectVisibleLayerIds = createSelector(
  (state) => state.dataLayers.layers,
  (items) => {
    const layerIds = items
      .filter((layer) => layer.visibility)
      .map((layer) => layer.id);
    return layerIds;
  }
);

// return a flat array of just the dataLayer IDs that are interactive with Mapbox Layer propery
export const selectInteractiveLayerIds = (state) => {
  const layerIds = state.dataLayers.layers
    .filter((layer) => layer.visibility)
    .filter((layer) => layer.interactiveLayer)
    .map((layer) => layer.id);
  return layerIds;
};

// return a flat array of just the dataLayer IDs that have a Legend pane
/*
export const selectLayerLegendIds = (state) => {
  const layerIds = state.dataLayers.layers
    .filter((layer) => layer.legendVisibility)
    .map((layer) => layer.id);
  return layerIds;
};*/

export const selectLayerLegendIds = createSelector(
  (state) => state.dataLayers.layers,
  (items) => {
    const activeLegends = items
      .filter((layer) => layer.legendVisibility && layer.visibility)
      .map((layer) => layer.id);

    return activeLegends;
  }
);

// return max/mean value selection
export const selectMaxMeanOption = (state) => state.dataLayers.showMaxMean;
