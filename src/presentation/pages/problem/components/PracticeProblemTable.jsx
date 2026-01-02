import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "@presentation/styles/pages/practice.module.css";
import DifficultyBadge from "@presentation/shared/components/ui/DifficultyBadge";

/**
 * PracticeProblemTable component to display a list of coding problems in a table format.
 * Optimized for the new Brutalist design.
 * 
 * @param {Array} problems - Array of problem objects.
 */
const PracticeProblemTable = ({ problems }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "solved":
        return styles.statusSolved;
      case "unsolved":
        return styles.statusUnsolved;
      default:
        return styles.statusUnsolved;
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.problemsTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Problem</th>
            <th>Difficulty</th>
            <th className={styles.colCategory}>Category</th>
            <th className={styles.colStatus}>Status</th>
            <th className={styles.colSubmissions}>Submissions</th>
            <th className={styles.colAcceptance}>Acceptance Rate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <div>
                  <div className={styles.problemTitle}>
                    {problem.title}
                  </div>
                  <div className={styles.problemDesc}>
                    {problem.description}
                  </div>
                </div>
              </td>
              <td className={styles.tableCell}>
                <DifficultyBadge difficulty={problem.difficulty} />
              </td>
              <td className={`${styles.tableCell} ${styles.colCategory}`}>
                {problem.category
                  .split("-")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ")}
              </td>
              <td className={`${styles.tableCell} ${styles.colStatus}`}>
                <span
                  className={`${styles.statusBadge} ${getStatusColor(
                    problem.status
                  )}`}
                >
                  {problem.status}
                </span>
              </td>
              <td className={`${styles.tableCell} ${styles.colSubmissions}`}>
                {problem.submissions.toLocaleString()}
              </td>
              <td className={`${styles.tableCell} ${styles.colAcceptance}`}>
                {problem.acceptanceRate}%
              </td>
              <td className={styles.tableCell}>
                <button
                  className={styles.actionButton}
                  onClick={() => navigate(`/problem/${problem.id}`)}
                >
                  {problem.status === "solved" ? "Review" : "Solve"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PracticeProblemTable;
