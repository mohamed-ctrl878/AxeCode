import { checkLength } from "@core/utils/problemUploader/validation";
import StrapiRichEditor from "@presentation/shared/components/editor/StrapiRichEditor";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const StepEventDescription = ({ storeName, style, dataSetter, errTag }) => {
  const descriptionFromStore = useSelector(
    (state) => state[storeName].discription
  );
  const [description, setDescription] = useState(descriptionFromStore);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();

  useUpdateStoper({
    change: description,
    setErr,
  });

  useValidateInputEffect({
    fieldName: "discription",
    setProberty: dataSetter,
    dispatch,
    value: description,
    currentFieldValue: descriptionFromStore,
    condition: description?.length > 0,
    setError: setErr,
    validationFunc: checkLength,
    errorMessage: "Event description must be at least 1 character long",
  });

  return (
    <div className={`${style.step} ${style.active}`}>
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Event Narrative</h3>
        <p className={style.stepSubtitle}>Provide a compelling description of what attendees will learn</p>

        <div className={style.formGroup} style={{ marginTop: '1.5rem', border: '3px solid var(--border-medium)', padding: '10px', backgroundColor: 'var(--white)' }}>
          <label className={style.formLabel} style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Detailed Description *</label>
          <StrapiRichEditor setToAbove={setDescription}></StrapiRichEditor>
        </div>
        {(errTag || err) && <div className={style.error} style={{ marginTop: '1rem' }}>{errTag || err}</div>}
      </div>
    </div>
  );
};

export default StepEventDescription;
