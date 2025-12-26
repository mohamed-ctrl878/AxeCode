import { LessonUploadDTO } from "@domain/reqs_dtos/LessonUploadDTO";
import { createSlice } from "@reduxjs/toolkit";

const lessonsData = createSlice({
  name: "lessonsData",
  initialState: { ...new LessonUploadDTO({}) },
  reducers: {
    setLessonData: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    removeLessonData: (state) => {
      return { ...new LessonUploadDTO({}) };
    },
  },
});

export const { setLessonData,removeLessonData } = lessonsData.actions;
export default lessonsData.reducer;
