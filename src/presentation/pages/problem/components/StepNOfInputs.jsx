import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { handelSetInputNums } from "@core/utils/problemUploader/handellers";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useEffect, useState } from "react";
// import { handelSetInputNums } from "@utils/problemUploader/handellers";
import { useDispatch, useSelector } from "react-redux";
// import { useValidateInputEffect } from "./useValidateInputEffect";
// import { checkLength } from "@utils/problemUploader/validation";
// import { setProberty } from "@store/sliceProblemDataPost";
// import { useUpdateStoper } from "./useUpdateStoper";

const StepNOfInputs = ({ style }) => {
  const numperOfParamsFromStore = useSelector(
    (state) => state.DataPostProblem.numperOfParams
  );
  const start = useSelector((state) => state.validStarter.start);
  const [numperOfParams, SetNumperOfparams] = useState(numperOfParamsFromStore);
  const [err, setErr] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    console.log(numperOfParams);
    dispatch(setProberty({ typeOfParams: Array(numperOfParams).fill("") }));
  }, [numperOfParams]);
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.numperOfParams
  );
  useValidateInputEffect({
    start: start,
    value: numperOfParams,
    fieldName: "numperOfParams",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: numperOfParams > 0,
    errorMessage: "please enter a numper of Params",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });
  useUpdateStoper({ change: numperOfParams, setErr });
  return (
    <div className={`${style.step} ${style.active}`} id="step5">
      <div className={style.formGroup}>
        <label htmlFor="inputCount" className={style.formLabel}>
          Number of Inputs *
        </label>
        <select
          value={numperOfParams}
          onChange={(e) =>
            SetNumperOfparams(handelSetInputNums(e.target.value))
          }
          id="inputCount"
          className={style.formControl}
          required
        >
          <option value="">Select number of inputs</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
        <div className={style.error} id="inputCountError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepNOfInputs;
