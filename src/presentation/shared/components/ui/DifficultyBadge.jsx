import React from 'react';
import styles from './SharedUI.module.css';

/**
 * DifficultyBadge component for consistent difficulty labeling.
 * 
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 */
const DifficultyBadge = ({ difficulty }) => {
  const getDifficultyClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return styles.difficultyEasy;
      case 'medium':
        return styles.difficultyMedium;
      case 'hard':
        return styles.difficultyHard;
      default:
        return styles.difficultyEasy;
    }
  };

  return (
    <span className={`${styles.badge} ${getDifficultyClass(difficulty)}`}>
      {difficulty || 'All Levels'}
    </span>
  );
};

export default DifficultyBadge;
