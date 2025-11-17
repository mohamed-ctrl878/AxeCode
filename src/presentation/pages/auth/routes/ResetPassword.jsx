import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import style from "@presentation/styles/pages/login.module.css";
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
  console.log(code);
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
  if (success)
    return (
      <div className={`${style.loginContainer} `}>
        <p> {<div className="form-success">{success}</div>}</p>
      </div>
    );

  return (
    <div className={`${style.loginContainer} `}>
      <form
        onSubmit={(e) => {
          resetProccess(e);
        }}
        noValidate
      >
        <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="Enter your confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <p> {error && <div className="form-error">something error</div>}</p>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
