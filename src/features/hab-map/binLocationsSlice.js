import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { format, parseISO } from "date-fns";
// local
import axiosInstance from "../../app/apiAxios";

let LIMIT_DATA_START_DATE = null;
// eslint-disable-next-line no-undef
if (import.meta.env.VITE_LIMIT_DATA_START_DATE) {
  LIMIT_DATA_START_DATE = import.meta.env.VITE_LIMIT_DATA_START_DATE;
}

// The Bin locations are used by both the Plankton Image Locations layer and the
// Spatial Grid highlight, so they are fetched once into the store and shared.
// The query string doubles as the key for the locations currently in the store
function buildRequestKey(dateFilter) {
  const params = new URLSearchParams({
    start_date: format(parseISO(dateFilter.startDate), "yyyy-MM-dd"),
    end_date: format(parseISO(dateFilter.endDate), "yyyy-MM-dd"),
    seasonal: dateFilter.seasonal,
    exclude_month_range: dateFilter.excludeMonthRange,
  });

  if (LIMIT_DATA_START_DATE) {
    params.append("limit_start_date", LIMIT_DATA_START_DATE);
  }
  return params.toString();
}

const fetchBinLocations = createAsyncThunk(
  "binLocations/fetchBinLocations",
  async (requestKey) => {
    const response = await axiosInstance.get(
      `api/v2/ifcb-bin-locations/?${requestKey}`
    );
    return response.data;
  },
  {
    condition: (requestKey, { getState }) => {
      const { binLocations } = getState();
      // skip the request when these same locations are already loaded, or are
      // already on the way for another component
      return (
        binLocations.requestKey !== requestKey ||
        binLocations.status === "failed"
      );
    },
  }
);

// load the Bin locations for the current date filter, if they aren't loaded yet
export const loadBinLocations = () => (dispatch, getState) =>
  dispatch(fetchBinLocations(buildRequestKey(getState().dateFilter)));

const initialState = {
  locations: null,
  requestKey: null,
  status: "idle",
  error: null,
};

export const binLocationsSlice = createSlice({
  name: "binLocations",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBinLocations.pending, (state, action) => {
        state.status = "loading";
        // claim the key now so a second component asking for the same locations
        // while this request is in flight doesn't start its own
        state.requestKey = action.meta.arg;
      })
      .addCase(fetchBinLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.locations = action.payload;
        state.error = null;
      })
      .addCase(fetchBinLocations.rejected, (state, action) => {
        state.status = "failed";
        state.locations = null;
        state.error = action.error.message;
      });
  },
});

export default binLocationsSlice.reducer;

// Selector functions
// return the GeoJSON FeatureCollection of Bin locations
export const selectBinLocations = (state) => state.binLocations.locations;
