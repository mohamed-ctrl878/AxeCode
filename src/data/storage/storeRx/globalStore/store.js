import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./userAuthSlice";
import themeSlice from "./themeSlice";
import userData from "./userData";

const store = configureStore({
  reducer: {
    auth: userAuthSlice,
    themeSlice: themeSlice,
    userData: userData,
  },
});

export default store;
