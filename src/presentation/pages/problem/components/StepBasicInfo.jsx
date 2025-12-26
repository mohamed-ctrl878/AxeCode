// import { checkLength } from "@/core/utils/problemUploader/validation";
// import { useUpdateStoper, useValidateInputEffect } from "@/presentation/shared/hooks";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
// import { useValidateInputEffect } from "./useValidateInputEffect";
// import { setLessonData } from "../@data/storage/storeRx/lessonData";
import { useDispatch, useSelector } from "react-redux";
// import { checkLength } from "../utils/problemUploader/validation";
// import useUpdateStoper from "./useUpdateStoper";

const StepBasicInfo = ({ dataSetter, storeName, style, titErr, lsnOrCrs }) => {
  const titleFromStore = useSelector((state) => state[storeName].title);
  const [title, setTitle] = useState(titleFromStore || "");
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  // useUpdateStoper is used to reset the error state when the title changes
  useUpdateStoper({
    change: title,
    setErr,
  });
console.log("title", title);
  // useValidateInputEffect is a custom hook that validates the title input
  // *make this in another file
  // and use it in other steps as well
  useValidateInputEffect({
    fieldName: "title",
    setProberty: dataSetter,
    dispatch,
    value: title,
    currentFieldValue: titleFromStore,
    condition: title.length > 0,
    setError: setErr,
    validationFunc: checkLength,
    errorMessage: "Title must be at least 1 character long",
  });

  return (
    <div className={`${style.step} ${style.active}`} id="step1">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Basic Information</h3>
        <p className={style.stepSubtitle}>
          Enter the basic details for your {lsnOrCrs}
        </p>

        <div className={style.formGroup}>
          <label htmlFor="tittle" className={style.formLabel}>
            Title *
          </label>
          <input
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="tittle"
            className={style.formControl}
            required
          />
          {err && <div className={style.error}>{err}</div>}
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
