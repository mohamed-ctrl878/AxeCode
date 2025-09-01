import { CourseUploadDTO } from "@data/models/courseDTOs/CourseUploadDTO";
import { createSlice } from "@reduxjs/toolkit";

const coursesData = createSlice({
  name: "coursesData",
  initialState: { ...new CourseUploadDTO({}) },
  reducers: {
    setCourseData: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setCourseData } = coursesData.actions;
export default coursesData.reducer;
