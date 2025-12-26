import { WeekUploadDTO } from "@domain/reqs_dtos/WeekUploadDTO";
import { createSlice } from "@reduxjs/toolkit";

const weeksData = createSlice({
  name: "weeksData",
  initialState: { ...new WeekUploadDTO({}) },
  reducers: {
    setWeekData: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    removeWeekData: (state) => {
      return { ...new WeekUploadDTO({}) };
    },
  },
});

export const { setWeekData, removeWeekData } = weeksData.actions;
export default weeksData.reducer;
