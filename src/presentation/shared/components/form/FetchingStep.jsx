import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import FailureMessage from "../ui/messages/FailureMessage";
import { useDispatch, useSelector } from "react-redux";
import { go, stopFetch } from "@data/storage/storeRx/sharedSlices/validStarter";
import { useRegisterProcess } from "@presentation/shared/hooks/useRegisterProcess";
import { RegisterDTO } from "@data/models/userDTOs/RegisterDTO";
import { basicRegisterExe } from "@domain/usecases/user/basicRegisterExe";
import RegisterAuthBase from "@data/repositories/userImps/RegesterImp";

const FetchingStep = ({ size, style, currentStep, SetCurrentStep }) => {
  const dispatch = useDispatch();

  const handleNext = () => {
    if (currentStep < size - 1) {
      SetCurrentStep(currentStep + 1);
      dispatch(stopFetch());
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
  const { executeRegistration } = useRegisterProcess();

  const nextStep = useSelector((state) => state.validStarter.fetchState);
  const data = useSelector((state) => state.registerDataSteps);
  return (
    <div className={style.formActions}>
      <button
        type="button"
        className={`${style.btn} ${style.btnSecondary}`}
        id="prevBtn"
        onClick={handlePrev}
      >
        Previous
      </button>
      <button
        type="button"
        className={`${style.btn} ${style.btnSecondary}`}
        id="nextBtn"
        onClick={handleCheck}
      >
        check
      </button>

      {currentStep === size - 1 ? (
        <button
          type="button"
          className={`${style.btn} ${style.btnPrimary}`}
          id="nextBtn"
          onClick={() =>
            executeRegistration(new RegisterAuthBase(), new RegisterDTO(data))
          }
        >
          submit
        </button>
      ) : (
        nextStep && (
          <button
            type="button"
            className={`${style.btn} ${style.btnPrimary}`}
            id="nextBtn"
            onClick={handleNext}
          >
            Next
          </button>
        )
      )}
    </div>
  );
};

export default FetchingStep;
