// Bins in a grid square can all come from one fixed deployment, or be spread
// across the square by a moving platform. Bins that all sit within a quarter
// mile of each other are treated as a single location, so the graph can show
// them as a time series line instead of a scatter plot.
export const QUARTER_MILE_METERS = 402.336;

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// great circle distance between two [longitude, latitude] pairs, in meters
function haversineDistance([lng1, lat1], [lng2, lat2]) {
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

// True when every Bin in the timeseries falls within the given radius of the
// others. The corners of the bounding box are at least as far apart as any two
// Bins, so a single distance check covers the whole set.
export function isSingleLocation(
  timeseriesData,
  radiusMeters = QUARTER_MILE_METERS
) {
  // each species series holds the same Bins, so only the first one is measured
  const points = timeseriesData?.length ? timeseriesData[0].data : [];

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  let found = 0;

  points?.forEach((item) => {
    if (!Number.isFinite(item.latitude) || !Number.isFinite(item.longitude)) {
      return;
    }
    found += 1;
    minLat = Math.min(minLat, item.latitude);
    maxLat = Math.max(maxLat, item.latitude);
    minLng = Math.min(minLng, item.longitude);
    maxLng = Math.max(maxLng, item.longitude);
  });

  // no Bin locations to group on, keep the scatter plot
  if (!found) {
    return false;
  }

  return (
    haversineDistance([minLng, minLat], [maxLng, maxLat]) <= radiusMeters
  );
}
