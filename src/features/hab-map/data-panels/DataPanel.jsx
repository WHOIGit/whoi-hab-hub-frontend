import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CircularProgress,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
// local
import SidePane from "./SidePane";
import axiosInstance from "../../../app/apiAxios";
import { DATA_LAYERS } from "../../../Constants";
import { selectDateFilter } from "../../date-filter/dateFilterSlice";
import { selectAgreementOption } from "../../agreement-filter/agreementFilterSlice";
import useSpeciesFilterRequest from "../../hab-species/useSpeciesFilterRequest";

let LIMIT_DATA_START_DATE = null;
// eslint-disable-next-line no-undef
if (import.meta.env.VITE_LIMIT_DATA_START_DATE) {
  LIMIT_DATA_START_DATE = import.meta.env.VITE_LIMIT_DATA_START_DATE;
}

export default function DataPanel({
  featureID,
  dataLayer,
  yAxisScale,
  onPaneClose,
  metricID,
  gridLength,
}) {
  //const dateFilter = useSelector((state) => state.dateFilter);
  const dateFilter = useSelector(selectDateFilter);
  const agreement = useSelector(selectAgreementOption);
  // only the v2 spatial grid endpoint takes the agreement and species filters
  const isSpatialGrid =
    dataLayer === DATA_LAYERS.cellConcentrationSpatialGridLayer ||
    dataLayer === DATA_LAYERS.biovolumeSpatialGridLayer;
  const filterKey = JSON.stringify({
    featureID,
    dataLayer,
    dateFilter,
    metricID,
    agreement,
  });
  const { speciesParam, claimFetch } = useSpeciesFilterRequest(filterKey);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState();
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    // Need to check different properties to see whether the API result has data for time frame
    function checkHasData(result, dataLayer) {
      if (
        dataLayer === DATA_LAYERS.closuresLayer ||
        dataLayer === DATA_LAYERS.closuresSeasonalLayer
      ) {
        return;
      }
      // the v2 spatial grid detail returns a timeseries per species, the v1
      // endpoints return maxMeanValues
      const { timeseriesData, maxMeanValues } = result.properties;
      if (timeseriesData) {
        setHasData(timeseriesData.some((item) => item.data?.length));
      } else {
        setHasData(Boolean(maxMeanValues?.length));
      }
    }

    async function fetchResults() {
      try {
        let endpoint;
        let smoothingFactor = dateFilter.smoothingFactor;
        if (dataLayer === DATA_LAYERS.stationsLayer) {
          endpoint = `api/v1/stations/${featureID}/`;
          // Force smoothing_factor to be ignored for Station graphs
          smoothingFactor = 1;
        } else if (
          dataLayer === DATA_LAYERS.cellConcentrationSpatialGridLayer ||
          dataLayer === DATA_LAYERS.biovolumeSpatialGridLayer
        ) {
          endpoint = `api/v2/ifcb-spatial-grid/${featureID}/`;
          // Match smoothing_factor for Spatial Grid graphs
          // smoothingFactor = 4;
        } else if (
          dataLayer === DATA_LAYERS.closuresLayer ||
          dataLayer === DATA_LAYERS.closuresSeasonalLayer
        ) {
          endpoint = `api/v1/closures/${featureID}/`;
        }

        const params = new URLSearchParams({
          start_date: format(parseISO(dateFilter.startDate), "yyyy-MM-dd"),
          end_date: format(parseISO(dateFilter.endDate), "yyyy-MM-dd"),
          seasonal: dateFilter.seasonal,
          exclude_month_range: dateFilter.excludeMonthRange,
          smoothing_factor: smoothingFactor,
          grid_level: gridLength,
        });

        if (LIMIT_DATA_START_DATE) {
          params.append("limit_start_date", LIMIT_DATA_START_DATE);
        }

        if (isSpatialGrid) {
          params.append("agreement", agreement);
          // only ask for the species that are selected
          params.append("species", speciesParam);
        }

        const res = await axiosInstance.get(endpoint, {
          params,
        });
        console.log(res.request.responseURL);
        setIsLoaded(true);
        setError(null);
        setResults(res.data);
        checkHasData(res.data, dataLayer);
      } catch (error) {
        setIsLoaded(true);
        // drop the previous results so a failed reload can't leave a stale
        // chart on screen looking like current data
        setResults(null);
        setError(error);
      }
    }
    // the chart only plots the selected species, so clearing one needs no new
    // data. The other data layers do not take a species filter
    if (isSpatialGrid && !claimFetch()) {
      return;
    }
    fetchResults();
  }, [filterKey, isSpatialGrid ? speciesParam : null]);

  return (
    <div>
      {!isLoaded && (
        <Box
          sx={{
            display: "flex",
            margin: 1,
            width: 600,
            height: 300,
            backgroundColor: "white",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Box sx={{ margin: "0 auto" }}>
            <CircularProgress />
          </Box>
        </Box>
      )}

      {isLoaded && error && (
        <Box
          sx={{
            margin: 1,
            width: 600,
            backgroundColor: "white",
            padding: 2,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="body2" color="error" sx={{ flexGrow: 1 }}>
            Could not load this data. Try changing the filters or close this
            panel.
          </Typography>
          <IconButton
            onClick={() => onPaneClose(featureID)}
            aria-label="close"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      {results && hasData && (
        <SidePane
          results={results}
          featureID={featureID}
          dataLayer={dataLayer}
          yAxisScale={yAxisScale}
          onPaneClose={onPaneClose}
          metricID={metricID}
        />
      )}
    </div>
  );
}
