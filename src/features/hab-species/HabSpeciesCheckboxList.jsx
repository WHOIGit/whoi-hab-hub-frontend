import React from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
// local
import { changeSpeciesVisibility, changeSpeciesColor } from "./habSpeciesSlice";
import SpeciesColorSwatch from "./SpeciesColorSwatch";
import HabSpeciesNameDisplay from "./HabSpeciesNameDisplay";

// the species checkboxes for one group, used for a species type and for each
// subtype group inside it
export default function HabSpeciesCheckboxList({ speciesList, limitReached }) {
  const dispatch = useDispatch();

  const handleSpeciesSelect = (event, species) => {
    dispatch(
      changeSpeciesVisibility({
        checked: event.target.checked,
        species: species,
      })
    );
  };

  return (
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
              <Typography variant="body2" color="textSecondary" component="span">
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
  );
}
