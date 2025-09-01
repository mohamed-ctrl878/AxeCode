import { createSlice } from "@reduxjs/toolkit";

const sliceForfillTestCases = createSlice({
  name: "sliceForfillTestCases",
  initialState: { fill: false },
  reducers: {
    fillCases: (state) => {
      state.fill = true;
      return state;
    },
    clearCases: (state) => {
      state.fill = false;
      return state;
    },
  },
});

export const { fillCases, clearCases } = sliceForfillTestCases.actions;
export default sliceForfillTestCases.reducer;
