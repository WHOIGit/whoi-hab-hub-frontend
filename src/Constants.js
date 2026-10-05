// Date Layer IDs to match with Redux store
export const DATA_LAYERS = {
  biovolumeSpatialGridLayer: "biovolume_spatialgrid_layer",
  cellConcentrationSpatialGridLayer: "cell_concentration_spatialgrid_layer",
  stationsLayer: "stations_layer",
  closuresLayer: "closures_layer",
  closuresSeasonalLayer: "closures_seasonal_layer",
  closuresIconsLayer: "closures_layer_icons",
  closuresSeasonalIconsLayer: "closures_seasonal_layer_icons",
};

// The Data Layers this client can render, in the order they appear in the UI.
// Every layer needs its own map/legend components here, so this is the full set
// available. VITE_SHOW_DATALAYERS_LIST in the local .env picks which of them are
// active for a deployment.
export const DATA_LAYER_DEFINITIONS = [
  {
    id: DATA_LAYERS.biovolumeSpatialGridLayer,
    name: "Biovolume (Spatial Grid)",
  },
  {
    id: DATA_LAYERS.cellConcentrationSpatialGridLayer,
    name: "Cell Concentration (Spatial Grid)",
  },
  {
    id: DATA_LAYERS.closuresLayer,
    name: "Shellfish Bed Closures (Event Triggered)",
  },
  {
    id: DATA_LAYERS.closuresSeasonalLayer,
    name: "Shellfish Bed Closures (Seasonal)",
  },
  {
    id: DATA_LAYERS.stationsLayer,
    name: "Shellfish Toxicity",
  },
];

export const INTERACTIVE_LAYERS = [
  DATA_LAYERS.closuresIconsLayer,
  DATA_LAYERS.closuresSeasonalIconsLayer,
];

export const METRIC_IDS = {
  biovolume: "biovolume",
  cellConcentration: "cell_concentration",
  shellfishToxicity: "shellfish_toxicity",
};

// define color palette for the species color picker options
export const PALETTE = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  yellow: "yellow",
  cyan: "cyan",
  lime: "lime",
  gray: "gray",
  orange: "orange",
  purple: "purple",
  black: "black",
  white: "white",
  pink: "pink",
  darkblue: "darkblue",
};

// Match available species environment options in API Target Species
export const ENVIRONMENTS = ["Marine", "Freshwater"];

// Match available species type options in API Target Species
export const SPECIES_TYPES = ["HAB", "Other"];

// Match available classifier agreement options in API IFCB Bins
export const AGREEMENT_OPTIONS = ["all", "majority", "any"];
export const DEFAULT_AGREEMENT = "majority";

// object of Component "types" to work with react-dnd drag and drop functionality
export const ITEM_TYPES = {
  PANE: "pane",
};
