/* eslint-disable no-unused-vars */
import React from "react";
import { FormControl, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { changeSpeciesVisibility } from "./habSpeciesSlice";
import HabSpeciesSelectByType from "./HabSpeciesSelectByType";

export default function HabSpeciesSelect() {
  const habSpecies = useSelector((state) => state.habSpecies.species);
  //const habEnvironments = useSelector(state => state.habSpecies.enviroments);
  const habTypes = useSelector((state) => state.habSpecies.species_types);
  const dispatch = useDispatch();
  const error = habSpecies.filter((item) => item.visibility).length > 6;
  const limitReached = habSpecies.filter((item) => item.visibility).length >= 6;

  return (
    <div>
      <Typography variant="subtitle1" display="block" gutterBottom>
        Algal Species/Syndrome
      </Typography>

      <Typography
        variant="body2"
        display="block"
        gutterBottom
        sx={{ width: "95%" }}
      >
        Choose up to <strong>6 species</strong> to display on the map at one
        time. Click on the color box to change color palette.
      </Typography>

      <FormControl
        required
        error={error}
        component="fieldset"
        sx={{ width: "100%", mt: 2 }}
      >
        {habTypes.map((item) => (
          <>
            <HabSpeciesSelectByType
              key={item}
              species_type={item}
              limitReached={limitReached}
            />
          </>
        ))}
      </FormControl>
    </div>
  );
}
