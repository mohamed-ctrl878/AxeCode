import React, { useState } from "react";
import styles from "@presentation/styles/components/clender.module.css"; // LeetCodeProgress.jsx

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const renderHeader = () => (
    <div className={`sec-bg ${styles.header}`}>
      <button
        className={styles.headerButton}
        onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
      >
        {"<"}
      </button>
      <span className={styles.headerTitle}>
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button
        className={styles.headerButton}
        onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
      >
        {">"}
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = "E";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className={styles.dayName}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className={styles.daysRow}>{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "d");
        const isToday = isSameDay(day, today);
        const inMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={cloneDay}
            className={` ${styles.cell} ${
              !inMonth ? styles.cellInactive : ""
            } ${isToday ? styles.cellToday : ""}`}
          >
            {formattedDate}
            {Math.random() > 0.7 && <span className={styles.dot}></span>}
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div className={styles.cellsRow} key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderPremiumWeeks = () => {
    return (
      <div className={` ${styles.premiumBox}`}>
        <span className={styles.premiumTitle}>Weekly Premium</span>
        <div className={styles.premiumWeeks}>
          {["W1", "W2", "W3", "W4", "W5"].map((w, i) => (
            <div
              key={i}
              className={i < 2 ? styles.premiumActive : styles.premiumInactive}
            >
              {w}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`sec-bg ${styles.calendar}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderPremiumWeeks()}
    </div>
  );
};

export default Calendar;
