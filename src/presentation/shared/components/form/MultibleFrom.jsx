import React from "react";

const MultibleFrom = ({ current, size, style, title = "Form Steps" }) => {
  return (
    <div className={style ? style.uploadStepperHeader : "form-header"}>
      <h1 className={style ? style.uploadStepperTitle : undefined}>{title}</h1>
      <p className={style ? style.uploadStepperSubtitle : undefined}>
        Complete all steps to continue
      </p>
      <div className={style ? style.uploadStepperProgressBar : "progress-bar"}>
        <div
          style={{ width: (current / size) * 100 + "%" }}
          className={style ? style.uploadStepperProgressFill : "progress-fill"}
          id="progressFill"
        ></div>
      </div>
    </div>
  );
};

export default MultibleFrom;
