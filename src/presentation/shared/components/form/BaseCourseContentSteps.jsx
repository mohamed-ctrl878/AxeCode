import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import StepBasicInfo from "@presentation/pages/problem/components/StepBasicInfo";
import StepMediaUpload from "@presentation/pages/problem/components/StepMediaUpload";
import StepDescription from "@presentation/pages/problem/components/StepDescription";

const BaseCourseContentSteps = (dataSetter, storeName, lsnOrCrs) => [
  (props) => (
    <StepBasicInfo
      dataSetter={dataSetter}
      storeName={storeName}
      lsnOrCrs={lsnOrCrs}
      style={style}
    />
  ),
  (props) => (
    <StepMediaUpload
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
    />
  ),
  (props) => (
    <StepDescription
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
    />
  ),
];

export { BaseCourseContentSteps };
