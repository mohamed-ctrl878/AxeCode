import { checkTypeThenParsing } from "@core/utils/problemUploader/validation";
import React, { useEffect } from "react";
// import { checkTypeThenParsing } from "@utils/problemUploader/validation";
import { useDispatch } from "react-redux";

const useValidationCourseAndLesson = ({
  setError,
  param,
  type,
  proberty,
  setProberty,
}) => {
  const dispatch = useDispatch();
  return useEffect(() => {
    try {
      const data = checkTypeThenParsing(param, type);
      dispatch(setProberty({ [proberty]: data }));
    } catch (msg) {
      setError(msg.message);
    }
  }, []);
};

export default useValidationCourseAndLesson;
