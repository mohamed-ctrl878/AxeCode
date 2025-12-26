import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "@presentation/styles/pages/auth.module.css";
import { Link } from "react-router-dom";
import { logIn } from "@data/storage/storeRx/globalStore/userAuthSlice";
import baseLogin from "@domain/usecases/user/baseLoginExe";
import ReCapatcha from "@presentation/shared/components/layout/ReCapatcha";
import useBaseLogin from "@presentation/shared/hooks/useBaseLogin";

const Login = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const capatchaRef = useRef(null);

  const formRef = useRef(null);
  console.log(captchaToken);

  const { handleSubmit, load } = useBaseLogin({
    setCaptchaToken,
    identifier: email,
    password,
    recaptchaToken: captchaToken,
    setError,
    capatchaRef,
  });

  useEffect(() => {
    setError("");
  }, [password, email]);

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
            <h1 className={styles.authTitle}>Welcome Back</h1>
            <p className={styles.authSubtitle}>
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Error Message */}

          {/* Form */}
          <form noValidate onSubmit={handleSubmit}>
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.formInput}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <ReCapatcha ref={capatchaRef} setCaptchaToken={setCaptchaToken} />

            <button type="submit" className={styles.btnPrimary}>
              Sign In
              {load && <>....</>}
            </button>
            {error && <div className={styles.formError}>{error}</div>}
          </form>

          {/* Links */}
          <div className={styles.formLinks}>
            <Link to="/forget-password" className={styles.formLink}>
              Forgot your password?
            </Link>

            <div className={styles.divider}></div>

            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <Link to="/register" className={styles.linkPrimary}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className={styles.authImageSide}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.placeholderIcon}>💻</div>
          <h2 className={styles.placeholderText}>Start Your Coding Journey</h2>
          <p className={styles.placeholderSubtext}>
            Master programming skills with interactive lessons and real-world
            projects
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
