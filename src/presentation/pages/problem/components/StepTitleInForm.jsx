import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const StepTitleInForm = ({ style }) => {
  const titleFromStore = useSelector((state) => state.DataPostProblem.tittle);
  const [title, seTitle] = useState(titleFromStore);
  const [err, setErr] = useState("");
  const start = useSelector((state) => state.validStarter.start);
  const dispatch = useDispatch();
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.tittle
  );
  useValidateInputEffect({
    start: start,
    value: title,
    fieldName: "tittle",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: title.length > 0,
    errorMessage: "please enter a title",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });
  useUpdateStoper({ change: title, setErr });

  return (
    <div className={`${style.step} ${style.active}`} id="step3">
      <div className={style.formGroup}>
        <label htmlFor="title" className={style.formLabel}>
          Title *
        </label>
        <input
          onChange={(e) => seTitle(handelChangeValueBasic(e))}
          value={title}
          type="text"
          id="title"
          className={style.formControl}
          required
        />
        <div className={style.error} id="titleError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepTitleInForm;
