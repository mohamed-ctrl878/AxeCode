import { createSlice } from "@reduxjs/toolkit";

const sliceForValid = createSlice({
  name: "sliceForValid",
  initialState: { valid: false },

  reducers: {
    isValid: (state) => {
      state.valid = true;
      return state;
    },
    notValid: (state) => {
      state.valid = false;
      return state;
    },
  },
});

export const { isValid, notValid } = sliceForValid.actions;

export default sliceForValid.reducer;
