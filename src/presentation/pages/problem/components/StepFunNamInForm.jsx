import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const StepFunNamInForm = ({ style }) => {
  const name = useSelector((state) => state.DataPostProblem.functionName);
  const [funcName, setFuncName] = useState(name);
  const [err, setErr] = useState("");

  const dispatch = useDispatch();
  const start = useSelector((state) => state.validStarter.start);
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.functionName
  );
  // console.log(start);
  useValidateInputEffect({
    value: funcName,
    fieldName: "functionName",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: funcName.length > 0,
    errorMessage: "please enter a function name",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });


  // [3985,93849384,93849384,93849384

  useUpdateStoper({ change: funcName, setErr });

  return (
    <div className={`${style.step} ${style.active}`} id="step1">
      <div className={style.formGroup}>
        <label htmlFor="functionName" className={style.formLabel}>
          Function Name *
        </label>
        <input
          value={funcName}
          onChange={(e) => setFuncName(handelChangeValueBasic(e))}
          type="text"
          id="functionName"
          className={style.formControl}
          required
        />
        <div className={style.error} id="functionNameError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepFunNamInForm;
