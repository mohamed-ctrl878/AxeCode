import GetCourses from "@data/repositories/courseImps/GetCourses";
import { GetCoursesType } from "@data/repositories/courseImps/GetCoursesType";
import { GetProblem_types } from "@data/repositories/problemImps/GetProblem_types";
import getCoursesExe from "@domain/usecases/course/getCoursesExe";
import { getCourseTypeExe } from "@domain/usecases/course/getCourseTypesExe";
import { getProblemTypeExe } from "@domain/usecases/problem/getProblemTypeExe";
import ProblemTypeMapper from "@presentation/shared/components/form/ProblemTypeMapper";
import StepCourseSelection from "@presentation/shared/components/form/StepCourseSelection";
import WeekMappingElement from "@presentation/shared/components/form/WeekMappingElement";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import React from "react";

const uploadCoursesSteps = (dataSetter, storeName) => [
  (props) => (
    <StepCourseSelection
      // {...props}
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
        isPopulate: true,
      }}
    />
  ),
  (props) => (
    <StepCourseSelection
      // {...props}
      dataSetter={dataSetter}
      storeName={storeName}
      selectionType="problem types"
      style={style}
      probertyItem={"problem_types"}
      Component={ProblemTypeMapper}
      query={{
        isPopulate: false,
        isFilter: true,
        filterkey: "title",
        populateVal: [],
      }}
      caseUse={getProblemTypeExe}
      core={GetProblem_types}
    />
  ),
  (props) => (
    <StepCourseSelection
      dataSetter={dataSetter}
      storeName={storeName}
      selectionType="course types"
      style={style}
      core={GetCoursesType}
      caseUse={getCourseTypeExe}
      probertyItem={"course_types"}
      Component={ProblemTypeMapper}
      query={{
        isPopulate: false,
        isFilter: true,
        filterkey: "title",
        populateVal: [],
      }}
    />
  ),
];

export { uploadCoursesSteps };
