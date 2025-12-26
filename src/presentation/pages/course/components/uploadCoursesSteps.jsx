import GetWeeks from "@data/repositories/courseImps/GetWeeks";
import { GetCoursesType } from "@data/repositories/courseImps/GetCoursesType";
import { GetProblem_types } from "@data/repositories/problemImps/GetProblem_types";
import getCoursesExe from "@domain/usecases/course/getCoursesExe";
import { getCourseTypeExe } from "@domain/usecases/course/getCourseTypesExe";
import { getProblemTypeExe } from "@domain/usecases/problem/getProblemTypeExe";
import ProblemTypeMapper from "@presentation/shared/components/form/ProblemTypeMapper";
import StepCourseSelection from "@presentation/shared/components/form/StepCourseSelection";
import WeekSelector from "@presentation/shared/components/form/WeekSelector";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import React from "react";

const uploadCoursesSteps = (dataSetter, storeName) => [
  (props) => (
    <StepCourseSelection
      // {...props}
      dataSetter={dataSetter}
      storeName={storeName}
      core={GetWeeks}
      caseUse={getCoursesExe}
      selectionType="Weeks of the Course"
      style={style}
      probertyItem={"weeks"}
      Component={WeekSelector}
      query={{
        filterkey: "title",
        populateVal: [],
        isFilter: true,
        isPopulate: false,
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
