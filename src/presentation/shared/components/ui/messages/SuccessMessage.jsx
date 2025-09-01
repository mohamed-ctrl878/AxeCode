import React from "react";
import styles from "@presentation/styles/components/SuccessMessage.module.css";

export default function SuccessMessage() {
  return (
    <div className={styles.suc}>
      <div className={styles.iconSuc}>✓</div>
      <span className={styles.textSuc}>Process completed successfully!</span>
    </div>
  );
}
