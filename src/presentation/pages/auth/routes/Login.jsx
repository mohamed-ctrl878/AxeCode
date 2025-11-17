// import baseLogin from "@/domain/usecases/baseLoginExe";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import style from "@presentation/styles/pages/login.module.css";
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
  console.log(captchaToken);

  const formRef = useRef(null);

  const { handleSubmit } = useBaseLogin({
    identifier: email,
    password,
    recaptchaToken: captchaToken,
    setError,
  });
  return (
    <div className={`${style.loginContainer} `}>
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

        <form noValidate onSubmit={handleSubmit}>
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
          </div>
          {error && <div className="form-error">{error}</div>}
          <ReCapatcha setCaptchaToken={setCaptchaToken} />

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
            <Link to="/forget-password" className="link">
              I forget my password -&gt;
            </Link>
          </p>
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
