import { registerUserAdminHandeller } from "@core/utils/problemUploader/handellers";
import { CheckerForIdintify } from "@data/repositories/userImps/CheckerForIdintify";
import useCheckUserIdentifierFound from "@domain/usecases/user/useCheckUserIdentifierFound";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "@presentation/styles/pages/auth.module.css";

const RegisterStepBasicInfo = ({
  style,
  setUsername,
  setEmail,
  usernameErr,
  emailErr,
}) => {
  const [data, setData] = useState({ username: "", email: "" });
  const [checkEmail, setCheckEmail] = useState(0);
  const [checkUsername, setCheckUsername] = useState(0);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  useCheckUserIdentifierFound({
    core: new CheckerForIdintify(),
    data,
    setCheckUsername,
    setCheckEmail,
    setError,
    setLoader,
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "0 0 0.5rem 0",
          }}
        >
          Basic Information
        </h3>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Enter your basic account details
        </p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.formLabel}>
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
          className={styles.formInput}
          required
        />
        {usernameErr && (
          <div
            style={{
              color: "var(--accent-red)",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            {usernameErr}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>
          Email *
        </label>
        <input
          type="email"
          placeholder="your-email@example.com"
          value={data.email}
          onChange={(e) =>
            setData(
              registerUserAdminHandeller("email", e, {
                username: data.username,
              })
            )
          }
          id="email"
          className={styles.formInput}
          required
        />
        {emailErr && (
          <div
            style={{
              color: "var(--accent-red)",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            {emailErr}
          </div>
        )}
      </div>

      {error && <div className={styles.formError}>{error}</div>}
    </div>
  );
};

export default RegisterStepBasicInfo;
