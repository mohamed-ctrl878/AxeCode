import React, { useState } from "react";
import styles from "@presentation/styles/pages/auth.module.css";
import { Link } from "react-router-dom";
import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
import { forgetPassExe } from "@domain/usecases/user/forgetPassExe";
import { ForgetPasswordClass } from "@data/repositories/userImps/ForgetPasswordClass";
import useResetPasswordProccess from "@presentation/shared/hooks/useResetPasswordProccess";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const forgetProccess = useResetPasswordProccess({
    dataModel: { email: email },
    setError,
    setSuccess,
    core: new ForgetPasswordClass(),
    exeuter: forgetPassExe,
    fireOnSuccess: false,
  });

  if (success) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authFormSide}>
          <div className={styles.formWrapper}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>AxeCode</div>
            </div>

            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>Check Your Email 📧</h1>
              <p className={styles.authSubtitle}>
                We've sent a password reset link to your email address.
              </p>
            </div>

            <div className={styles.formSuccess}>{success}</div>

            <div className={styles.formLinks}>
              <Link to="/login" className={styles.linkPrimary}>
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.authImageSide}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.placeholderIcon}>✉️</div>
            <h2 className={styles.placeholderText}>Check Your Inbox</h2>
            <p className={styles.placeholderSubtext}>
              Follow the link in your email to reset your password
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
            <h1 className={styles.authTitle}>Forgot Password?</h1>
            <p className={styles.authSubtitle}>
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {/* Error Message */}
          {error && <div className={styles.formError}>{error}</div>}

          {/* Form */}
          <form
            onSubmit={(e) => {
              forgetProccess(e);
            }}
            noValidate
          >
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(handelChangeValueBasic(e))}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Send Reset Link
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
          <div className={styles.placeholderIcon}>🔐</div>
          <h2 className={styles.placeholderText}>
            Secure Password Reset
          </h2>
          <p className={styles.placeholderSubtext}>
            We'll help you regain access to your account safely and securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
