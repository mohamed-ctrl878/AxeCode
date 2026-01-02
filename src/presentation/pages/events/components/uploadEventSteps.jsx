import React from "react";
import StepMediaUpload from "@presentation/shared/components/form/StepMediaUpload";
import StepEventBasicInfo from "./StepEventBasicInfo";
import StepEventDescription from "./StepEventDescription";
import StepEventDetails from "./StepEventDetails";
import StepSpeakers from "./StepSpeakers";
import ShowImage from "@presentation/shared/components/media/ShowImage";
import style from "@presentation/styles/pages/add-lesson-course.module.css";

const uploadEventSteps = (dataSetter, storeName) => [
  // 1. Basic Info (Specialized for Event)
  (props) => (
    <StepEventBasicInfo
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
    />
  ),
  // 2. Media Upload
  (props) => (
    <StepMediaUpload
      ShowMedia={ShowImage}
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
      media="image"
    />
  ),
  // 3. Description (Refined)
  (props) => (
    <StepEventDescription
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
    />
  ),
  // 4. Logistics (Date, Onsite, Location, etc.)
  (props) => (
    <StepEventDetails
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
    />
  ),
  // 5. Speakers (Premium Dynamic List)
  (props) => (
    <StepSpeakers
      dataSetter={dataSetter}
      storeName={storeName}
      style={style}
    />
  ),
];

export { uploadEventSteps };
