import { RegisterDTO } from "@data/models/userDTOs/RegisterDTO";
import { createSlice } from "@reduxjs/toolkit";

const registerDataSteps = createSlice({
  name: "registerDataSteps",
  initialState: { ...new RegisterDTO({}) },
  reducers: {
    setRegisterDataStore: (state, action) => {
      state = new RegisterDTO({ ...state, ...action.payload });
      return state;
    },
  },
});

export const { setRegisterDataStore } = registerDataSteps.actions;
export default registerDataSteps.reducer;
