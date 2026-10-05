import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Source, Layer } from "react-map-gl/maplibre";
import { format, parseISO } from "date-fns";

import axiosInstance from "../../app/apiAxios";

let LIMIT_DATA_START_DATE = null;
// eslint-disable-next-line no-undef
if (import.meta.env.VITE_LIMIT_DATA_START_DATE) {
  LIMIT_DATA_START_DATE = import.meta.env.VITE_LIMIT_DATA_START_DATE;
}

export default function IfcbBinLocationsLayer({ layerID }) {
  const dateFilter = useSelector((state) => state.dateFilter);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState();

  useEffect(() => {
    async function fetchResults() {
      try {
        const params = new URLSearchParams({
          start_date: format(parseISO(dateFilter.startDate), "yyyy-MM-dd"),
          end_date: format(parseISO(dateFilter.endDate), "yyyy-MM-dd"),
          seasonal: dateFilter.seasonal,
          exclude_month_range: dateFilter.excludeMonthRange,
        });

        if (LIMIT_DATA_START_DATE) {
          params.append("limit_start_date", LIMIT_DATA_START_DATE);
        }

        const res = await axiosInstance.get("api/v2/ifcb-bin-locations/", {
          params,
        });
        console.log(res.request.responseURL);
        setIsLoaded(true);
        setResults(res.data);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    }
    fetchResults();
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

  if (!results) {
    return null;
  }

  return (
    <Source
      id={layerID + "-src"}
      key={layerID + "-src"}
      type="geojson"
      data={results}
      buffer={10}
    >
      <Layer {...layerBinLocations} />
    </Source>
  );
}
