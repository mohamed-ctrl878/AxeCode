import { configureStore } from "@reduxjs/toolkit";
import validStarter from "@data/storage/storeRx/sharedSlices/validStarter.js";
import coursesData from "@data/storage/storeRx/coursesSlices/coursesData";
import lessonsData from "@data/storage/storeRx/lessonSlices/lessonData";
const uploadCourseStore = configureStore({
  reducer: {
    validStarter: validStarter,
    coursesData: coursesData,
    lessonsData: lessonsData,
  },
});

export { uploadCourseStore };
