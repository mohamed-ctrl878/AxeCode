import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { useSelector, useDispatch } from "react-redux";
// import { setProberty } from "../@data/storage/storeRx/sliceProblemDataPost";
import style from "@presentation/styles/pages/upload-problem.module.css";
import StepFunNamInForm from "../components/StepFunNamInForm";
import StepTitleInForm from "../components/StepTitleInForm";
import StepDescInForm from "../components/StepDescInForm";
import StepDificulty from "../components/StepDificulty";
import StepNOfInputs from "../components/StepNOfInputs";
import StepFuncType from "../components/StepFuncType";
import StepParams from "../components/StepParams";
import StepTstCases from "../components/StepTstCases";
import StepSetTstCases from "../components/StepSetTstCases";
import StepShowDetails from "../components/StepShowDetails";
import getCoursesExe from "@domain/usecases/course/getCoursesExe";
import GetCourses from "@data/repositories/courseImps/GetCourses";
import postProblemExe from "@domain/usecases/problem/postProblemExe";
import PostProblem from "@data/repositories/problemImps/PostProblem";
import MultibleFrom from "@presentation/shared/components/form/MultibleFrom";
import SwitchersBtnsMForm from "@presentation/shared/components/form/SwitchersBtnsMForm";
import { ProblemChangesDTO } from "@data/models/problemDTOs/ProblemUploadDTO";
// import { ProblemChangesDTO } from "../@data/models/problemDTOs/ProblemUploadDTO";

let wdt = { width: "25px" };

const UploadProblem = React.memo(({ theme }) => {
  const [currentStep, SetCurrentStep] = useState(0);
  const functionReturnTypeFromStore = useSelector(
    (state) => state.DataPostProblem.functionReturnTypeFromStore
  );

  const steps = [
    <StepFunNamInForm style={style} />,
    <StepTitleInForm style={style} />,
    <StepDescInForm style={style} />,
    <StepDificulty style={style} />,
    <StepNOfInputs style={style} />,
    <StepFuncType style={style} />,
    <StepParams style={style} />,
    <StepTstCases style={style} />,
    <StepSetTstCases style={style} />,
    <StepShowDetails style={style} />,
  ];

  // console.log(typeOfParams)
  const size = steps.length;

  useEffect(() => {
    async function getCourse() {
      try {
        const getdata = await getCoursesExe(new GetCourses());
        // console.log(getdata);
        // setDataHere
      } catch (d) {
        // err state here
      }
    }
    getCourse();
  }, []);

  async function ftsh() {
    try {
      const getExecutionFunc = await postProblemExe(new PostProblem(), {
        // body here
      });
      // sucsess
    } catch (d) {
      // console.log(d.message);
    }
  }

  return (
    <div
      className={`${style.uploadProblemPageContainer} ${
        theme === "dark" ? style.darkTheme : style.lightTheme
      }`}
    >
      <div className={style.uploadProblemContainer}>
        <div className={style.uploadStepperWrapper}>
          <MultibleFrom current={currentStep} size={size} style={style} />
        </div>
        <div className={style.uploadFormBody}>
          <form id="functionForm" className={style.uploadForm}>
            {steps[currentStep]}
            <div className={style.uploadFormNavBtns}>
              <SwitchersBtnsMForm
                dataDTO={ProblemChangesDTO}
                core={PostProblem}
                dataStore={"DataPostProblem"}
                caseUse={postProblemExe}
                SetCurrentStep={SetCurrentStep}
                currentStep={currentStep}
                size={size}
                style={style}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default UploadProblem;
