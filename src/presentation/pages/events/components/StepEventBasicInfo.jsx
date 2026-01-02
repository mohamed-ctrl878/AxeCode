import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import { checkLength } from "@core/utils/problemUploader/validation";

const StepEventBasicInfo = ({ dataSetter, storeName, style }) => {
  const titleFromStore = useSelector((state) => state[storeName].title);
  const [title, setTitle] = useState(titleFromStore || "");
  const [err, setErr] = useState("");
  const dispatch = useDispatch();

  useUpdateStoper({
    change: title,
    setErr,
  });

  useValidateInputEffect({
    fieldName: "title",
    setProberty: dataSetter,
    dispatch,
    value: title,
    currentFieldValue: titleFromStore,
    condition: title.length > 0,
    setError: setErr,
    validationFunc: checkLength,
    errorMessage: "Event title must be at least 1 character long",
  });

  return (
    <div className={`${style.step} ${style.active}`}>
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Event Basics</h3>
        <p className={style.stepSubtitle}>
          Start with the most important information
        </p>

        <div className={style.formGroup}>
          <label htmlFor="eventTitle" className={style.formLabel}>
            Event Title *
          </label>
          <input
            id="eventTitle"
            placeholder="e.g. Masterclass: Advanced Coding Patterns"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={style.formControl}
            required
          />
          {err && <div className={style.error}>{err}</div>}
        </div>
      </div>
    </div>
  );
};

export default StepEventBasicInfo;
