import { CourseUploadDTO } from "@domain/reqs_dtos/CourseUploadDTO";
import { createSlice } from "@reduxjs/toolkit";

const coursesData = createSlice({
  name: "coursesData",
  initialState: { ...new CourseUploadDTO({}) },
  reducers: {
    setCourseData: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    removeCoursesData: (state) => {
      return { ...new CourseUploadDTO({}) };
    },
  },
});

export const { setCourseData, removeCoursesData } = coursesData.actions;
export default coursesData.reducer;
