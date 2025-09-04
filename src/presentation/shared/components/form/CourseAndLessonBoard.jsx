import React from "react";
import { Link } from "react-router-dom";
import MultibleFrom from "./MultibleFrom";
import SwitchersBtnsMForm from "./SwitchersBtnsMForm";

const CourseAndLessonBoard = ({
  caseUse,
  core,
  dataDTO,
  dataStore,
  style,
  size,
  lsnOrCrs,
  currentStep,
  steps = [],
  className,
  setCurrentStep,
  routeName,
}) => {
  const CStep = steps[currentStep];
  return (
    <div className={style.addLessonCourseContainer}>
      <div className={style.addLessonCourseFormWrapper}>
        <div className={style.addLessonCourseStepperWrapper}>
          <MultibleFrom
            current={currentStep}
            size={size}
            style={style}
            title={`${lsnOrCrs}`}
          />
        </div>
        <form
          className={`${style.addLessonCourseForm} ${className}`}
          style={style.addLessonCourseFormStyle}
        >
          <div className={style.addLessonCourseFormBody}>{<CStep></CStep>}</div>

          <div className={style.addLessonCourseFormNavBtns}>
            <SwitchersBtnsMForm
              style={style}
              SetCurrentStep={setCurrentStep}
              currentStep={currentStep}
              size={size}
              caseUse={caseUse}
              core={core}
              dataDTO={dataDTO}
              dataStore={dataStore}
            />
          </div>
        </form>

        <div className={style.addLessonCourseSwitchLink}>
          <Link
            className={style.addLessonCourseLink}
            to={`/settings/profile/add-${routeName}`}
          >
            Add {routeName}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseAndLessonBoard;
