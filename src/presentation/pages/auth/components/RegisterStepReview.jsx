import React from "react";

const RegisterStepReview = ({
  style,
  username,
  email,
  firstName,
  lastName,
  bio,
}) => {
  return (
    <div className={`${style.step} ${style.active}`} id="step4">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Review & Submit</h3>
        <p className={style.stepSubtitle}>
          Review your information before creating your account
        </p>

        <div className={style.reviewSection}>
          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Username:</h4>
            <p className={style.reviewValue}>{username}</p>
          </div>

          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Email:</h4>
            <p className={style.reviewValue}>{email}</p>
          </div>

          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Full Name:</h4>
            <p className={style.reviewValue}>
              {firstName} {lastName}
            </p>
          </div>

          {bio && (
            <div className={style.reviewItem}>
              <h4 className={style.reviewLabel}>Bio:</h4>
              <p className={style.reviewValue}>{bio}</p>
            </div>
          )}
        </div>

        <div className={style.submitSection}>
          <button type="submit" className={`${style.btn} ${style.btnPrimary}`}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterStepReview;
