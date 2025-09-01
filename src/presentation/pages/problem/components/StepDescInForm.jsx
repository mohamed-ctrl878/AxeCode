import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import { checkLength } from "@core/utils/problemUploader/validation";
import StrapiRichEditor from "@presentation/shared/components/editor/StrapiRichEditor";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const StepDescInForm = ({ style }) => {
  const descriptionFromStore = useSelector(
    (state) => state.DataPostProblem.description
  );
  const [description, setDescription] = useState(
    JSON.stringify(descriptionFromStore)
  );
  const [err, setErr] = useState("");
  const start = useSelector((state) => state.validStarter.start);
  const state = useSelector((state) => state.DataPostProblem);
  const currentFieldValue = useSelector(
    (state) => state.problemDataPost?.description
  );
  console.log(state);
  const dispatch = useDispatch();
  useValidateInputEffect({
    start: start,
    value: description,
    fieldName: "description",
    validationFunc: checkLength,
    setError: setErr,
    dispatch: dispatch,
    condition: description.length > 0,
    errorMessage: "please enter a description",
    setProberty: setProberty,
    currentFieldValue: currentFieldValue,
  });
  useUpdateStoper({ change: description, setErr });
  return (
    <div className={`${style.step} ${style.active}`} id="step2">
      <div className={style.formGroup}>
        <label htmlFor="description" className={style.formLabel}>
          Description *
        </label>
        <StrapiRichEditor setToAbove={setDescription}></StrapiRichEditor>
        <div className={style.error} id="descriptionError">
          {err}
        </div>
      </div>
    </div>
  );
};

export default StepDescInForm;
