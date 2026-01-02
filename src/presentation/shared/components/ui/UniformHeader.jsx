import React from 'react';
import styles from './SharedUI.module.css';

/**
 * UniformHeader component for consistent page headers.
 * 
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle
 * @param {Array} stats - Array of { value, label } objects
 */
const UniformHeader = ({ title, subtitle, stats = [] }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        
        {stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniformHeader;
