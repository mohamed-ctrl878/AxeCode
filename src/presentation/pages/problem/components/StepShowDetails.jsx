import React from "react";
import { useSelector } from "react-redux";

const StepShowDetails = ({ style }) => {
  const state = useSelector(state=>state.DataPostProblem)

  return (
    <div className={`${style.step} ${style.active}`} id="step10">
      <div className={style.formGroup}>
        <h3 className={style.reviewTitle}>Review Your Function Definition</h3>
        <div id="reviewContent" className={style.reviewContent}>
          <div>testCases:  {JSON.stringify(state?.testCases)}</div>
          <div>typeOfParams: {JSON.stringify(state?.typeOfParams)}</div>
          <div>functionName:  {JSON.stringify(state?.functionName)}</div>
          <div>functionReturnType:  {JSON.stringify(state?.functionReturnType)}</div>
          <div>dificulty:  {JSON.stringify(state?.dificulty)}</div>
          <div>tittle:  {JSON.stringify(state?.tittle)}</div>
          <div>description:  {JSON.stringify(state?.description)}</div>
          <div>courses:  {JSON.stringify(state?.courses)}</div>
          <div>problem_types: {JSON.stringify(state?.problem_types)}</div>
        </div>
        <div className={style.exportSection}>
          <h4 className={style.exportTitle}>Export Function Definition</h4>
          
          <button
            type="button"
            className={`${style.btn} ${style.exportBtn}`}
            id="exportBtn"
          >
            JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepShowDetails;
