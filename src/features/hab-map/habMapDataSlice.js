import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
// local
import { GRID_HIGHLIGHT_COLORS } from "../../Constants";
const MAP_LATITUDE = parseFloat(import.meta.env.VITE_MAP_LATITUDE);
const MAP_LONGITUDE = parseFloat(import.meta.env.VITE_MAP_LONGITUDE);

// the first shade not already taken by a highlighted square, so each open
// square keeps its own color. Shades are reused once more squares are open
// than there are colors
function getNextHighlightColor(selectedGridSquares) {
  const usedColors = selectedGridSquares.map(
    (gridSquare) => gridSquare.highlightColor
  );
  const freeColor = GRID_HIGHLIGHT_COLORS.find(
    (color) => !usedColors.includes(color)
  );
  if (freeColor) {
    return freeColor;
  }
  const colorIndex = selectedGridSquares.length % GRID_HIGHLIGHT_COLORS.length;
  return GRID_HIGHLIGHT_COLORS[colorIndex];
}

const initialState = {
  latitude: MAP_LATITUDE,
  longitude: MAP_LONGITUDE,
  zoom: 5,
  activeFeatures: [],
  // Spatial Grid square the user is pointing at, and the ones they clicked to
  // keep highlighted. Each holds { geohash, longitude, latitude } and the
  // selected ones also carry the highlightColor their points are drawn in
  hoveredGridSquare: null,
  selectedGridSquares: [],
};

export const habMapDataSlice = createSlice({
  name: "habMapData",
  initialState: initialState,
  reducers: {
    changeMapData: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.zoom = action.payload.zoom;
    },
    addFeature(state, action) {
      // the data windows are keyed by feature id, so a feature that already has
      // a window open is ignored rather than opening a duplicate
      const isOpen = state.activeFeatures.some(
        (feature) => feature.id === action.payload.id
      );
      if (!isOpen) {
        state.activeFeatures.push(action.payload);
      }
    },
    deleteFeature(state, action) {
      const newFeatures = state.activeFeatures.filter(
        (feature) => feature.id !== action.payload
      );
      // "Mutate" the existing state to save the new array
      state.activeFeatures = newFeatures;
      // a Spatial Grid square uses its geohash as the feature id, so closing
      // its data window also drops the highlight pinned by the same click
      state.selectedGridSquares = state.selectedGridSquares.filter(
        (gridSquare) => gridSquare.geohash !== action.payload
      );
    },
    setAllFeatures(state, action) {
      // set all active features to new array
      state.activeFeatures = action.payload;
    },
    setHoveredGridSquare(state, action) {
      state.hoveredGridSquare = action.payload;
    },
    addSelectedGridSquare(state, action) {
      // several squares stay highlighted at once, one per open data window
      const isSelected = state.selectedGridSquares.some(
        (gridSquare) => gridSquare.geohash === action.payload.geohash
      );
      if (!isSelected) {
        state.selectedGridSquares.push({
          ...action.payload,
          highlightColor: getNextHighlightColor(state.selectedGridSquares),
        });
      }
    },
    toggleSelectedGridSquare(state, action) {
      // clicking the square that is already pinned clears its highlight
      const gridSquare = action.payload;
      if (!gridSquare) {
        return;
      }
      const isSelected = state.selectedGridSquares.some(
        (item) => item.geohash === gridSquare.geohash
      );
      if (isSelected) {
        state.selectedGridSquares = state.selectedGridSquares.filter(
          (item) => item.geohash !== gridSquare.geohash
        );
      } else {
        state.selectedGridSquares.push({
          ...gridSquare,
          highlightColor: getNextHighlightColor(state.selectedGridSquares),
        });
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeMapData,
  addFeature,
  deleteFeature,
  setAllFeatures,
  setHoveredGridSquare,
  addSelectedGridSquare,
  toggleSelectedGridSquare,
} = habMapDataSlice.actions;

export default habMapDataSlice.reducer;

// Selector functions
// return all active features
export const selectActiveFeatues = (state) => state.habMapData.activeFeatures;

// return whether a feature already has a data window open
export const selectIsFeatureOpen = (state, featureID) =>
  state.habMapData.activeFeatures.some((feature) => feature.id === featureID);

// return the shade an open Spatial Grid square is highlighted in, so its data
// window can be banded in the same color. A square uses its geohash as the
// feature id of its window
export const selectGridSquareHighlightColor = (state, geohash) =>
  state.habMapData.selectedGridSquares.find(
    (gridSquare) => gridSquare.geohash === geohash
  )?.highlightColor;

// return every Spatial Grid square to highlight. Each clicked square stays
// highlighted in its own shade, and pointing at another previews it alongside
// them in the next free shade
export const selectActiveGridSquares = createSelector(
  (state) => state.habMapData.selectedGridSquares,
  (state) => state.habMapData.hoveredGridSquare,
  (selectedGridSquares, hoveredGridSquare) => {
    if (
      !hoveredGridSquare ||
      selectedGridSquares.some(
        (gridSquare) => gridSquare.geohash === hoveredGridSquare.geohash
      )
    ) {
      return selectedGridSquares;
    }
    return [
      ...selectedGridSquares,
      {
        ...hoveredGridSquare,
        highlightColor: getNextHighlightColor(selectedGridSquares),
      },
    ];
  }
);
