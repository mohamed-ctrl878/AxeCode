import { infoRigisterValidDataContainer } from "@core/utils/validationFroms/validationReg";
import { setRegisterDataStore } from "@data/storage/storeRx/globalStore/registerDataSteps";
import useHndillerRigisterInfo from "@presentation/shared/hooks/useHndillerRigisterInfo";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RegisterStepProfile = ({ style }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const state = useSelector((state) => state.registerDataSteps);
  console.log(state);

  useHndillerRigisterInfo(
    JSON.stringify({
      firstname: firstName,
      lastname: lastName,
      birthday: birthDate,
      phone: phone,
    }),
    setRegisterDataStore,
    infoRigisterValidDataContainer,
    setError
  );

  return (
    <div className={`${style.step} ${style.active}`} id="step3">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Profile Information</h3>
        <p className={style.stepSubtitle}>Tell us a bit more about yourself</p>

        {/* First Name */}
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
        </div>

        {/* Last Name */}
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
        </div>

        {/* Date of Birth */}
        <div className={style.formGroup}>
          <label htmlFor="birthDate" className={style.formLabel}>
            Date of Birth *
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            id="birthDate"
            className={style.formControl}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="phone" className={style.formLabel}>
            Phone Number (Egypt) *
          </label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ minWidth: "60px" }}>+20</span>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="phone"
              className={style.formControl}
              required
            />
          </div>
          {error && <div className={style.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default RegisterStepProfile;
