import React, { useEffect, useState } from "react";
import styles from "@presentation/styles/components/ProgressBar.module.css"; // LeetCodeProgress.jsx

const LeetCodeProgress = ({
  easy = { solved: 150, total: 800 },
  medium = { solved: 80, total: 1700 },
  hard = { solved: 30, total: 700 },
  size = "medium", // 'small', 'medium', 'large' or number
  strokeWidth,
  className = "",
}) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSolved = easy.solved + medium.solved + hard.solved;
  const totalQuestions = easy.total + medium.total + hard.total;

  const easyPercentage = easy.total > 0 ? (easy.solved / easy.total) * 100 : 0;
  const mediumPercentage =
    medium.total > 0 ? (medium.solved / medium.total) * 100 : 0;
  const hardPercentage = hard.total > 0 ? (hard.solved / hard.total) * 100 : 0;
  const totalPercentage =
    totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

  // Get actual size
  const getSize = () => {
    if (typeof size === "number") return size;
    return { small: 100, medium: 120, large: 160 }[size] || 120;
  };

  const actualSize = getSize();
  const actualStrokeWidth =
    strokeWidth || (actualSize <= 100 ? 6 : actualSize <= 120 ? 8 : 10);
  const center = actualSize / 2;
  const radius = center - actualStrokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Animation trigger
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [hoveredSection]);

  const getDisplayData = () => {
    switch (hoveredSection) {
      case "easy":
        return {
          percentage: easyPercentage,
          solved: easy.solved,
          total: easy.total,
          color: "#00b8a3",
          label: "Easy",
        };
      case "medium":
        return {
          percentage: mediumPercentage,
          solved: medium.solved,
          total: medium.total,
          color: "#ffb800",
          label: "Medium",
        };
      case "hard":
        return {
          percentage: hardPercentage,
          solved: hard.solved,
          total: hard.total,
          color: "#ff375f",
          label: "Hard",
        };
      case "total":
        return {
          percentage: totalPercentage,
          solved: totalSolved,
          total: totalQuestions,
          color: "url(#multiGradient)",
          label: "Total",
        };
      default:
        return {
          percentage: totalPercentage,
          solved: totalSolved,
          total: totalQuestions,
          color: "multi",
          label: "Solved",
        };
    }
  };

  const displayData = getDisplayData();

  // CSS variables
  const cssVariables = {
    "--size": `${actualSize}px`,
    "--stroke-width": `${actualStrokeWidth}px`,
    "--circumference": circumference,
    "--stroke-dashoffset":
      circumference - (displayData.percentage / 100) * circumference,
    "--percentage-size": `${actualSize / 5}px`,
    "--solved-size": `${actualSize / 10}px`,
    "--label-size": `${actualSize / 12}px`,
  };

  // Class names
  const containerClasses = [
    styles.container,
    typeof size === "string" ? styles[size] : "",
    isAnimating ? styles.entering : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderMultiColorSegments = () => {
    const segments = [
      {
        percentage: easyPercentage,
        color: "#00b8a3",
        solved: easy.solved,
        total: easy.total,
      },
      {
        percentage: mediumPercentage,
        color: "#ffb800",
        solved: medium.solved,
        total: medium.total,
      },
      {
        percentage: hardPercentage,
        color: "#ff375f",
        solved: hard.solved,
        total: hard.total,
      },
    ];

    let cumulativeOffset = 0;

    return segments.map((segment, index) => {
      if (segment.percentage === 0) return null;

      const segmentArc = (segment.percentage / 100) * circumference;
      const segmentDashArray = `${segmentArc} ${circumference}`;
      const segmentDashOffset = -cumulativeOffset;

      cumulativeOffset += segmentArc;

      return (
        <circle
          key={`segment-${index}`}
          cx={center}
          cy={center}
          r={radius}
          className={styles.progressSegment}
          style={{
            stroke: segment.color,
            strokeDasharray: segmentDashArray,
            strokeDashoffset: segmentDashOffset,
            transition:
              "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, stroke 0.3s ease",
          }}
        />
      );
    });
  };

  const renderSingleColorProgress = () => (
    <circle
      cx={center}
      cy={center}
      r={radius}
      className={styles.progressCircle}
      style={{
        stroke: displayData.color,
        strokeDasharray: circumference,
        strokeDashoffset:
          circumference - (displayData.percentage / 100) * circumference,
        transition:
          "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease, opacity 0.4s ease",
      }}
    />
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        className={containerClasses}
        style={cssVariables}
        onMouseEnter={() => setHoveredSection("total")}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <svg className={styles.svg}>
          <defs>
            <linearGradient
              id="multiGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#00b8a3" />
              <stop offset="50%" stopColor="#ffb800" />
              <stop offset="100%" stopColor="#ff375f" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className={styles.backgroundCircle}
          />

          {/* Progress circles */}
          {hoveredSection && hoveredSection !== "total"
            ? renderSingleColorProgress()
            : hoveredSection === "total"
            ? renderMultiColorSegments() // عرض كل الألوان عند الهوفر على الدائرة
            : renderMultiColorSegments()}
        </svg>

        {/* Center text */}
        <div
          className={styles.textContainer}
          style={{
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            className={styles.percentage}
            style={{
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              color:
                hoveredSection === "easy"
                  ? "#00b8a3"
                  : hoveredSection === "medium"
                  ? "#ffb800"
                  : hoveredSection === "hard"
                  ? "#ff375f"
                  : "",
            }}
          >
            {Math.round(displayData.percentage)}%
          </div>
          <div
            className={styles.solved}
            style={{
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {displayData.solved}/{displayData.total}
          </div>
          <div
            className={styles.label}
            style={{
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {displayData.label}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {[
          {
            key: "easy",
            color: "#00b8a3",
            label: `Easy ${easy.solved}/${easy.total}`,
            data: easy,
          },
          {
            key: "medium",
            color: "#ffb800",
            label: `Medium ${medium.solved}/${medium.total}`,
            data: medium,
          },
          {
            key: "hard",
            color: "#ff375f",
            label: `Hard ${hard.solved}/${hard.total}`,
            data: hard,
          },
        ].map((item) => (
          <div
            key={item.key}
            className={styles.legendItem}
            style={{
              backgroundColor:
                hoveredSection === item.key ? `${item.color}20` : "transparent",
            }}
            onMouseEnter={() => setHoveredSection(item.key)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div
              className={styles.legendDot}
              style={{
                backgroundColor: item.color,
                transform:
                  hoveredSection === item.key ? "scale(1.3)" : "scale(1)",
                boxShadow:
                  hoveredSection === item.key
                    ? `0 0 8px ${item.color}40`
                    : "none",
              }}
            />
            <span
              className={styles.legendText}
              style={{
                color: hoveredSection === item.key ? item.color : "#6b7280",
                fontWeight: hoveredSection === item.key ? "600" : "500",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeetCodeProgress;

// Usage Example
