import { checkLength } from "@core/utils/problemUploader/validation";
import StrapiRichEditor from "@presentation/shared/components/editor/StrapiRichEditor";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import useUpdateStoper from "./useUpdateStoper";
// import { useValidateInputEffect } from "./useValidateInputEffect";
// import { setLessonData } from "../@data/storage/storeRx/lessonData";
// import { checkLength } from "../utils/problemUploader/validation";
// import StrapiRichEditor from "./StrapiRichEditor";

const StepDescription = ({ storeName, style, dataSetter, errTag }) => {
  const descriptionFromStore = useSelector(
    (state) => state[storeName].description
  );
  const [description, setDescription] = useState(descriptionFromStore);
  // console.log(description);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  // useUpdateStoper is used to reset the error state when the description changes
  useUpdateStoper({
    change: description,
    setErr,
  });

  // useValidateInputEffect is a custom hook that validates the title input
  // *make this in another file
  // and use it in other steps as well
  useValidateInputEffect({
    fieldName: "description",
    setProberty: dataSetter,
    dispatch,
    value: description,
    currentFieldValue: descriptionFromStore,
    condition: description.length > 0,
    setError: setErr,
    validationFunc: checkLength,
    errorMessage: "Description must be at least 1 character long",
  });
  return (
    <div className={`${style.step} ${style.active}`} id="step3">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Description</h3>
        <p className={style.stepSubtitle}>Provide a detailed description</p>

        <div className={style.formGroup}>
          <label htmlFor="message" className={style.formLabel}>
            Description *
          </label>
          <StrapiRichEditor setToAbove={setDescription}></StrapiRichEditor>
          {errTag && <div className={style.error}>{errTag}</div>}
        </div>
      </div>
    </div>
  );
};

export default StepDescription;
