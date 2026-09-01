/* eslint-disable no-unused-vars */
import React from "react";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  changeSpeciesVisibility,
  changeSpeciesColor,
  selectSpeciesByEnvironment,
} from "./habSpeciesSlice";
import SpeciesColorSwatch from "./SpeciesColorSwatch";
import HabSpeciesNameDisplay from "./HabSpeciesNameDisplay";

export default function HabSpeciesSelectByEnv({ environment, limitReached }) {
  const dispatch = useDispatch();

  const speciesList = useSelector((state) =>
    selectSpeciesByEnvironment(state, environment)
  );

  const handleSpeciesSelect = (event, species) => {
    dispatch(
      changeSpeciesVisibility({
        checked: event.target.checked,
        species: species,
      })
    );
  };

  if (!speciesList.length) {
    return null;
  }
  return (
    <>
      <FormLabel component="legend">{environment}</FormLabel>
      <FormGroup sx={{ overflowY: "scroll", mb: 2 }}>
        {speciesList.map((species) => {
          return (
            <FormControlLabel
              key={species.id}
              control={
                <Checkbox
                  color="primary"
                  checked={species.visibility}
                  onChange={(event) => handleSpeciesSelect(event, species)}
                  name={species.speciesName}
                  disabled={limitReached && !species.visibility}
                />
              }
              label={
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  {" "}
                  <SpeciesColorSwatch
                    value={species.primaryColor}
                    onChange={(hex) =>
                      dispatch(
                        changeSpeciesColor({
                          primaryColor: hex,
                          species: species,
                        })
                      )
                    }
                  />
                  <HabSpeciesNameDisplay species={species} />
                </Typography>
              }
            />
          );
        })}
      </FormGroup>
    </>
  );
}
