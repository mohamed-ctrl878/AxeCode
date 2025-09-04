import { go, stop } from "@data/storage/storeRx/sharedSlices/validStarter";
import { checkAllTrue } from "@core/utils/problemUploader/handellers";
import React, { useEffect } from "react";

import { useDispatch, useSelector, useStore } from "react-redux";
// import { checkAllTrue } from "../utils/problemUploader/handellers";
// import { isValid, notValid } from "../@data/storage/storeRx/sliceForValid";
// import { go, stop } from "../@data/storage/storeRx/validStarter";

const useLastFilltrationTestCases = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const start = useSelector((state) => state.validStarter.start);

  // console.log("fire upload");
  useEffect(() => {
    const testCasesStates = store.getState().DataPostProblem.testCasesStates;
    if (start) {
      const result = checkAllTrue(testCasesStates);
      if (result === true) {
        dispatch(go());
        // dispatch(isValid());
      } else {
        //  dispatch(notValid());
        dispatch(stop());
      }
    }
  }, [start, store, dispatch]);
};

export default useLastFilltrationTestCases;
