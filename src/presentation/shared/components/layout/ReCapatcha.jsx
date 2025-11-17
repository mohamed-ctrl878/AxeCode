import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ReCapatcha = ({ setCaptchaToken }) => {
  return (
    <>
      <ReCAPTCHA
        onChange={(e) => setCaptchaToken(e)}
        sitekey="6Lf3b9grAAAAAFD8_OxYnUNo5l2Sn7FKTTc0I55z"
      ></ReCAPTCHA>
    </>
  );
};

export default ReCapatcha;
