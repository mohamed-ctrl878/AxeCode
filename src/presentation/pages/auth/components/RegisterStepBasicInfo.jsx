import { registerUserAdminHandeller } from "@core/utils/problemUploader/handellers";
import { CheckerForIdintify } from "@data/repositories/userImps/CheckerForIdintify";
import useCheckUserIdentifierFound from "@domain/usecases/user/useCheckUserIdentifierFound";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const RegisterStepBasicInfo = ({
  style,
  // username,
  setUsername,
  // email,
  setEmail,
  usernameErr,
  emailErr,
}) => {
  const [data, setData] = useState({ username: "", email: "" });
  const [checkEmail, setCheckEmail] = useState(0);
  const [checkUsername, setCheckUsername] = useState(0);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  console.log(checkEmail, "emeil");
  console.log(checkUsername, "checkUsername");
  useCheckUserIdentifierFound({
    core: new CheckerForIdintify(),
    data,
    setCheckUsername,
    setCheckEmail,
    setError,
  });

  return (
    <div className={`${style.step} ${style.active}`} id="step1">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Basic Information</h3>
        <p className={style.stepSubtitle}>Enter your basic account details</p>

        <div className={style.formGroup}>
          <label htmlFor="username" className={style.formLabel}>
            Username *
          </label>
          <input
            placeholder="Enter username"
            value={data.username}
            onChange={(e) =>
              setData(
                registerUserAdminHandeller("username", e, { email: data.email })
              )
            }
            id="username"
            className={style.formControl}
            required
          />
          {usernameErr && <div className={style.error}>{usernameErr}</div>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="email" className={style.formLabel}>
            Email *
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) =>
              setData(
                registerUserAdminHandeller("email", e, {
                  username: data.username,
                })
              )
            }
            id="email"
            className={style.formControl}
            required
          />
          {emailErr && <div className={style.error}>{emailErr}</div>}
        </div>
      </div>
    </div>
  );
};

export default RegisterStepBasicInfo;
