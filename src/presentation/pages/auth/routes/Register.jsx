import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "@presentation/styles/pages/auth.module.css";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setUsernameErr("");
    setEmailErr("");
    setPasswordErr("");
    setConfirmPasswordErr("");

    // Validation
    if (!username) {
      setUsernameErr("Username is required");
      return;
    }

    if (!email) {
      setEmailErr("Email is required");
      return;
    }

    if (!password) {
      setPasswordErr("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordErr("Passwords do not match");
      return;
    }

    // Handle registration logic here
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our community today"
      rightTitle="Expand Your Skills"
      rightIcon="🚀"
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabel}>
            Username
          </label>
          <input
            type="text"
            id="username"
            className={styles.formInput}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {usernameErr && <div className={styles.formError}>{usernameErr}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email
          </label>
          <input
            type="email"
            id="email"
            className={styles.formInput}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailErr && <div className={styles.formError}>{emailErr}</div>}
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
          {passwordErr && <div className={styles.formError}>{passwordErr}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.formLabel}>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={styles.formInput}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPasswordErr && (
            <div className={styles.formError}>{confirmPasswordErr}</div>
          )}
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Create Account
        </button>
      </form>

      <div className={styles.formLinks}>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" className={styles.linkPrimary}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
