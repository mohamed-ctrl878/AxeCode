import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "@presentation/styles/pages/register.module.css";

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
    console.log("Registration attempt:", { username, email, password });
  };

  return (
    <div className={style.registerContainer}>
      <div className={style.registerFormWrapper}>
        <div className={style.registerHeader}>
          <h1 className={style.registerTitle}>Create Account</h1>
          <p className={style.registerSubtitle}>Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className={style.registerForm}>
          <div className={style.formGroup}>
            <label htmlFor="username" className={style.formLabel}>
              Username
            </label>
            <input
              type="text"
              id="username"
              className={style.formControl}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {usernameErr && <div className={style.error}>{usernameErr}</div>}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="email" className={style.formLabel}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={style.formControl}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailErr && <div className={style.error}>{emailErr}</div>}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="password" className={style.formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={style.formControl}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordErr && <div className={style.error}>{passwordErr}</div>}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="confirmPassword" className={style.formLabel}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={style.formControl}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPasswordErr && (
              <div className={style.error}>{confirmPasswordErr}</div>
            )}
          </div>

          <button type="submit" className={style.registerButton}>
            Create Account
          </button>
        </form>

        <div className={style.registerFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={style.registerLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
