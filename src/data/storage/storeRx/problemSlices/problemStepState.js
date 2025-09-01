import { createSlice } from "@reduxjs/toolkit";

const problemStepState = createSlice({
  name: "stateOfCurrentStep",
  initialState: { state: false },
  reducers: {
    valid: (state) => {
      state.state = true;
    },
    unValid: (state) => {
      state.state = false;
    },
  },
});

export const { valid, unValid } = problemStepState.actions;

export default problemStepState.reducer;
