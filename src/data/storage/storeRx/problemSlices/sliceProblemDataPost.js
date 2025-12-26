import { createSlice } from "@reduxjs/toolkit";

const sliceProblemDataPost = createSlice({
  name: "DataPostProblem",
  initialState: {
    testCases: [],
    testCasesStates: [],
    functionName: "",
    functionReturnType: "",
    language: "",
    dificulty: "easy",
    tittle: "",
    description: [],
    courses: [],
    comments: [],
    problem_types: [],
    numperOfParams: 0,
    typeOfParams: [],
    numperOfTstCases: 0,
    errorCases: [],
  },
  reducers: {
    setProberty: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    clearProblemData: () => {
      return {
        testCases: [],
        testCasesStates: [],
        functionName: "",
        functionReturnType: "",
        language: "",
        dificulty: "easy",
        tittle: "",
        description: [],
        courses: [],
        comments: [],
        problem_types: [],
        numperOfParams: 0,
        typeOfParams: [],
        numperOfTstCases: 0,
        errorCases: [],
      };
    },
  },
});

export const { setProberty, clearProblemData } = sliceProblemDataPost.actions;
export default sliceProblemDataPost.reducer;
