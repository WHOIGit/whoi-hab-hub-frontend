import React, { useState } from "react";
import { FormLabel, Collapse, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useSelector } from "react-redux";
// local
import { selectSpeciesByType } from "./habSpeciesSlice";
import HabSpeciesCheckboxList from "./HabSpeciesCheckboxList";
import { SPECIES_SUBTYPES, SPECIES_TYPE_LABELS } from "../../Constants";

export default function HabSpeciesSelectByType({ species_type, limitReached }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  // the heading is a FormLabel so it matches the other headings, so it needs
  // the keyboard handling a button would have given it
  const handleHeadingKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOpen();
    }
  };

  const speciesList = useSelector((state) =>
    selectSpeciesByType(state, species_type)
  );

  if (!speciesList.length) {
    return null;
  }

  const typeLabel = SPECIES_TYPE_LABELS[species_type] || species_type;

  // Only "Other" species carry a subtype. Those are grouped into sub lists in
  // a collapsible section, so the long list stays out of the way until asked
  // for. Any other species type is a plain list
  const hasSubtypes = speciesList.some((species) => species.speciesSubtype);

  if (!hasSubtypes) {
    return (
      <>
        <FormLabel component="legend">{typeLabel}</FormLabel>
        <HabSpeciesCheckboxList
          speciesList={speciesList}
          limitReached={limitReached}
        />
      </>
    );
  }

  // group by subtype in the order they are listed in Constants, dropping any
  // subtype that has no species
  const subtypeGroups = SPECIES_SUBTYPES.map((subtype) => ({
    subtype: subtype,
    speciesList: speciesList.filter(
      (species) => species.speciesSubtype === subtype
    ),
  })).filter((group) => group.speciesList.length);

  return (
    <>
      <FormLabel
        component="legend"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={handleHeadingKeyDown}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
        }}
      >
        {typeLabel}
        {open ? (
          <ExpandLess fontSize="small" />
        ) : (
          <ExpandMore fontSize="small" />
        )}
      </FormLabel>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {subtypeGroups.map((group) => (
          <React.Fragment key={group.subtype}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              {group.subtype}
            </Typography>
            <HabSpeciesCheckboxList
              speciesList={group.speciesList}
              limitReached={limitReached}
            />
          </React.Fragment>
        ))}
      </Collapse>
    </>
  );
}
