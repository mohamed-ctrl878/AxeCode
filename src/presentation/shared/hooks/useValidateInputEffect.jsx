import { stop } from "@data/storage/storeRx/sharedSlices/validStarter";
import { set } from "date-fns";
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
  const refrence = useRef();
  
  useEffect(() => {
    if (!start) return;
    try {
      const result = validationFunc(value, condition, errorMessage);

      refrence.current = true;
      setError("");
      let same = "";
      if (fieldName !== "video" && fieldName !== "image") {
        same =
          prevResultRef.current !== undefined
            ? JSON.stringify(prevResultRef.current) === JSON.stringify(result)
            : JSON.stringify(currentFieldValue) === JSON.stringify(result);
      }

      if (!same) {
        dispatch(setProberty({ [fieldName]: result }));
        prevResultRef.current = result;
        console.log(fieldName, result, "result");
      }
    } catch (err) {
      dispatch(stop());
      setError(err.message);
      refrence.current = false;
    }
  }, [
    start,
    errorMessage,
    condition,
    dispatch,
    fieldName,
    validationFunc,
    setError,
    currentFieldValue,
  ]);

  return refrence;
};
