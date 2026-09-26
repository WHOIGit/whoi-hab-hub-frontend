import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Source, Layer, Popup } from 'react-map-gl';
import { format, parseISO } from "date-fns";
import axiosInstance from "../../app/apiAxios";

// Cycled through so each cruise track in the results gets a distinct color
const TRACK_COLORS = ["#007cbf", "#e6550d", "#31a354", "#756bb1", "#d62728", "#17becf"];

export default function CruiseTrackMarkers({ onMarkerClick, metricID, layerID, selectedPoint, setSelectedPoint }) {
  const habSpecies = useSelector((state) => state.habSpecies.species);
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
          smoothing_factor: 6,
        });
        const res = await axiosInstance.get("api/v1/cruise-tracks/", { params });
        setIsLoaded(true);
        setResults(res.data);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    }
    fetchResults();
  }, [dateFilter]);

  // 2. Flatten every cruise in the results into a single FeatureCollection, tagging
  // each feature with its cruise so two layers can render all of them at once
  const geoJsonData = useMemo(() => {
    if (!results) return null;

    const features = results.flatMap((cruise, i) => {
      const points = cruise.bins?.features ?? [];
      const color = TRACK_COLORS[i % TRACK_COLORS.length];
      // cruise-level fields carried onto every feature so they're available on click
      const cruiseProps = {
        cruiseId: cruise.id ?? i,
        cruiseName: cruise.name,
        cruiseLocation: cruise.location,
      };

      const waypoints = points.map((p) => ({
        ...p,
        properties: { ...p.properties, ...cruiseProps, type: 'waypoint', color },
      }));

      if (points.length < 2) return waypoints;

      const line = {
        type: 'Feature',
        properties: { ...cruiseProps, type: 'track-line', color },
        geometry: {
          type: 'LineString',
          // slice(0, 2) drops any elevation/M value the API may include
          coordinates: points.map((p) => p.geometry.coordinates.slice(0, 2)),
        },
      };
      return [line, ...waypoints];
    });

    return { type: 'FeatureCollection', features };
  }, [results]);

  // 3. Layer styles (GPU rendered), colored per cruise off the feature properties
  const lineStyle = {
    id: 'track-line-layer',
    type: 'line',
    filter: ['==', ['get', 'type'], 'track-line'], // Only draw the line features
    paint: { 'line-color': ['get', 'color'], 'line-width': 4 }
  };

  const pointStyle = {
    id: 'waypoints-layer',
    type: 'circle',
    filter: ['==', ['get', 'type'], 'waypoint'],  // Only draw point features
    paint: {
      'circle-radius': 6,
      'circle-color': ['get', 'color'],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  };

  // MapLibre flattens array/object properties to JSON strings on the way back out
  // of queryRenderedFeatures, so speciesFound needs parsing before it can be listed
  const speciesFound = useMemo(() => {
    if (!selectedPoint?.speciesFound) return [];
    let ids = selectedPoint.speciesFound;
    if (typeof ids === "string") {
      try {
        ids = JSON.parse(ids);
      } catch {
        return [];
      }
    }
    return habSpecies.filter((species) => ids.includes(species.id));
  }, [selectedPoint, habSpecies]);


  return (
    <div>
      {geoJsonData && (
        <Source id="track-data" type="geojson" data={geoJsonData}>
          <Layer {...lineStyle} />
          <Layer {...pointStyle} />
        </Source>
      )}
      

        {selectedPoint && (
          <Popup
            longitude={selectedPoint.lng}
            latitude={selectedPoint.lat}
            anchor="bottom"
            onClose={() => setSelectedPoint(null)}
            closeOnClick={false}
          >
            <div style={{ fontFamily: 'sans-serif', padding: '2px' }}>
              <h3 style={{ margin: '0 0 2px 0', fontSize: '14px' }}>
                {selectedPoint.cruiseName}
              </h3>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#555' }}>
                {selectedPoint.cruiseLocation}
              </p>
              {selectedPoint.sampleTime && (
                <p style={{ margin: '0 0 4px 0', fontSize: '12px' }}>
                  {format(parseISO(selectedPoint.sampleTime), "MMM d, yyyy h:mm a")}
                </p>
              )}
              {speciesFound.length > 0 && (
                <ul style={{ margin: '0 0 4px 0', padding: 0, listStyle: 'none' }}>
                  {speciesFound.map((species) => (
                    <li
                      key={species.id}
                      style={{ fontSize: '12px', color: species.colorPrimary }}
                    >
                      {species.speciesName}
                    </li>
                  ))}
                </ul>
              )}
              <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>
                {selectedPoint.pid}
              </p>
            </div>
          </Popup>
        )}
    </div>
  );
}
