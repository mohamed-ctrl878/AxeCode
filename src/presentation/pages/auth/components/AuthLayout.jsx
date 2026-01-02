import React from 'react';
import styles from "@presentation/styles/pages/auth.module.css";

/**
 * AuthLayout component to provide the standard split-screen layout for authentication pages.
 * 
 * @param {string} title - The main heading for the form side.
 * @param {string} subtitle - The sub-heading for the form side.
 * @param {string} rightTitle - Title shown on the illustration side.
 * @param {string} rightSubtext - Subtext shown on the illustration side.
 * @param {string} rightIcon - Icon/Emoji shown on the illustration side.
 * @param {React.ReactNode} children - The form content.
 */
const AuthLayout = ({ 
  title, 
  subtitle, 
  children,
  rightTitle = "Start Your Coding Journey",
  rightSubtext = "Master programming skills with interactive lessons and real-world projects",
  rightIcon = "💻" 
}) => {
  return (
    <div className={styles.authContainer}>
      {/* Left Side - Form */}
      <div className={styles.authFormSide}>
        <div className={styles.formWrapper}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <div className={styles.logo}>AxeCode</div>
          </div>

          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>{title}</h1>
            {subtitle && <p className={styles.authSubtitle}>{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className={styles.authImageSide}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.placeholderIcon}>{rightIcon}</div>
          <h2 className={styles.placeholderText}>{rightTitle}</h2>
          <p className={styles.placeholderSubtext}>{rightSubtext}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
