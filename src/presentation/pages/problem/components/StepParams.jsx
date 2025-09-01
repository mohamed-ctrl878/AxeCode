import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { handelType } from "@core/utils/problemUploader/handellers";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
// import { handelType } from "@utils/problemUploader/handellers";
// import { checkLength } from "@utils/problemUploader/validation";
// import { useValidateInputEffect } from "./useValidateInputEffect";
// import { setProberty } from "@store/sliceProblemDataPost";
import { useDispatch, useSelector } from "react-redux";
// import { useUpdateStoper } from "./useUpdateStoper";

const StepParams = ({ style }) => {
  const numperOfParams = useSelector(
    (state) => state.DataPostProblem.numperOfParams
  );

  const sec = Array(numperOfParams).fill("");

  const typeOfParamsFromStore = useSelector(
    (state) => state.DataPostProblem.typeOfParams
  );
  const start = useSelector((state) => state.validStarter.start);
  const [typeOfParams, SetTypeOfParams] = useState(typeOfParamsFromStore);
  const [err, setErr] = useState("");

  console.log(typeOfParams);
  const dispatch = useDispatch();
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.typeOfParams
  );
  useValidateInputEffect({
    start: start,
    value: typeOfParams,
    fieldName: "typeOfParams",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: !typeOfParams.includes(""),
    errorMessage: "please make fill all of above inputs",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });

  useUpdateStoper({ change: typeOfParams, setErr });

  return (
    <div className={`${style.step} ${style.active}`} id="step7">
      <div className={style.formGroup}>
        <label className={style.formLabel}>Input Parameters *</label>
        <div className={style.inputsContainer} id="inputsContainer">
          {sec.map((e, i) => {
            return (
              <div key={i} className={style.inputItem}>
                <label className={style.inputLabel}>Input {i + 1} Type</label>
                <select
                  onChange={(e) =>
                    SetTypeOfParams((el) =>
                      handelType(i, [...el], e.target.value)
                    )
                  }
                  className={style.formControl}
                  required=""
                >
                  <option value="">Select type</option>
                  <option value="int">integar</option>
                  <option value="double">double</option>
                  <option value="string">string</option>
                  <option value="bool">boolean</option>
                  <option value="vector<int>">integar array</option>
                  <option value="vector<string>">string array</option>
                  <option value="vector<bool>">boolean array</option>
                  <option value="TreeNode*">tree</option>
                  <option value="ListNode*">list</option>
                  <option value="char">character</option>
                </select>
              </div>
            );
          })}
        </div>
        <div className={style.error} id="inputsError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepParams;
