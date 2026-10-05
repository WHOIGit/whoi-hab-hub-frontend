import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";
import { format, parseISO } from "date-fns";
// local
import SidePane from "./SidePane";
import axiosInstance from "../../../app/apiAxios";
import { DATA_LAYERS } from "../../../Constants";
import { selectDateFilter } from "../../date-filter/dateFilterSlice";
import { selectAgreementOption } from "../../agreement-filter/agreementFilterSlice";

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
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState();
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    // Need to check different properties to see whether the API result has data for time frame
    function hasData(result, dataLayer) {
      if (dataLayer !== DATA_LAYERS.closuresLayer) {
        result.properties.maxMeanValues.length
          ? setHasData(true)
          : setHasData(false);
      }
    }

    async function fetchResults() {
      try {
        let endpoint;
        let smoothingFactor = dateFilter.smoothingFactor;
        // only the v2 IFCB endpoints support the model agreement filter
        let useAgreement = false;
        if (dataLayer === DATA_LAYERS.stationsLayer) {
          endpoint = `api/v1/stations/${featureID}/`;
          // Force smoothing_factor to be ignored for Station graphs
          smoothingFactor = 1;
        } else if (
          dataLayer === DATA_LAYERS.cellConcentrationSpatialGridLayer ||
          dataLayer === DATA_LAYERS.biovolumeSpatialGridLayer
        ) {
          endpoint = `api/v2/ifcb-spatial-grid/${featureID}/`;
          useAgreement = true;
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

        if (useAgreement) {
          params.append("agreement", agreement);
        }

        const res = await axiosInstance.get(endpoint, {
          params,
        });
        console.log(res.request.responseURL);
        setIsLoaded(true);
        setResults(res.data);
        hasData(res.data, dataLayer);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    }
    fetchResults();
  }, [featureID, dataLayer, dateFilter, metricID, agreement]);

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
