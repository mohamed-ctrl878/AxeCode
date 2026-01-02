import React from 'react';
import Loader from './loader/Loader';

/**
 * StatusHandler component to handle loading, error, and empty states consistently.
 * 
 * @param {boolean} loading - Loading state
 * @param {string|object} error - Error state/message
 * @param {any} data - Data to check for empty state
 * @param {function} renderEmpty - Optional function to render custom empty state
 * @param {React.ReactNode} children - Content to render when data is present
 * @param {string} theme - Theme class
 */
const StatusHandler = ({ 
  loading, 
  error, 
  data, 
  renderEmpty, 
  children,
  theme 
}) => {
  if (loading) {
    return <Loader theme={theme} />;
  }

  if (error) {
    const errorMsg = typeof error === 'string' ? error : (error.message || "Something went wrong");
    return (
      <div className="card card-elevated" style={{ textAlign: "center", padding: "3rem", margin: "2rem auto", maxWidth: "800px" }}>
        <h3 style={{ color: "var(--error)", marginBottom: "1rem" }}>
          Error
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          {errorMsg}
        </p>
      </div>
    );
  }

  const isEmpty = !data || (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    return renderEmpty ? renderEmpty() : (
      <div className="card card-elevated" style={{ textAlign: "center", padding: "3rem", margin: "2rem auto", maxWidth: "800px" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>No results found</h3>
        <p style={{ color: "var(--text-secondary)" }}>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return children;
};

export default StatusHandler;
