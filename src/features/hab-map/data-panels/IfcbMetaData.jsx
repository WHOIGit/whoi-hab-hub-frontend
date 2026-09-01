import React, { useState, useEffect } from "react";
import { Typography, Button, Grid, CircularProgress, Box } from "@mui/material";

import axiosInstance from "../../../app/apiAxios";

const IfcbMetaData = ({ metaDataUrl, chartExpanded }) => {
  const [pointImgData, setPointImgData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);

  const gridSize = chartExpanded ? 3 : 6;

  useEffect(() => {
    console.log(metaDataUrl);
    async function fetchResults() {
      try {
        const res = await axiosInstance.get(metaDataUrl);
        console.log(res.request.responseURL);
        setIsLoaded(true);
        setPointImgData(res.data);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    }
    fetchResults();
  }, [metaDataUrl]);

  return (
    <div>
      {!pointImgData && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      )}

      {pointImgData && (
        <div>
          <div>
            <Grid container spacing={3}>
              <Grid item xs>
                <Typography variant="h6">
                  <em>{pointImgData.species}</em>
                </Typography>
                <Typography variant="body2">
                  IFCB Bin: {pointImgData.bin.pid}
                </Typography>
              </Grid>
              <Grid item xs style={{ textAlign: "right" }}>
                <Button
                  size="small"
                  color="primary"
                  href={`${pointImgData.bin.datasetLink}/bin?dataset=${pointImgData.bin.datasetId}&bin=${pointImgData.bin.pid}`}
                  target="_blank"
                >
                  IFCB Dashboard source link
                </Button>
              </Grid>
            </Grid>
          </div>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <Grid container spacing={2}>
              {pointImgData.images.map((image) => (
                <Grid item xs={gridSize} key={image}>
                  <img
                    src={image}
                    alt={pointImgData.species}
                    style={{ maxWidth: "100%" }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      )}
    </div>
  );
};

export default IfcbMetaData;
