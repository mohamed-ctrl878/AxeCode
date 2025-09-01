import React from "react";

 const RegisterStepBasicInfo = ({
  style,
  username,
  setUsername,
  email,
  setEmail,
  usernameErr,
  emailErr,
}) => {
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
