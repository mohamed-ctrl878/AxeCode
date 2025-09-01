import { setProberty } from "@data/storage/storeRx/problemSlices/sliceProblemDataPost";
import React, { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
// import { setProberty } from "../@data/storage/storeRx/sliceProblemDataPost";
// import { clearCases } from "../@data/storage/storeRx/sliceForfillTestCases";
// import { notValid } from "../@data/storage/storeRx/sliceForValid";

const useFillTestCasesEffect = ({ idx, testCasesData, statesOftstCases }) => {
  const store = useStore();
  const fillCases = useSelector((state) => state.sliceForfillTestCases.fill);
  const dispatch = useDispatch();
  useEffect(() => {
    if (fillCases) {
      const currentCases = store.getState().DataPostProblem.testCases;
      const testCasesStates = store.getState().DataPostProblem.testCasesStates;
      const filt = currentCases.map((f, i) => (i === idx ? testCasesData : f));
      const states = testCasesStates.map((f, i) =>
        i === idx ? statesOftstCases : f
      );
      dispatch(setProberty({ testCases: filt, testCasesStates: states }));
    }
  }, [fillCases, statesOftstCases, testCasesData, idx, dispatch, store]);
};

export default useFillTestCasesEffect;
