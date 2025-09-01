import React, { useState } from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import { BaseCourseContentSteps } from "@presentation/shared/components/form/BaseCourseContentSteps";
import { setLessonData } from "@data/storage/storeRx/lessonSlices/lessonData";
import CourseAndLessonBoard from "@presentation/shared/components/form/CourseAndLessonBoard";
import PostLesson from "@data/repositories/lessonImps/PostLesson";
import { LessonUploadDTO } from "@data/models/LessonDTOs/LessonUploadDTO";
import postLessonExe from "@domain/usecases/lesson/postLessonExe";
import { uploadLessonSteps } from "../components/uploadLessonSteps";
import StepReview from "@presentation/pages/problem/components/StepReview";

// import StepReview from "../components/StepReview";

// import CourseAndLessonBoard from "../components/CourseAndLessonBoard";
// import { BaseCourseContentSteps } from "../components/BaseCourseContentSteps";
// import { uploadLessonSteps } from "../components/uploadLessonSteps";
// import { LessonUploadDTO } from "../@data/models/LessonDTOs/LessonUploadDTO";
// import { PostLesson } from "../@data/repositories/lesson/PostLesson";
// import { postLessonExe } from "../@domain/usecases/postLessonExe";
// import { setLessonData } from "../@data/storage/storeRx/lessonData";

const AddLesson = ({ className, lsnOrCrs, step = [] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    ...BaseCourseContentSteps(setLessonData, "lessonsData", "lesson"),
    ...uploadLessonSteps(setLessonData, "lessonsData"),
    <StepReview style={style} />,
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
      lsnOrCrs={"Add Lesson"}
      routeName={"course"}
      core={PostLesson}
      dataDTO={LessonUploadDTO}
      caseUse={postLessonExe}
      dataStore={"lessonsData"}
    ></CourseAndLessonBoard>
  );
};

export default AddLesson;
