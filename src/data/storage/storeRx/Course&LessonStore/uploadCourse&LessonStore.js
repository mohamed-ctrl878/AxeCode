import { configureStore } from "@reduxjs/toolkit";
import validStarter from "@data/storage/storeRx/sharedSlices/validStarter.js";
import coursesData from "@data/storage/storeRx/coursesSlices/coursesData";
import lessonsData from "@data/storage/storeRx/lessonSlices/lessonData";
import weeksData from "@data/storage/storeRx/weeksSlices/weeksData";

const uploadCourseStore = configureStore({
  reducer: {
    validStarter: validStarter,
    coursesData: coursesData,
    lessonsData: lessonsData,
    weeksData: weeksData,
  },
});

export { uploadCourseStore };
