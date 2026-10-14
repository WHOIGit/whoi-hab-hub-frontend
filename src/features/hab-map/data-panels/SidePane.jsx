import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import { Close, OpenWith, Minimize } from "@mui/icons-material";
// local
import StationsGraph from "./StationsGraph";
import IfcbGraph from "./IfcbGraph";
import ClosuresList from "./ClosuresList";
import { selectVisibleSpecies } from "../../hab-species/habSpeciesSlice";
import { selectGridSquareHighlightColor } from "../habMapDataSlice";
import { DATA_LAYERS, METRIC_IDS } from "../../../Constants";

const expandWidth = window.outerWidth - 420;

// readable text for a banner, the highlight shades run from light yellow to
// deep orange so the darker ones need light text
function getBannerTextColor(backgroundColor) {
  const [red, green, blue] = [1, 3, 5].map((index) =>
    parseInt(backgroundColor.slice(index, index + 2), 16)
  );
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.6 ? "#212121" : "white";
}

const rootSx = {
  margin: 1,
  width: 600,
  transition: "all 0.3s",
};

const expandSx = {
  position: "fixed",
  top: 0,
  left: 10,
  width: expandWidth,
  height: "95vh",
  zIndex: 3000,
  overflowY: "scroll",
};

const expandContentSx = {
  width: expandWidth,
  height: "80%",
};

export default function SidePane({
  results,
  featureID,
  dataLayer,
  yAxisScale,
  onPaneClose,
  metricID,
}) {
  const habSpecies = useSelector(selectVisibleSpecies);
  // Spatial Grid windows are banded in the shade their points are highlighted
  // in on the map, the other data layers have no highlight
  const highlightColor = useSelector((state) =>
    selectGridSquareHighlightColor(state, featureID)
  );
  const [expandPane, setExpandPane] = useState(false);
  const [visibleResults, setVisibleResults] = useState([]);

  useEffect(() => {
    // Filter the results to only visible species to pass to the Graph

    if (metricID && metricID !== METRIC_IDS.shellfishToxicity) {
      const data = results.properties.timeseriesData;
      const visibleSpecies = habSpecies
        .filter((species) => species.visibility)
        .map((species) => species.id);

      const filteredData = data.filter((item) =>
        visibleSpecies.includes(item.species)
      );
      setVisibleResults(filteredData);
    }
  }, [results, habSpecies, metricID]);

  function onExpandPanel() {
    setExpandPane(!expandPane);
  }

  let title;
  let subTitle;

  if (dataLayer === DATA_LAYERS.stationsLayer) {
    title = `Station Toxicity Data: ${results.properties?.stationLocation}`;
    subTitle = `
      Station Name: ${results.properties?.station_name} |
      Lat: ${results.geometry.coordinates[1]} Long: ${results.geometry.coordinates[0]}
    `;
  } else if (
    dataLayer === DATA_LAYERS.closuresLayer ||
    dataLayer === DATA_LAYERS.closuresSeasonalLayer
  ) {
    title = `Shellfish Closure: ${results.properties?.name}`;
    subTitle = `
      State: ${results.properties?.state} |
      ${results.properties?.areaDescription}
    `;
  } else if (
    dataLayer === DATA_LAYERS.cellConcentrationSpatialGridLayer ||
    dataLayer === DATA_LAYERS.biovolumeSpatialGridLayer
  ) {
    // calculate approx grid area. 1 degicmal degree = 111 km
    // let gridArea = Math.pow(gridLength * 111, 2);
    title = `Grid Center Point | Lat: ${results.geometry.coordinates[1]}, Long: ${results.geometry.coordinates[0]}`;
    //subTitle = `Grid Area (km<sup>2</sup): ${gridArea}`;
  } else {
    title = `IFCB Data: ${results.properties?.name}`;
    subTitle = `
      ${results.properties?.location} |
      Lat: ${results.geometry.coordinates[1]} Long: ${results.geometry.coordinates[0]}
    `;
  }

  // band the header in the highlight shade, falling back to the plain header
  const bannerSx = highlightColor
    ? { backgroundColor: highlightColor }
    : undefined;
  const bannerTextColor = highlightColor
    ? getBannerTextColor(highlightColor)
    : (theme) => theme.palette.primary.main;
  const bannerControlSx = highlightColor
    ? { color: bannerTextColor }
    : undefined;

  return (
    <Card sx={[rootSx, expandPane && expandSx]}>
      <CardHeader
        slotProps={{
          root: {
            sx: bannerSx,
          },
          title: {
            sx: {
              color: bannerTextColor,
              fontSize: "1.2rem",
            },
          },
          subheader: {
            sx: bannerControlSx,
          },
        }}
        action={
          <React.Fragment>
            <IconButton
              onClick={() => onExpandPanel()}
              aria-label="expand"
              sx={bannerControlSx}
            >
              {expandPane ? <Minimize /> : <OpenWith />}
            </IconButton>
            <IconButton
              onClick={() => onPaneClose(featureID)}
              aria-label="close"
              sx={bannerControlSx}
            >
              <Close />
            </IconButton>
          </React.Fragment>
        }
        title={title}
        subheader={subTitle}
      />

      <CardContent sx={expandPane ? expandContentSx : undefined}>
        {dataLayer === DATA_LAYERS.stationsLayer && (
          <StationsGraph
            results={results}
            chartExpanded={expandPane}
            yAxisScale={yAxisScale}
          />
        )}
        {metricID &&
          metricID !== METRIC_IDS.shellfishToxicity &&
          visibleResults && (
            <IfcbGraph
              visibleResults={visibleResults}
              metricID={metricID}
              chartExpanded={expandPane}
              yAxisScale={yAxisScale}
              dataLayer={dataLayer}
            />
          )}
        {(dataLayer === DATA_LAYERS.closuresLayer ||
          dataLayer === DATA_LAYERS.closuresSeasonalLayer) && (
          <ClosuresList results={results} />
        )}
      </CardContent>
    </Card>
  );
}
