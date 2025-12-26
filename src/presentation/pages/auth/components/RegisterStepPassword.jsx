import { validatePassword } from "@core/utils/validationFroms/validationReg";
import { setRegisterDataStore } from "@data/storage/storeRx/globalStore/registerDataSteps";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@presentation/styles/pages/auth.module.css";

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
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>
          Password Setup
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", margin: 0 }}>
          Create a strong password for your account
        </p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.formLabel}>
          Password *
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.formLabel}>
          Confirm Password *
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="confirmPassword"
          className={styles.formInput}
          required
        />
        {error && (
          <div style={{ color: "var(--accent-red)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterStepPassword;
