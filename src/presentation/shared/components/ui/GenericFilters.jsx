import React from 'react';
import styles from './SharedUI.module.css';

/**
 * GenericFilters component for search and optional filtering.
 * 
 * @param {string} searchTerm - Current search value
 * @param {function} onSearchChange - Callback for search input change
 * @param {string} placeholder - Search placeholder
 * @param {React.ReactNode} children - Optional additional filters (selects, etc.)
 */
const GenericFilters = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search...", 
  children 
}) => {
  return (
    <div className={styles.filterSection}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.searchIcon}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
      </div>
      
      {children && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default GenericFilters;
