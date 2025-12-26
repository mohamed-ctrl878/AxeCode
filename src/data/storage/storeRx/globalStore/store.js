import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./userAuthSlice";
import themeSlice from "./themeSlice";
import userData from "./userData";
import registerDataSteps from "./registerDataSteps";
import validStarter from "../sharedSlices/validStarter";
import entitlementSlice from "../sharedSlices/entitlementSlice";
const store = configureStore({
  reducer: {
    auth: userAuthSlice,
    themeSlice: themeSlice,
    userData: userData,
    registerDataSteps: registerDataSteps,
    validStarter: validStarter,
    entitlementData: entitlementSlice,
  },
});
export default store;