import React, { useState } from "react";
import style from "@presentation/styles/pages/login.module.css";
import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
import { forgetPassExe } from "@domain/usecases/user/forgetPassExe";
import { ForgetPasswordClass } from "@data/repositories/userImps/ForgetPasswordClass";
import useResetPasswordProccess from "@presentation/shared/hooks/useResetPasswordProccess";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  console.log(error);
  const forgetProccess = useResetPasswordProccess({
    dataModel: { email: email },
    setError,
    setSuccess,
    core: new ForgetPasswordClass(),
    exeuter: forgetPassExe,
    fireOnSuccess: false,
  });
  if (success)
    return (
      <div className={`${style.loginContainer} `}>
        {" "}
        <p> {<div className="form-success">{success}</div>}</p>
      </div>
    );
  return (
    <div className={`${style.loginContainer} `}>
      <form
        onSubmit={(e) => {
          forgetProccess(e);
        }}
        noValidate
      >
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
            onChange={(e) => setEmail(handelChangeValueBasic(e))}
            required
          />
          <p> {error && <div className="form-error">{error}</div>}</p>
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

export default ForgetPassword;
