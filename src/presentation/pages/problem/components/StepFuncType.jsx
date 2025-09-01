import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const StepFuncType = ({ style }) => {
  const functionReturnTypeFromStore = useSelector(
    (state) => state.DataPostProblem.functionReturnType
  );
  const start = useSelector((state) => state.validStarter.start);
  const [functionReturnType, SetFunctionReturnType] = useState(
    functionReturnTypeFromStore
  );
  const [err, setErr] = useState("");

  const dispatch = useDispatch();
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.functionReturnType
  );

  useValidateInputEffect({
    start: start,
    value: functionReturnType,
    fieldName: "functionReturnType",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: functionReturnType.length > 0,
    errorMessage: "please enter a function Type",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });
  useUpdateStoper({ change: functionReturnType, setErr });

  return (
    <div className={`${style.step} ${style.active}`} id="step6">
      <div className={style.formGroup}>
        <label htmlFor="functionType" className={style.formLabel}>
          Function Type *
        </label>
        <select
          value={functionReturnType}
          onChange={(e) => SetFunctionReturnType(handelChangeValueBasic(e))}
          id="functionType"
          className={style.formControl}
          required
        >
          <option value="">Select function type</option>
          <option value="int">integar</option>
          <option value="double">double</option>
          <option value="string">string</option>
          <option value="bool">boolean</option>
          <option value="vector<int>">integar array</option>
          <option value="vector<string>">string array</option>
          <option value="vector<bool>">boolean array</option>
          <option value="TreeNode*">tree</option>
          <option value="ListNode*">list</option>
          <option value="map<string, int>">map&lt;string, int&gt;</option>
          <option value="set<int>">set&lt;int&gt;</option>
        </select>
        <div className={style.error} id="functionTypeError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepFuncType;
