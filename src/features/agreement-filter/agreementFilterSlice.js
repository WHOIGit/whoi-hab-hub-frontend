import { createSlice } from "@reduxjs/toolkit";
// local
import { AGREEMENT_OPTIONS, DEFAULT_AGREEMENT } from "../../Constants";

let INITIAL_AGREEMENT = DEFAULT_AGREEMENT;
// eslint-disable-next-line no-undef
if (AGREEMENT_OPTIONS.includes(import.meta.env.VITE_INITIAL_AGREEMENT)) {
  // eslint-disable-next-line no-undef
  INITIAL_AGREEMENT = import.meta.env.VITE_INITIAL_AGREEMENT;
}

const initialState = {
  agreement: INITIAL_AGREEMENT,
};

export const agreementFilterSlice = createSlice({
  name: "agreementFilter",
  initialState: initialState,
  reducers: {
    changeAgreement: (state, action) => {
      state.agreement = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeAgreement } = agreementFilterSlice.actions;

export default agreementFilterSlice.reducer;

// Selector functions
// return the current classifier agreement option
export const selectAgreementOption = (state) => state.agreementFilter.agreement;
