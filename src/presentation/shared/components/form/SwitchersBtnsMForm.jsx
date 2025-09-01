import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useActionHook } from "../../hooks";
// import { go, stop } from "@/data/storage/storeRx/validStarter";
// import SuccessMessage from "../feedback/SuccessMessage";
// import FailureMessage from "../feedback/FailureMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import useActionHook from "@presentation/shared/hooks/useActionHook";
import { go } from "@data/storage/storeRx/sharedSlices/validStarter";
import SuccessMessage from "../ui/messages/SuccessMessage";
import FailureMessage from "../ui/messages/FailureMessage";
// import { useActionHook } from "../../hooks";
// import { go, stop } from "@/data/storage/storeRx/validStarter";
// import SuccessMessage from "../feedback/SuccessMessage";
// import FailureMessage from "../feedback/FailureMessage";
// import { nextStep, prevStep } from "../utils/problemUploader/handellers";
// import { useDispatch, useSelector } from "react-redux";
// import { go, stop } from "../@data/storage/storeRx/validStarter";
// import { unValid, valid } from "../@data/storage/storeRx/problemStepState";
// import { postProblemExe } from "../@domain/usecases/postProblemExe";
// import { PostProblem } from "../@data/repositories/problemImps/PostProblem";
// import { ProblemChangesDTO } from "../@data/models/problemDTOs/ProblemUploadDTO";
// import SuccessMessage from "./SuccessMessage";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
// import useActionHook from "./useActionHook";
// import FailureMessage from "./FailureMessage";

const SwitchersBtnsMForm = ({
  style,
  SetCurrentStep,
  currentStep,
  size,
  caseUse,
  core,
  dataDTO,
  dataStore,
}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fail, setFail] = useState(false);
  const subRef = useRef(null);
  const start = useSelector((state) => state["validStarter"].start);
  const newData = useSelector((state) => state[dataStore]); //DataPostProblem
  console.log(newData, "newData in SwitchersBtnsMForm");
  console.log(size, "size");
  console.log(currentStep, "currentStep");
  useActionHook({
    loader,
    setLoader,
    setSuccess,
    setError,
    setFail,
    subRef,
    caseUse: caseUse,
    core: new core(),
    dataDTO: new dataDTO(newData),
  });
  const handleNext = () => {
    if (currentStep < size - 1) {
      SetCurrentStep(currentStep + 1);
      dispatch(stop());
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      SetCurrentStep(currentStep - 1);
    }
  };
  const handleCheck = () => {
    dispatch(go());
  };

  return (
    <div className={style.formActions}>
      {currentStep > 0 && (
        <button
          type="button"
          className={`${style.btn} ${style.btnSecondary}`}
          id="prevBtn"
          onClick={handlePrev}
        >
          Previous
        </button>
      )}

      <button
        type="button"
        className={`${style.btn} ${style.btnSecondary}`}
        id="nextBtn"
        onClick={handleCheck}
      >
        check
      </button>
      {currentStep < size - 1 ? (
        start && (
          <button
            type="button"
            className={`${style.btn} ${style.btnPrimary}`}
            id="nextBtn"
            onClick={handleNext}
          >
            Next
          </button>
        )
      ) : (
        <>
          <button
            ref={subRef}
            type="button"
            className={`${style.btn} ${style.btnPrimary}`}
            id="submitBtn"
          >
            {loader && (
              <FontAwesomeIcon icon={faRotateRight} spin spinReverse />
            )}
            Submit
          </button>
          {success && <SuccessMessage></SuccessMessage>}
          {fail && <FailureMessage>{error}</FailureMessage>}
        </>
      )}
    </div>
  );
};

export default SwitchersBtnsMForm;
