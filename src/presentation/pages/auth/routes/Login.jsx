// import baseLogin from "@/domain/usecases/baseLoginExe";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";

// // Core
// import { baseLogin } from "@domain/usecases/baseLoginExe";
// import { logIn } from "@data/storage/storeRx/userAuthSlice";

// // Styles
import style from "@presentation/styles/pages/login.module.css";
// import style from "@presentation/styles/pages/login.module.css";
import { Link } from "react-router-dom";
import { logIn } from "@data/storage/storeRx/globalStore/userAuthSlice";
import baseLogin from "@domain/usecases/user/baseLoginExe";

const Login = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [data, setData] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  const dis = useDispatch();
  async function onLogin() {
    // e.preventDefault();
    try {
      const ss = await baseLogin({
        token: true,
        body: {
          identifier: "mohamedeleskanderwow@gmail.com",
          password: "1234567890",
        },
        url: "http://localhost:1338/api/auth/login",
        method: "POST",
      });
      setData(ss);
      dis(logIn());
    } catch (c) {
      // setErr(c.message || "unknown error");
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setEmailErr("");
    setPasswordErr("");

    // Validation
    if (!email) {
      setEmailErr("Email is required");
      return;
    }

    if (!password) {
      setPasswordErr("Password is required");
      return;
    }
    onLogin();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className={`${style.loginContainer} ${themeClass}`}>
      <div
        className="card card-elevated"
        style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
              fontSize: "2rem",
              fontWeight: "700",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailErr && <div className="form-error">{emailErr}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordErr && <div className="form-error">{passwordErr}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            Sign In
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
