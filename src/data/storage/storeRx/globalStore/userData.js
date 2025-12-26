import { UserDTO } from "@data/models/UserDTO";
import { createSlice } from "@reduxjs/toolkit";

const userData = createSlice({
  name: "userData",
  initialState: { data: null },
  reducers: {
    setUserDataHere: (state, action) => {
      state.data = new UserDTO(action.payload);
    },

    clearData: (state) => {
      state.data = null;
    },
  },
});

export const { setUserDataHere, clearData } = userData.actions;

export default userData.reducer;
