import React from "react";

const RegisterStepProfile = ({
  style,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  bio,
  setBio,
  firstNameErr,
  lastNameErr,
}) => {
  return (
    <div className={`${style.step} ${style.active}`} id="step3">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Profile Information</h3>
        <p className={style.stepSubtitle}>Tell us a bit more about yourself</p>

        <div className={style.formGroup}>
          <label htmlFor="firstName" className={style.formLabel}>
            First Name *
          </label>
          <input
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            id="firstName"
            className={style.formControl}
            required
          />
          {firstNameErr && <div className={style.error}>{firstNameErr}</div>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="lastName" className={style.formLabel}>
            Last Name *
          </label>
          <input
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            id="lastName"
            className={style.formControl}
            required
          />
          {lastNameErr && <div className={style.error}>{lastNameErr}</div>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="bio" className={style.formLabel}>
            Bio
          </label>
          <textarea
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            id="bio"
            className={style.formControl}
            rows="4"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterStepProfile;
