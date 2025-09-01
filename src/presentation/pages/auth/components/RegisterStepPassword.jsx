import React from "react";

const RegisterStepPassword = ({
  style,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordErr,
  confirmPasswordErr,
}) => {
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
          {passwordErr && <div className={style.error}>{passwordErr}</div>}
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
          {confirmPasswordErr && (
            <div className={style.error}>{confirmPasswordErr}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterStepPassword;
