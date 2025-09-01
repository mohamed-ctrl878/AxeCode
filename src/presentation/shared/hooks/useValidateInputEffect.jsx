import { stop } from "@data/storage/storeRx/sharedSlices/validStarter";
import React, { useEffect, useRef } from "react";
// import { stop } from "@store/validStarter";
import { useSelector } from "react-redux";

export const useValidateInputEffect = ({
  dispatch,
  value,
  fieldName,
  validationFunc,
  setError,
  condition,
  errorMessage,
  setProberty,
  currentFieldValue,
}) => {
  const start = useSelector((state) => state.validStarter.start);

  const prevResultRef = useRef();

  useEffect(() => {
    if (!start) return;
    try {
      const result = validationFunc(value, fieldName, condition, errorMessage);

      setError("");
      const same =
        prevResultRef.current !== undefined
          ? JSON.stringify(prevResultRef.current) === JSON.stringify(result)
          : JSON.stringify(currentFieldValue) === JSON.stringify(result);
      if (!same) {
        dispatch(setProberty({ [fieldName]: result }));
        prevResultRef.current = result; // حدّث السجل للمرّات القادمة
      }
      // إذا كانت نفس القيمة فلا نفعل شيء لتجنب الحلقة
    } catch (err) {
      dispatch(stop());
      setError(err.message);
    }
  }, [
    start,
    errorMessage,
    condition,
    value,
    dispatch,
    fieldName,
    validationFunc,
    setError,
    currentFieldValue,
  ]);
};
