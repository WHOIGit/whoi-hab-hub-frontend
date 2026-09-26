import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Source, Layer, Popup, Marker } from 'react-map-gl';
import { format, parseISO } from "date-fns";
import axiosInstance from "../../app/apiAxios";
import StationsMarkerIcon from "./StationsMarkerIcon";
import { selectMaxMeanOption } from "../data-layers/dataLayersSlice";

// 1. Mocking hundreds of static track points with custom popup metadata
const rawWaypoints = Array.from({ length: 300 }, (_, i) => ({
  id: i,
  name: `Waypoint #${i + 1}`,
  desc: `This is the description for track point index ${i}.`,
  // Generating a sample pathway around San Francisco
  lng: -122.486 + Math.sin(i * 0.05) * 0.02,
  lat: 37.833 + (i * 0.0001),
}));

export default function CruiseTrackMarkers({ onMarkerClick, metricID, layerID, selectedPoint, setSelectedPoint }) {
  const habSpecies = useSelector((state) => state.habSpecies.species);
  const dateFilter = useSelector((state) => state.dateFilter);

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState();

  // 2. Format data into a single clean FeatureCollection to send to the GPU
  const geoJsonData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: [
        // The Track Line feature
        {
          type: 'Feature',
          properties: { type: 'track-line' },
          geometry: {
            type: 'LineString',
            coordinates: rawWaypoints.map(p => [p.lng, p.lat]),
          },
        },
        // The individual waypoint point features packed with properties
        ...rawWaypoints.map(p => ({
          type: 'Feature',
          properties: { type: 'waypoint', id: p.id, name: p.name, desc: p.desc },
          geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        })),
      ],
    };
  }, []);

  // 3. Layer styles (GPU rendered)
  const lineStyle = {
    id: 'track-line-layer',
    type: 'line',
    filter: ['==', ['get', 'type'], 'track-line'], // Only draw the line feature
    paint: { 'line-color': '#007cbf', 'line-width': 4 }
  };

  const pointStyle = {
    id: 'waypoints-layer',
    type: 'circle',
    filter: ['==', ['get', 'type'], 'waypoint'],  // Only draw point features
    paint: {
      'circle-radius': 6,
      'circle-color': '#ff5a5f',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  };

  const onMapClick = (event) => {
    const features = event.target.queryRenderedFeatures(event.point, {
      layers: ['waypoints-layer'],
    });

    if (features.length > 0) {
      const clickedFeature = features[0];
      const { id, name, desc } = clickedFeature.properties;
      const [lng, lat] = clickedFeature.geometry.coordinates;
      setSelectedPoint({ id, name, desc, lng, lat });
    } else {
      setSelectedPoint(null);
    }
  };

  // 2. Turn the cursor into a pointer as soon as the mouse enters a point feature
  const onMouseEnter = useCallback(() => setCursorStyle('pointer'), []);

  // 3. Revert back to standard map grabbing when the mouse leaves a point feature
  const onMouseLeave = useCallback(() => setCursorStyle('grab'), []);


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
        const res = await axiosInstance.get("api/v1/stations/", { params });
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

  return (
    <div>
      <Source id="track-data" type="geojson" data={geoJsonData}>
          <Layer {...lineStyle} />
          <Layer {...pointStyle} />
        </Source>

        {selectedPoint && (
          <Popup
            longitude={selectedPoint.lng}
            latitude={selectedPoint.lat}
            anchor="bottom"
            onClose={() => setSelectedPoint(null)}
            closeOnClick={false}
          >
            <div style={{ fontFamily: 'sans-serif', padding: '2px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{selectedPoint.name}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>{selectedPoint.desc}</p>
            </div>
          </Popup>
        )}
    </div>
  );
}
