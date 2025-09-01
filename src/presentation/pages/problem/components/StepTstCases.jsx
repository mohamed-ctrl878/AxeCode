import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { handelSetInputNums } from "@core/utils/problemUploader/handellers";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const StepTstCases = ({ style }) => {
  const numperOfTstCasesFromStore = useSelector(
    (state) => state.DataPostProblem.numperOfTstCases
  );
  const numperOfParamsFromStore = useSelector(
    (state) => state.DataPostProblem.numperOfParams
  );

  const start = useSelector((state) => state.validStarter.start);
  const [numperOfTstCases, SetNumperOfTstCases] = useState(
    numperOfTstCasesFromStore
  );

  const [err, setErr] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setProberty({
        testCases: Array(numperOfTstCases).fill(
          Array(numperOfParamsFromStore).fill("")
        ),
        testCasesStates: Array(numperOfTstCases).fill(
          Array(numperOfParamsFromStore).fill(false)
        ),
      })
    );
  }, [numperOfTstCases]);
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.numperOfTstCases
  );
  useValidateInputEffect({
    start: start,
    value: numperOfTstCases,
    fieldName: "numperOfTstCases",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: numperOfTstCases > 0,
    errorMessage: "please enter a numper of Params",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });
  useUpdateStoper({ change: numperOfTstCases, setErr });
  return (
    <div className={`${style.step} ${style.active}`} id="step8">
      <div className={style.formGroup}>
        <label htmlFor="testCases" className={style.formLabel}>
          Number of Test Cases *
        </label>
        <select
          onChange={(e) =>
            SetNumperOfTstCases(handelSetInputNums(e.target.value))
          }
          id="testCases"
          className={style.formControl}
          required
        >
          <option value="">Select number of test cases</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
        </select>
        <div className={style.error} id="testCasesError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepTstCases;
