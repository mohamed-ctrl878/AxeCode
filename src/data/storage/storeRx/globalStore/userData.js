import { UserDTO } from "@data/models/userDTOs/UserDTO";
import { createSlice } from "@reduxjs/toolkit";

const userData = createSlice({
  name: "userData",
  initialState: { data: null },
  reducers: {
    setUserDataHere: (state, action) => {
      state.data = new UserDTO(action.payload);
    },
  },
});

export const { setUserDataHere } = userData.actions;

export default userData.reducer;
