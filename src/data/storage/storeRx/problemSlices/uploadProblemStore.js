import { configureStore } from "@reduxjs/toolkit";
import problemStepState from "./problemStepState";
import sliceProblemDataPost from "./sliceProblemDataPost";
import validStarter from "@data/storage/storeRx/sharedSlices/validStarter.js";
import sliceForfillTestCases from "./sliceForfillTestCases";
import sliceForValid from "./sliceForValid";

export const storeOfProblem = configureStore({
  reducer: {
    stateOfCurrentStep: problemStepState,
    DataPostProblem: sliceProblemDataPost,
    validStarter: validStarter,
    sliceForfillTestCases: sliceForfillTestCases,
    sliceForValid: sliceForValid,
  },
});
