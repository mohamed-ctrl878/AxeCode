import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "@presentation/styles/pages/auth.module.css";
import stepStyles from "@presentation/styles/pages/register-multi-step.module.css";
import RegisterStepBasicInfo from "../components/RegisterStepBasicInfo";
import RegisterStepPassword from "../components/RegisterStepPassword";
import RegisterStepProfile from "../components/RegisterStepProfile";
import RegisterStepReview from "../components/RegisterStepReview";
import MultibleFrom from "@presentation/shared/components/form/MultibleFrom";
import SwitchersBtnsMForm from "@presentation/shared/components/form/SwitchersBtnsMForm";
import FetchingStep from "@presentation/shared/components/form/FetchingStep";
import { RegisterDTO } from "@domain/reqs_dtos/RegisterDTO";
import { basicRegisterExe } from "@domain/usecases/user/basicRegisterExe";
import RegisterAuthBase from "@data/repositories/userImps/RegesterImp";
import { useDispatch, useSelector } from "react-redux";
import { stopSuccess } from "@data/storage/storeRx/sharedSlices/validStarter";
import { clearRegData } from "@data/storage/storeRx/globalStore/registerDataSteps";

const RegisterMultiStep = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const nav = useNavigate();

  const successFromStore = useSelector((state) => state.validStarter.success);

  const getSteps = () => {
    return [
      <RegisterStepBasicInfo style={stepStyles} />,
      <RegisterStepPassword style={stepStyles} />,
      <RegisterStepProfile style={stepStyles} />,
      <RegisterStepReview style={stepStyles} />,
    ];
  };

  const dispatch = useDispatch();

  const steps = getSteps();
  const size = steps.length;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (successFromStore) {
        nav("/login");
        dispatch(stopSuccess());
      }
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [successFromStore, nav, dispatch]);
  useEffect(() => {
    return () => {
      dispatch(clearRegData());
    };
  }, []);

  if (successFromStore) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authFormSide}>
          <div className={styles.formWrapper}>
            <div className={styles.formSuccess}>{successFromStore}</div>
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      {/* Left Side - Form */}
      <div className={styles.authFormSide}>
        <div className={styles.formWrapper}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <div className={styles.logo}>AxeCode</div>
          </div>

          {/* Progress Stepper */}
          <div style={{ marginBottom: "2.5rem" }}>
            <MultibleFrom
              current={currentStep}
              size={size}
              style={stepStyles}
              title="Create Account"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "2rem" }}>{steps[currentStep]}</div>

            {/* Navigation Buttons */}
            <div className={stepStyles.buttonGroup}>
              {currentStep === 0 || currentStep === size - 1 ? (
                <FetchingStep
                  style={stepStyles}
                  SetCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  size={size}
                />
              ) : (
                <SwitchersBtnsMForm
                  removeData={clearRegData}
                  style={stepStyles}
                  SetCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  size={size}
                  dataDTO={RegisterDTO}
                  dataStore={"registerDataSteps"}
                  caseUse={basicRegisterExe}
                  core={RegisterAuthBase}
                />
              )}
            </div>
          </form>

          {/* Footer Link */}
          <div className={styles.formLinks}>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link to="/login" className={styles.linkPrimary}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className={styles.authImageSide}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.placeholderIcon}>🚀</div>
          <h2 className={styles.placeholderText}>Join Our Community</h2>
          <p className={styles.placeholderSubtext}>
            Connect with thousands of developers and accelerate your learning
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMultiStep;
