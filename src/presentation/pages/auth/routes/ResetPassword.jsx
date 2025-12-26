import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import styles from "@presentation/styles/pages/auth.module.css";
import { ResetPasswordClass } from "@data/repositories/userImps/ResetPasswordClass";
import useResetPasswordProccess from "@presentation/shared/hooks/useResetPasswordProccess";
import { resetPassExe } from "@domain/usecases/user/resetPassExe";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigate();

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const resetProccess = useResetPasswordProccess({
    dataModel: {
      code: code,
      password: password,
      passwordConfirmation: confirmPassword,
    },
    setError,
    setSuccess,
    core: new ResetPasswordClass(),
    exeuter: resetPassExe,
    fireOnSuccess: () => {
      setTimeout(() => {
        navigation("/login");
      }, 3000);
    },
  });

  if (success) {
    return (
      <div className={styles.authContainer}>
        {/* Left Side - Success Message */}
        <div className={styles.authFormSide}>
          <div className={styles.formWrapper}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>AxeCode</div>
            </div>

            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>Password Reset! 🔓</h1>
              <p className={styles.authSubtitle}>
                Your password has been successfully updated.
              </p>
            </div>

            <div className={styles.formSuccess}>{success}</div>

            <div className={styles.formLinks}>
              <p style={{ color: "var(--text-secondary)" }}>
                Redirecting to login in 3 seconds...
              </p>
              <Link to="/login" className={styles.linkPrimary}>
                Go to Login Now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Success Image */}
        <div className={styles.authImageSide}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.placeholderIcon}>✨</div>
            <h2 className={styles.placeholderText}>All Set!</h2>
            <p className={styles.placeholderSubtext}>
              Your account is secure and ready to use.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      {/* Left Side - Form */}
      <div className={styles.authFormSide}>
        <div className={styles.formWrapper}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <div className={styles.logo}>AxeCode</div>
          </div>

          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Reset Password</h1>
            <p className={styles.authSubtitle}>
              Create a new, strong password for your account.
            </p>
          </div>

          {/* Error Message */}
          {error && <div className={styles.formError}>{error}</div>}

          {/* Form */}
          <form
            onSubmit={(e) => {
              resetProccess(e);
            }}
            noValidate
          >
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                New Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.formInput}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={styles.formInput}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Reset Password
            </button>
          </form>

          {/* Links */}
          <div className={styles.formLinks}>
            <Link to="/login" className={styles.formLink}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className={styles.authImageSide}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.placeholderIcon}>🛡️</div>
          <h2 className={styles.placeholderText}>Security First</h2>
          <p className={styles.placeholderSubtext}>
            Protect your account with a strong, unique password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
