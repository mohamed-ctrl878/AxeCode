import GetCourses from "@data/repositories/courseImps/GetCourses";
import getCoursesExe from "@domain/usecases/course/getCoursesExe";
import StepCourseSelection from "@presentation/shared/components/form/StepCourseSelection";
import WeekMappingElement from "@presentation/shared/components/form/WeekMappingElement";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import React from "react";

const uploadLessonSteps = (dataSetter, storeName) => [
  <StepCourseSelection
    dataSetter={dataSetter}
    storeName={storeName}
    core={GetCourses}
    caseUse={getCoursesExe}
    selectionType="courses"
    style={style}
    probertyItem={"weeks"}
    Component={WeekMappingElement}
    query={{
      filterkey: "title",
      populateVal: ["picture", "weeks", "course_types", "problem_types"],
      isFilter: true,
    }}
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

export { uploadLessonSteps };
