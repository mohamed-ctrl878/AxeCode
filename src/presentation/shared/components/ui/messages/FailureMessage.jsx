import React from "react";
import styles from "@presentation/styles/components/SuccessMessage.module.css";

export default function FailureMessage({ children }) {
  return (
    <div className={styles.err}>
      <div className={styles.iconErr}>ْx</div>
      <span className={styles.textErr}>{children}</span>
    </div>
  );
}
