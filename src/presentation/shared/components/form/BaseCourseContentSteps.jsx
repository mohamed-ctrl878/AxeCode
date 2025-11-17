import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import StepBasicInfo from "@presentation/pages/problem/components/StepBasicInfo";
import StepMediaUpload from "@presentation/shared/components/form/StepMediaUpload";
import StepDescription from "@presentation/pages/problem/components/StepDescription";

const BaseCourseContentSteps = (
  dataSetter,
  ShowMedia
  ,
  storeName,
  lsnOrCrs,
  media = "image"
) => [
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
      ShowMedia={ShowMedia}
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
      media={media}
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
