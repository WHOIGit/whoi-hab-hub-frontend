import React from "react";
import {
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
// local
import { AGREEMENT_OPTIONS } from "../../Constants";
import { changeAgreement, selectAgreementOption } from "./agreementFilterSlice";

// capitalized labels for the API agreement option values
const AGREEMENT_LABELS = {
  all: "All",
  majority: "Majority",
  any: "Any",
};

export default function AgreementSelect() {
  const agreement = useSelector(selectAgreementOption);
  const dispatch = useDispatch();

  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel component="legend">Classifier Agreement</FormLabel>
      <RadioGroup
        aria-label="Classifier Agreement"
        name="Classifier Agreement"
        value={agreement}
        onChange={(event) =>
          dispatch(
            changeAgreement({
              value: event.target.value,
            })
          )
        }
      >
        {AGREEMENT_OPTIONS.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio color="primary" />}
            label={
              <Typography variant="body2">
                {AGREEMENT_LABELS[option]}
              </Typography>
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
