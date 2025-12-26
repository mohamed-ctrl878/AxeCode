import { infoRigisterValidDataContainer } from "@core/utils/validationFroms/validationReg";
import { setRegisterDataStore } from "@data/storage/storeRx/globalStore/registerDataSteps";
import useHndillerRigisterInfo from "@presentation/shared/hooks/useHndillerRigisterInfo";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@presentation/styles/pages/auth.module.css";

const RegisterStepProfile = ({ style }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const state = useSelector((state) => state.registerDataSteps);

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
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>
          Profile Information
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", margin: 0 }}>
          Tell us a bit more about yourself
        </p>
      </div>

      {/* First Name */}
      <div className={styles.formGroup}>
        <label htmlFor="firstName" className={styles.formLabel}>
          First Name *
        </label>
        <input
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          id="firstName"
          className={styles.formInput}
          required
        />
      </div>

      {/* Last Name */}
      <div className={styles.formGroup}>
        <label htmlFor="lastName" className={styles.formLabel}>
          Last Name *
        </label>
        <input
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          id="lastName"
          className={styles.formInput}
          required
        />
      </div>

      {/* Date of Birth */}
      <div className={styles.formGroup}>
        <label htmlFor="birthDate" className={styles.formLabel}>
          Date of Birth *
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          id="birthDate"
          className={styles.formInput}
          required
        />
      </div>

      {/* Phone */}
      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.formLabel}>
          Phone Number (Egypt) *
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ 
            minWidth: "60px", 
            fontWeight: 600,
            color: "var(--text-primary)",
            fontSize: "1rem"
          }}>
            +20
          </span>
          <input
            type="tel"
            placeholder="1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            id="phone"
            className={styles.formInput}
            style={{ flex: 1 }}
            required
          />
        </div>
        {error && (
          <div style={{ color: "var(--accent-red)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterStepProfile;
