import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import StepBasicInfo from "@presentation/pages/problem/components/StepBasicInfo";
import StepCourseSelection from "@presentation/shared/components/form/StepCourseSelection";
import {GetCourse} from "@data/repositories/courseImps/GetCourse";
import {GetLessons} from "@data/repositories/lessonImps/GetLessons";
import getCoursesExe from "@domain/usecases/course/getCoursesExe";
import getLessonsExe from "@domain/usecases/lesson/getLessonsExe";
import CourseSelector from "@presentation/shared/components/form/CourseSelector";
import LessonSelector from "@presentation/shared/components/form/LessonSelector";

const uploadWeekSteps = (dataSetter, storeName, lsnOrCrs) => [
  // Step 1: Basic Info (Title Only)
  (props) => (
    <StepBasicInfo
      dataSetter={dataSetter}
      storeName={storeName}
      lsnOrCrs={lsnOrCrs}
      style={style}
      // Assuming StepBasicInfo handles 'title' field internally
    />
  ),
  // Step 2: Course Selection (Single)
  (props) => (
    <StepCourseSelection
      dataSetter={dataSetter}
      storeName={storeName}
      selectionType="Course"
      style={style}
      core={GetCourse}
      caseUse={getCoursesExe}
      probertyItem={"course"}
      Component={CourseSelector}
      query={{
        isPopulate: false,
        isFilter: true,
        filterkey: "title",
        populateVal: [],
      }}
    />
  ),
  // Step 3: Lessons Selection (Multiple)
  (props) => (
    <StepCourseSelection
      dataSetter={dataSetter}
      storeName={storeName}
      selectionType="Lessons"
      style={style}
      core={GetLessons}
      caseUse={getLessonsExe}
      probertyItem={"lessons"}
      Component={LessonSelector}
      query={{
        isPopulate: false,
        isFilter: true,
        filterkey: "title",
        populateVal: [],
      }}
    />
  ),
];

export { uploadWeekSteps };
