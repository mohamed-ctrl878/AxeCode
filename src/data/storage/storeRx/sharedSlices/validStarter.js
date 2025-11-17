import { createSlice } from "@reduxjs/toolkit";

const validStarter = createSlice({
  name: "validStarter",
  initialState: {
    start: false,
    fetchState: false,
    success: false,
    loader: false,
  },
  reducers: {
    go: (state) => {
      state.start = true;
    },
    stop: (state) => {
      state.start = false;
    },
    goFetch: (state) => {
      state.fetchState = true;
    },
    stopFetch: (state) => {
      state.fetchState = false;
    },
    goSuccess: (state) => {
      state.success = true;
    },
    stopSuccess: (state) => {
      state.success = false;
    },
    goLoader: (state) => {
      state.loader = true;
    },
    stopLoader: (state) => {
      state.loader = false;
    },
  },
});

export const {
  go,
  stop,
  goFetch,
  stopFetch,
  goSuccess,
  stopSuccess,
  goLoader,
  stopLoader,
} = validStarter.actions;
export default validStarter.reducer;
