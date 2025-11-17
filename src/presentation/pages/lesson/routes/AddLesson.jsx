import React, { useState } from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import { BaseCourseContentSteps } from "@presentation/shared/components/form/BaseCourseContentSteps";
import { setLessonData } from "@data/storage/storeRx/lessonSlices/lessonData";
import CourseAndLessonBoard from "@presentation/shared/components/form/CourseAndLessonBoard";
import PostLesson from "@data/repositories/lessonImps/PostLesson";
import { LessonUploadDTO } from "@data/models/LessonDTOs/LessonUploadDTO";
import { postLessonExe } from "@domain/usecases/lesson/postLessonExe";
import { uploadLessonSteps } from "../components/uploadLessonSteps";
import StepReview from "@presentation/pages/problem/components/StepReview";
import ShowImage from "@presentation/shared/components/media/ShowImage";
import ShowVideo from "@presentation/shared/components/media/ShowVideo";
import { useSelector } from "react-redux";

// import StepReview from "../components/StepReview";

// import CourseAndLessonBoard from "../components/CourseAndLessonBoard";
// import { BaseCourseContentSteps } from "../components/BaseCourseContentSteps";
// import { uploadLessonSteps } from "../components/uploadLessonSteps";
// import { LessonUploadDTO } from "../@data/models/LessonDTOs/LessonUploadDTO";
// import { PostLesson } from "../@data/repositories/lesson/PostLesson";
// import { postLessonExe } from "../@domain/usecases/postLessonExe";
// import { setLessonData } from "../@data/storage/storeRx/lessonData";

const AddLesson = ({ className, lsnOrCrs, step = [] }) => {
  console.log("kdfmvkm");

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    ...BaseCourseContentSteps(
      setLessonData,
      ShowVideo,
      "lessonsData",
      "lesson",
      "video"
    ),
    ...uploadLessonSteps(setLessonData, "lessonsData"),
    StepReview,
  ];

  const store = useSelector((state) => state.addLesson);

  console.log(store);

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
