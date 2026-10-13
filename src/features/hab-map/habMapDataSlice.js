import { createSlice } from "@reduxjs/toolkit";
const MAP_LATITUDE = parseFloat(import.meta.env.VITE_MAP_LATITUDE);
const MAP_LONGITUDE = parseFloat(import.meta.env.VITE_MAP_LONGITUDE);

const initialState = {
  latitude: MAP_LATITUDE,
  longitude: MAP_LONGITUDE,
  zoom: 5,
  activeFeatures: [],
  // Spatial Grid square the user is pointing at, and the one they clicked to
  // keep highlighted. Each holds { geohash, longitude, latitude }
  hoveredGridSquare: null,
  selectedGridSquare: null,
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
      if (state.selectedGridSquare?.geohash === action.payload) {
        state.selectedGridSquare = null;
      }
    },
    setAllFeatures(state, action) {
      // set all active features to new array
      state.activeFeatures = action.payload;
    },
    setHoveredGridSquare(state, action) {
      state.hoveredGridSquare = action.payload;
    },
    setSelectedGridSquare(state, action) {
      state.selectedGridSquare = action.payload;
    },
    toggleSelectedGridSquare(state, action) {
      // clicking the square that is already pinned clears the highlight
      const gridSquare = action.payload;
      const isSelected =
        !!gridSquare &&
        state.selectedGridSquare?.geohash === gridSquare.geohash;
      state.selectedGridSquare = isSelected ? null : gridSquare;
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
  setSelectedGridSquare,
  toggleSelectedGridSquare,
} = habMapDataSlice.actions;

export default habMapDataSlice.reducer;

// Selector functions
// return all active features
export const selectActiveFeatues = (state) => state.habMapData.activeFeatures;

// return whether a feature already has a data window open
export const selectIsFeatureOpen = (state, featureID) =>
  state.habMapData.activeFeatures.some((feature) => feature.id === featureID);

// return the Spatial Grid square to highlight. Pointing at a square previews it
// without losing the one that was clicked
export const selectActiveGridSquare = (state) =>
  state.habMapData.hoveredGridSquare || state.habMapData.selectedGridSquare;
