import { LessonUploadDTO } from "@data/models/LessonDTOs/LessonUploadDTO";
import { createSlice } from "@reduxjs/toolkit";

const lessonsData = createSlice({
  name: "lessonsData",
  initialState: { ...new LessonUploadDTO({}) },
  reducers: {
    setLessonData: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setLessonData } = lessonsData.actions;
export default lessonsData.reducer;
