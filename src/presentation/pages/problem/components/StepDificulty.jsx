import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { checkLength } from "@core/utils/problemUploader/validation";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useValidateInputEffect } from "./useValidateInputEffect";
// import { checkLength } from "../utils/problemUploader/validation";
// import { setProberty } from "../@data/storage/storeRx/sliceProblemDataPost";

const StepDificulty = ({ style }) => {
  const dificulty = useSelector((state) => state.DataPostProblem.dificulty);
  const [select, setSelect] = useState(dificulty);
  const [err, setErr] = useState("");
  const start = useSelector((state) => state.validStarter.start);
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.dificulty
  );
  console.log(select);
  const dispatch = useDispatch();
  useValidateInputEffect({
    start: start,
    value: select,
    fieldName: "dificulty",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: true,
    errorMessage: "error",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });

  return (
    <div className={`${style.step} ${style.active}`} id="step4">
      <div className={style.formGroup}>
        <label className={style.formLabel}>Difficulty Level *</label>
        <div className={style.radioGroup}>
          <div className={style.radioOption}>
            <input
              type="radio"
              id="easy"
              onClick={(e) => setSelect(e.target.value)}
              name="difficulty"
              value="easy"
              required
              className={style.radioInput}
            />
            <label htmlFor="easy" className={style.radioLabel}>
              Easy
            </label>
          </div>
          <div className={style.radioOption}>
            <input
              type="radio"
              onClick={(e) => setSelect(e.target.value)}
              id="medium"
              name="difficulty"
              value="medium"
              className={style.radioInput}
            />
            <label htmlFor="medium" className={style.radioLabel}>
              Medium
            </label>
          </div>
          <div className={style.radioOption}>
            <input
              type="radio"
              onClick={(e) => setSelect(e.target.value)}
              id="hard"
              name="difficulty"
              value="hard"
              className={style.radioInput}
            />
            <label htmlFor="hard" className={style.radioLabel}>
              Hard
            </label>
          </div>
        </div>
        <div className={style.error} id="difficultyError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepDificulty;
