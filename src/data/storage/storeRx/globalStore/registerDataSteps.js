import { RegisterDTO } from "@domain/reqs_dtos/RegisterDTO";
import { createSlice } from "@reduxjs/toolkit";

const registerDataSteps = createSlice({
  name: "registerDataSteps",
  initialState: { ...new RegisterDTO({}) },
  reducers: {
    setRegisterDataStore: (state, action) => {
      state = new RegisterDTO({ ...state, ...action.payload });
      return state;
    },
    clearRegData: (state) => {
      return { ...new RegisterDTO({}) };
    },
  },
});

export const { setRegisterDataStore ,clearRegData} = registerDataSteps.actions;
export default registerDataSteps.reducer;
