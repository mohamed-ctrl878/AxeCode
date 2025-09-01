import { fillCases } from "@data/storage/storeRx/problemSlices/sliceForfillTestCases";
import useLastFilltrationTestCases from "@presentation/shared/hooks/useLastFilltrationTestCases";
import React from "react";
import { useDispatch } from "react-redux";
import TestDetails from "./TestDetails";
import TestCasesNameParams from "./TestCasesNameParams";

const StepSetTstCases = ({ number, style }) => {
  const dispatch = useDispatch();

  useLastFilltrationTestCases();

  return (
    <div className={`${style.step} ${style.active}`} id="step9">
      <div className={style.formGroup}>
        <label className={style.formLabel}>Test Case Details *</label>
        <div className={style.inputsContainer} id="testCaseDetailsContainer">
          <TestDetails style={style}></TestDetails>
          <TestCasesNameParams style={style}></TestCasesNameParams>
        </div>
        <button
          onClick={() => dispatch(fillCases())}
          type="button"
          className={`${style.btn} ${style.btnSecondary}`}
        >
          fill test-Cases
        </button>
        <div className={style.error} id="testCaseDetailsError">
          Please fill all test case details
        </div>
      </div>
    </div>
  );
};

export default StepSetTstCases;
