import { validatePassword } from "@core/utils/validationFroms/validationReg";
import { setRegisterDataStore } from "@data/storage/storeRx/globalStore/registerDataSteps";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RegisterStepPassword = ({ style }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const state = useSelector((state) => state.registerDataSteps);
  const dispatch = useDispatch();
  useValidateInputEffect({
    dispatch,
    value: { password: password, confirmPassword: confirmPassword },
    errorMessage: "Please, make them have similar values",
    setProberty: setRegisterDataStore,
    setError,
    fieldName: "password",
    validationFunc: validatePassword,
    condition: password === confirmPassword,
    currentFieldValue: state,
  });
  return (
    <div className={`${style.step} ${style.active}`} id="step2">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Password Setup</h3>
        <p className={style.stepSubtitle}>
          Create a strong password for your account
        </p>

        <div className={style.formGroup}>
          <label htmlFor="password" className={style.formLabel}>
            Password *
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            className={style.formControl}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="confirmPassword" className={style.formLabel}>
            Confirm Password *
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            className={style.formControl}
            required
          />
          {error && <div className={style.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default RegisterStepPassword;
