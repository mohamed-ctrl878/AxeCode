import { handelChangeListnerTsts } from "@core/utils/problemUploader/handellers";
import { checkTypeThenParsing } from "@core/utils/problemUploader/validation";
import React, { useEffect } from "react";
// import { checkTypeThenParsing } from "../utils/problemUploader/validation";
// import { handelChangeListnerTsts } from "../utils/problemUploader/handellers";
import { useDispatch, useStore } from "react-redux";
// import { isValid, notValid } from "../@data/storage/storeRx/sliceForValid";

const useParsingExe = ({
  idx,
  elChange,
  typeOfParams,
  setTestCasesData,
  setErr,
  setSatesOftstCases,
}) => {
  const store = useStore();

  // const valid = store.getState().sliceForValid.valid;
  const dispatch = useDispatch();
  console.log(elChange);
  useEffect(() => {
    setErr("");

    try {
      const parsing = checkTypeThenParsing(elChange, typeOfParams);
      // dispatch(isValid());
      setTestCasesData((data) => handelChangeListnerTsts(data, idx, parsing));
      setSatesOftstCases((data) => handelChangeListnerTsts(data, idx, true));
    } catch (msg) {
      setTestCasesData((data) => handelChangeListnerTsts(data, idx, elChange));
      setSatesOftstCases((data) => handelChangeListnerTsts(data, idx, false));
      // dispatch(notValid());
      setErr(msg.message);
    }
  }, [elChange /*,valid*/]);
};

export default useParsingExe;

// here i built a structure of validation input and fill it by  false values and now i try to make this condition if case[idx] === is valid value so make states[idx] to be true
