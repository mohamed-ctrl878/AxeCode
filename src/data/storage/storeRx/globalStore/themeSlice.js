import LocalStorageServImp from "@data/repositories/storageImps/LocalstorageServImp";
import { createSlice } from "@reduxjs/toolkit";

const localStg = new LocalStorageServImp();

console.log(localStg.getItem("theme"));

const themeSlice = createSlice({
  name: "theme",
  initialState: { theme: localStg.getItem("theme") === true ? true : false },
  reducers: {
    switchState: (state, action) => {
      state.theme = action.payload || !state.theme;
      localStg.setItem("theme", state.theme);
    },
  },
});

export const { switchState } = themeSlice.actions;
export default themeSlice.reducer;
