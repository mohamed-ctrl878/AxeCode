import React, { useState } from "react";
import { Link } from "react-router-dom";

// Shared Components
// import {
//   MultibleFrom,
//   SwitchersBtnsMForm,
// } from "@presentation/shared/components/form";

// Local Components
// import { RegisterStepBasicInfo } from "../components/RegisterStepBasicInfo";
// import { RegisterStepPassword } from "../components/RegisterStepPassword";
// import { RegisterStepProfile } from "../components/RegisterStepProfile";
// import { RegisterStepReview } from "../components/RegisterStepReview";

// Styles
import style from "@presentation/styles/pages/register-multi-step.module.css";
import RegisterStepBasicInfo from "../components/RegisterStepBasicInfo";
import RegisterStepPassword from "../components/RegisterStepPassword";
import RegisterStepProfile from "../components/RegisterStepProfile";
import RegisterStepReview from "../components/RegisterStepReview";
import MultibleFrom from "@presentation/shared/components/form/MultibleFrom";
import SwitchersBtnsMForm from "@presentation/shared/components/form/SwitchersBtnsMForm";


const RegisterMultiStep = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  // Error states
  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [firstNameErr, setFirstNameErr] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");

  // Get steps
  const getSteps = () => {
    return [
      <RegisterStepBasicInfo
        style={style}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        usernameErr={usernameErr}
        emailErr={emailErr}
      />,
      <RegisterStepPassword
        style={style}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        passwordErr={passwordErr}
        confirmPasswordErr={confirmPasswordErr}
      />,
      <RegisterStepProfile
        style={style}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        bio={bio}
        setBio={setBio}
        firstNameErr={firstNameErr}
        lastNameErr={lastNameErr}
      />,
      <RegisterStepReview
        style={style}
        username={username}
        email={email}
        firstName={firstName}
        lastName={lastName}
        bio={bio}
      />,
    ];
  };

  const steps = getSteps();
  const size = steps.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === size - 1) {
      // Validate and submit
      console.log("Submitting registration:", {
        username,
        email,
        password,
        firstName,
        lastName,
        bio,
      });
    }
  };

  return (
    <div className={`${style.registerMultiStepContainer} ${themeClass}`}>
      <div
        className="card card-elevated"
        style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <MultibleFrom
            current={currentStep}
            size={size}
            style={style}
            title="Create Account"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "2rem" }}>{steps[currentStep]}</div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <SwitchersBtnsMForm
              style={style}
              SetCurrentStep={setCurrentStep}
              currentStep={currentStep}
              size={size}
            />
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/login" className="link">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterMultiStep;
