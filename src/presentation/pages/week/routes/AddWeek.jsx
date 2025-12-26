import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import CourseAndLessonBoard from "@presentation/shared/components/form/CourseAndLessonBoard";
import { uploadWeekSteps } from "../components/uploadWeekSteps";
import { setWeekData, removeWeekData } from "@data/storage/storeRx/weeksSlices/weeksData";
import PostWeek from "@data/repositories/weekImps/PostWeek";
import { WeekUploadDTO } from "@domain/reqs_dtos/WeekUploadDTO";
import { postWeekExe } from "@domain/usecases/week/postWeekExe";
import StepReview from "@presentation/pages/problem/components/StepReview";

const AddWeek = ({ className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(removeWeekData());
    };
  }, [dispatch]);

  const steps = [
    ...uploadWeekSteps(setWeekData, "weeksData", "Week"),
    (props) => <StepReview {...props} media="none" storeName="weeksData" />,
  ];

  const size = steps.length;

  return (
    <CourseAndLessonBoard
      steps={steps}
      size={size}
      style={style}
      setCurrentStep={setCurrentStep}
      className={className}
      currentStep={currentStep}
      lsnOrCrs={"Add Week"}
      routeName={"settings/manage-courses"} // Redirect after submit?
      core={PostWeek}
      dataDTO={WeekUploadDTO}
      caseUse={postWeekExe}
      dataStore={"weeksData"}
      removeData={removeWeekData}
    />
  );
};

export default AddWeek;
