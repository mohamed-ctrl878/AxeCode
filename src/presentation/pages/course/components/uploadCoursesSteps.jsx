import StepCourseSelection from "@presentation/shared/components/form/StepCourseSelection";
import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
const uploadCoursesSteps = (dataSetter, storeName) => [
  <StepCourseSelection
    dataSetter={dataSetter}
    storeName={storeName}
    selectionType="courses"
    style={style}
  />,
  <StepCourseSelection
    dataSetter={dataSetter}
    storeName={storeName}
    selectionType="courses types"
    style={style}
  />,
  <StepCourseSelection
    dataSetter={dataSetter}
    storeName={storeName}
    selectionType="problem types"
    style={style}
  />,
];
export { uploadCoursesSteps };