import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import style from "@presentation/styles/pages/register-multi-step.module.css";
import RegisterStepBasicInfo from "../components/RegisterStepBasicInfo";
import RegisterStepPassword from "../components/RegisterStepPassword";
import RegisterStepProfile from "../components/RegisterStepProfile";
import RegisterStepReview from "../components/RegisterStepReview";
import MultibleFrom from "@presentation/shared/components/form/MultibleFrom";
import SwitchersBtnsMForm from "@presentation/shared/components/form/SwitchersBtnsMForm";
import FetchingStep from "@presentation/shared/components/form/FetchingStep";
import { RegisterDTO } from "@data/models/userDTOs/RegisterDTO";
import { basicRegisterExe } from "@domain/usecases/user/basicRegisterExe";
import RegisterAuthBase from "@data/repositories/userImps/RegesterImp";
import { useDispatch, useSelector } from "react-redux";
import { stopSuccess } from "@data/storage/storeRx/sharedSlices/validStarter";

const RegisterMultiStep = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const nav = useNavigate();

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  const successFromStore = useSelector((state) => state.validStarter.success);
  const getSteps = () => {
    return [
      <RegisterStepBasicInfo style={style} />,
      <RegisterStepPassword style={style} />,
      <RegisterStepProfile style={style} />,
      <RegisterStepReview style={style} />,
    ];
  };

  const dispatch = useDispatch();

  const steps = getSteps();
  const size = steps.length;

  console.log(successFromStore);
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
  }, [successFromStore]);

  if (successFromStore) {
    <div className={`${style.loginContainer} `}>
      <p> {<div className="form-success">{successFromStore}</div>}</p>
    </div>;
  }
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
            {currentStep === 0 || currentStep === size - 1 ? (
              <FetchingStep
                style={style}
                SetCurrentStep={setCurrentStep}
                currentStep={currentStep}
                size={size}
              ></FetchingStep>
            ) : (
              <SwitchersBtnsMForm
                style={style}
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
