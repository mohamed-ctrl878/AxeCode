import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEntitlementProperty } from "@data/storage/storeRx/sharedSlices/entitlementSlice";
// import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
// import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
// import { checkLength, intValid, doubleValid } from "@core/utils/problemUploader/validation";
// import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
const StepEntitlement = ({ style }) => {
  const dispatch = useDispatch();
  const entitlementData = useSelector((state) => state.entitlementData);
  // Local state for immediate input feedback (mirrors Redux)
  // implementing a simpler direct-dispatch approach for this demo to ensure it works first
  
  const handleChange = (field, value) => {
    dispatch(setEntitlementProperty({ [field]: value }));
  };
  return (
    <div className={`${style.step} ${style.active}`} id="entitlementStep">
      <h3 className={style.stepTitle}>Entitlement Details</h3>
      
      {/* Title */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Title</label>
        <input
          type="text"
          className={style.formControl}
          // value={entitlementData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>
      {/* Description */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Description</label>
        <textarea
          className={style.formControl}
          // value={entitlementData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      {/* Price & Currency */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <div className={style.formGroup} style={{ flex: 1 }}>
          <label className={style.formLabel}>Price</label>
          <input
            type="number"
            className={style.formControl}
            value={entitlementData.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          />
        </div>
        <div className={style.formGroup} style={{ flex: 1 }}>
          <label className={style.formLabel}>Currency</label>
          <input
            type="text"
            className={style.formControl}
            value={entitlementData.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
          />
        </div>
      </div>
      {/* Decision (Checkbox) */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>
          <input
            type="checkbox"
            checked={entitlementData.decision}
            onChange={(e) => handleChange("decision", e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          Decision (Enable/Disable)
        </label>
      </div>
      {/* Content Type */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Content Type</label>
        <select
          className={style.formControl}
          value={entitlementData.content_types}
          onChange={(e) => handleChange("content_types", e.target.value)}
        >
          <option value="VIDEO">VIDEO</option>
          <option value="ARTICLE">ARTICLE</option>
          <option value="PROBLEM">PROBLEM</option>
        </select>
      </div>
       {/* Item ID */}
       <div className={style.formGroup}>
        <label className={style.formLabel}>Item ID</label>
        <input
          type="number"
          className={style.formControl}
          value={entitlementData.itemId}
          onChange={(e) => handleChange("itemId", parseInt(e.target.value))}
        />
      </div>
       {/* Duration */}
       <div className={style.formGroup}>
        <label className={style.formLabel}>Duration (Datetime)</label>
        <input
          type="datetime-local"
           className={style.formControl}
          value={entitlementData.duration || ""}
          onChange={(e) => handleChange("duration", e.target.value)}
        />
      </div>
    </div>
  );
};
export default StepEntitlement;
