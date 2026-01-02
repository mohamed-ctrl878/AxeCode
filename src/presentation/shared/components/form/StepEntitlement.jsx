import React, { useEffect, useState } from "react";
import { EntitlementData } from "@domain/reqs_dtos/EntitlementData";
// import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
// import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
// import { checkLength, intValid, doubleValid } from "@core/utils/problemUploader/validation";
// import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
const StepEntitlement = ({ style,type, id,setData }) => {
  // Local state for immediate input feedback (mirrors Redux)
  // implementing a simpler direct-dispatch approach for this demo to ensure it works first
  const [payload , setPayload]= useState({...new EntitlementData({itemId:id,content_types:type})})
  useEffect(()=>{
setData(payload);
  },[payload])
  console.log(payload)
  return (
    <div className={`${style.step} ${style.active}`} id="entitlementStep">
      <h3 className={style.stepTitle}>Entitlement Details</h3>
      
      {/* Title */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Title</label>
        <input
          type="text"
          className={style.formControl}
          value={payload.title}
          onChange={(e) => setPayload((el)=>{return {...el,title:e.target.value}})}
        />
      </div>
      {/* Description */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Description</label>
        <textarea
          className={style.formControl}
          value={payload.description}
          onChange={(e) => setPayload((el)=>{return {...el,description:e.target.value}})}
        />
      </div>
      {/* Price & Currency */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <div className={style.formGroup} style={{ flex: 1 }}>
          <label className={style.formLabel}>Price</label>
          <input
            type="number"
            className={style.formControl}
            value={payload.price}
          onChange={(e) => setPayload((el)=>{return {...el,price:e.target.value}})}
          />
        </div>
        <div className={style.formGroup} style={{ flex: 1 }}>
          <label className={style.formLabel}>Currency</label>
          <input
            type="text"
            className={style.formControl}
            value={payload.currency}
          onChange={(e) => setPayload((el)=>{return {...el,currency:e.target.value}})}
          />
        </div>
      </div>
      {/* Decision (Checkbox) */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>
          <input
            type="checkbox"
          onChange={(e) => setPayload((el)=>{return {...el,decision:!el.decision}})}
            style={{ marginRight: "10px" }}
          />
          Decision (Enable/Disable)
        </label>
      </div>
      {/* Content Type */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Content Type:</label>
        <span
          className={style.formControl}
          >
          {payload.content_types}
        </span>
      </div>
       {/* Item ID */}
       <div className={style.formGroup}>
        <label className={style.formLabel}>Item ID</label>
        <span
          type="number"
          className={style.formControl}
       > {id}</span>
      </div>
       {/* Duration */}
       <div className={style.formGroup}>
        <label className={style.formLabel}>Duration (Datetime)</label>
        <input
          type="datetime-local"
           className={style.formControl}
          value={payload.duration || ""}
          onChange={(e) => setPayload((el)=>{return {...el,duration:e.target.value}})}
        />
      </div>
    </div>
  );
};
export default StepEntitlement;
