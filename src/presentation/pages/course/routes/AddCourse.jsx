import React, {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import { CourseUploadDTO } from "@domain/reqs_dtos/CourseUploadDTO";

import { BaseCourseContentSteps } from "@presentation/shared/components/form/BaseCourseContentSteps";
import CourseAndLessonBoard from "@presentation/shared/components/form/CourseAndLessonBoard";
import StepReview from "@presentation/pages/problem/components/StepReview";
import { uploadCoursesSteps } from "../components/uploadCoursesSteps";
import { postCourseExe } from "@domain/usecases/course/postCourseExe";
import PostCourses from "@data/repositories/courseImps/PostCourses";
import {
  removeCoursesData,
  setCourseData,
} from "@data/storage/storeRx/coursesSlices/coursesData";
import ShowImage from "@presentation/shared/components/media/ShowImage";
import { removeLessonData } from "@data/storage/storeRx/lessonSlices/lessonData";
import { useDispatch } from "react-redux";

const AddCourse = React.memo(({ className, lsnOrCrs }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    ...BaseCourseContentSteps(
      setCourseData,
      ShowImage,
      "coursesData",
      "course",
      "image"
    ),
    ...uploadCoursesSteps(setCourseData, "coursesData"),

    (props) => <StepReview {...props} media="image" storeName="coursesData" />,
  ];
  const size = steps.length;
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(removeCoursesData());
    };
  }, []);
  return (
    <CourseAndLessonBoard
      removeData={removeCoursesData}
      steps={steps}
      size={size}
      style={style}
      setCurrentStep={setCurrentStep}
      className={className}
      currentStep={currentStep}
      lsnOrCrs={"Add Course"}
      routeName={"lesson"}
      core={PostCourses}
      dataDTO={CourseUploadDTO}
      caseUse={postCourseExe}
      dataStore={"coursesData"}
    ></CourseAndLessonBoard>
  );
});

export default AddCourse;
