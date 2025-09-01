import React, { useState, useMemo } from "react";

// CSS Modules styles
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: "1.5",
  },

  header: {
    marginBottom: "24px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#24292f",
    marginBottom: "8px",
    margin: "0",
  },

  subtitle: {
    color: "#656d76",
    fontSize: "14px",
    margin: "0",
  },

  graphContainer: {
    position: "relative",
    marginBottom: "24px",
  },

  monthLabels: {
    display: "flex",
    marginBottom: "8px",
    paddingLeft: "40px",
  },

  monthLabel: {
    flex: "1",
    fontSize: "12px",
    color: "#656d76",
    textAlign: "left",
  },

  graphWrapper: {
    display: "flex",
    alignItems: "flex-start",
  },

  dayLabels: {
    display: "flex",
    flexDirection: "column",
    marginRight: "8px",
    fontSize: "12px",
    color: "#656d76",
    width: "32px",
  },

  dayLabel: {
    height: "15px",
    display: "flex",
    alignItems: "center",
    marginBottom: "2px",
  },

  contributionsGrid: {
    display: "flex",
    gap: "2px",
    flex: "1",
  },

  weekColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  contributionCell: {
    width: "11px",
    height: "11px",
    borderRadius: "2px",
    border: "1px solid #e1e4e8",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
  },

  contributionCellHover: {
    borderColor: "#0969da",
    transform: "scale(1.1)",
  },

  level0: {
    backgroundColor: "#ebedf0",
  },

  level1: {
    backgroundColor: "#9be9a8",
  },

  level2: {
    backgroundColor: "#40c463",
  },

  level3: {
    backgroundColor: "#30a14e",
  },

  level4: {
    backgroundColor: "#216e39",
  },

  emptyCell: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "default",
  },

  tooltip: {
    position: "absolute",
    background: "#24292f",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: "1000",
    opacity: "0",
    transform: "translateX(-50%) translateY(-8px)",
    transition: "opacity 0.2s, transform 0.2s",
    bottom: "100%",
    left: "50%",
  },

  tooltipShow: {
    opacity: "1",
  },

  tooltipArrow: {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    border: "4px solid transparent",
    borderTopColor: "#24292f",
  },

  legendContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e1e4e8",
  },

  legendText: {
    fontSize: "12px",
    color: "#656d76",
    cursor: "pointer",
    textDecoration: "none",
  },

  legendScale: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  legendLabel: {
    fontSize: "12px",
    color: "#656d76",
  },

  legendSquares: {
    display: "flex",
    gap: "2px",
  },

  legendSquare: {
    width: "11px",
    height: "11px",
    borderRadius: "2px",
    border: "1px solid #e1e4e8",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "24px",
  },

  statCard: {
    background: "#f6f8fa",
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
  },

  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#24292f",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "12px",
    color: "#656d76",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
};

const ContributionGraph = () => {
  // Generate sample contribution data for the last year
  const generateContributionData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const contributions = Math.floor(Math.random() * 20);
      data.push({
        date: new Date(d),
        count: contributions,
        level:
          contributions === 0
            ? 0
            : contributions <= 3
            ? 1
            : contributions <= 7
            ? 2
            : contributions <= 12
            ? 3
            : 4,
      });
    }
    return data;
  };

  const [contributionData] = useState(generateContributionData());
  const [hoveredCell, setHoveredCell] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Group data by weeks
  const weeklyData = useMemo(() => {
    const weeks = [];
    let currentWeek = [];

    contributionData.forEach((day, index) => {
      if (index === 0) {
        const dayOfWeek = day.date.getDay();
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push(null);
        }
      }

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [contributionData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalContributions = contributionData.reduce(
      (sum, day) => sum + day.count,
      0
    );
    const activeDays = contributionData.filter((day) => day.count > 0).length;
    const bestDay = Math.max(...contributionData.map((day) => day.count));
    const averagePerWeek = Math.round(totalContributions / 52);

    return { totalContributions, activeDays, bestDay, averagePerWeek };
  }, [contributionData]);

  // Get style object for contribution level
  const getLevelStyle = (level) => {
    const levelStyles = {
      0: styles.level0,
      1: styles.level1,
      2: styles.level2,
      3: styles.level3,
      4: styles.level4,
    };
    return levelStyles[level] || styles.level0;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMonthLabels = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();
    const labels = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push({
        name: months[date.getMonth()],
        show: i % 2 === 1,
      });
    }

    return labels;
  };

  const handleCellMouseEnter = (day, event) => {
    if (day) {
      setHoveredCell(day);
      const rect = event.target.getBoundingClientRect();
      setMousePos({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Contribution Graph</h2>
        <p style={styles.subtitle}>
          {stats.totalContributions} contributions in the last year
        </p>
      </div>

      <div style={styles.graphContainer}>
        {/* Month labels */}
        <div style={styles.monthLabels}>
          {getMonthLabels().map((month, index) => (
            <div key={index} style={styles.monthLabel}>
              {month.show ? month.name : ""}
            </div>
          ))}
        </div>

        <div style={styles.graphWrapper}>
          {/* Day labels */}
          <div style={styles.dayLabels}>
            {["Sun", "", "Tue", "", "Thu", "", "Sat"].map((day, index) => (
              <div key={index} style={styles.dayLabel}>
                {day}
              </div>
            ))}
          </div>

          {/* Contributions grid */}
          <div style={styles.contributionsGrid}>
            {weeklyData.map((week, weekIndex) => (
              <div key={weekIndex} style={styles.weekColumn}>
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    style={{
                      ...styles.contributionCell,
                      ...(day ? getLevelStyle(day.level) : styles.emptyCell),
                      ...(hoveredCell === day
                        ? styles.contributionCellHover
                        : {}),
                    }}
                    onMouseEnter={(e) => handleCellMouseEnter(day, e)}
                    onMouseLeave={handleCellMouseLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div
            style={{
              ...styles.tooltip,
              ...(hoveredCell ? styles.tooltipShow : {}),
              position: "fixed",
              left: mousePos.x,
              top: mousePos.y - 60,
              transform: "translateX(-50%)",
            }}
          >
            <div>{hoveredCell.count} contributions</div>
            <div>{formatDate(hoveredCell.date)}</div>
            <div style={styles.tooltipArrow}></div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={styles.legendContainer}>
        <a href="#" style={styles.legendText}>
          Learn how we count contributions
        </a>
        <div style={styles.legendScale}>
          <span style={styles.legendLabel}>Less</span>
          <div style={styles.legendSquares}>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  ...styles.legendSquare,
                  ...getLevelStyle(level),
                }}
              />
            ))}
          </div>
          <span style={styles.legendLabel}>More</span>
        </div>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalContributions}</div>
          <div style={styles.statLabel}>Total contributions</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.activeDays}</div>
          <div style={styles.statLabel}>Days contributed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.bestDay}</div>
          <div style={styles.statLabel}>Best day</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.averagePerWeek}</div>
          <div style={styles.statLabel}>Average per week</div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
