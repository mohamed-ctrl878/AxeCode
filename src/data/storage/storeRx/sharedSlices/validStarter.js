import { createSlice } from "@reduxjs/toolkit";

const validStarter = createSlice({
  name: "validStarter",
  initialState: { start: false },
  reducers: {
    go: (state) => {
      state.start = true;
      return state;
    },
    stop: (state) => {
      state.start = false;
    },
  },
});

export const { go, stop } = validStarter.actions;
export default validStarter.reducer;
