import { createSlice } from "@reduxjs/toolkit";
import { EntitlementDTO } from "@data/models/EntitlementDTO";
const initialState = new EntitlementDTO(); // Serialized as plain object by Redux Toolkit
const entitlementSlice = createSlice({
  name: "entitlementData",
  initialState: { ...initialState }, // Ensure it's a plain object
  reducers: {
    setEntitlementProperty: (state, action) => {
      // Merges the payload into the state (e.g., { title: "New Title" })
      return { ...state, ...action.payload };
    },
    resetEntitlement: () => {
      return { ...new EntitlementDTO() };
    },
  },
});
export const { setEntitlementProperty, resetEntitlement } =
  entitlementSlice.actions;
export default entitlementSlice.reducer;
