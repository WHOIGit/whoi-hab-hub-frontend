import React from "react";
import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import HabSpeciesColorChip from "./HabSpeciesColorChip";
import HabSpeciesNameDisplay from "./HabSpeciesNameDisplay";

export default function HabSpeciesList() {
  const habSpecies = useSelector((state) => state.habSpecies.species);

  return (
    <Grid container spacing={0}>
      {habSpecies.map((species) => {
        return (
          <>
            <Grid item xs={2}>
              <div>
                <HabSpeciesColorChip
                  species={species}
                  chipWidth={20}
                  chipHeight={20}
                  chipType="primary"
                />
              </div>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2" color="textSecondary">
                <HabSpeciesNameDisplay species={species} />
              </Typography>
            </Grid>
          </>
        );
      })}
    </Grid>
  );
}
