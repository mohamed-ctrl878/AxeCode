import React, { useState, useEffect } from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import { EventDTO } from "@domain/reqs_dtos/EventDTO";
import { uploadEventSteps } from "../components/uploadEventSteps";
import CourseAndLessonBoard from "@presentation/shared/components/form/CourseAndLessonBoard";
import { postEventExe } from "@domain/usecases/event.js/postEventExe";
import { PostEvent } from "@data/repositories/event/PostEvent";
import { setData as setEventData, resetData as removeEventData } from "@data/storage/storeRx/eventSlice/UploadEventData";
import { useDispatch, useSelector } from "react-redux";

const AddEvent = React.memo(({ className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();

  // Initialize steps with premium specialized components
  const steps = uploadEventSteps(setEventData, "UploadEventData");
  const size = steps.length;
  // const data = useSelector((state) => state?.UploadEventData);
  // console.log(data)

  useEffect(() => {
    // Cleanup store on unmount using modern Redux pattern
    return () => {
      dispatch(removeEventData());
    };
  }, [dispatch]);

  return (
    <CourseAndLessonBoard
      removeData={removeEventData}
      steps={steps}
      size={size}
      style={style}
      setCurrentStep={setCurrentStep}
      className={className}
      currentStep={currentStep}
      lsnOrCrs={"Event Workspace"} 
      routeName={"event"}
      core={PostEvent}
      dataDTO={EventDTO}
      caseUse={postEventExe}
      dataStore={"UploadEventData"}
    />
  );
});

export default AddEvent;
