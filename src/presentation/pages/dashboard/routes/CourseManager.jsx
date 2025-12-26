import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ContentDashboard from "./ContentDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChalkboardTeacher, faCalendarWeek } from "@fortawesome/free-solid-svg-icons";

const CourseManager = ({ theme }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "COURSE";

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Tab Styles (Inline for now, or use module if preferring consistent new styles)
  const tabContainerStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    borderBottom: "2px solid var(--border-medium, #ccc)",
    paddingBottom: "1rem"
  };

  const getTabStyle = (tabName) => ({
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    border: activeTab === tabName ? "3px solid var(--text-primary, #000)" : "1px solid transparent",
    backgroundColor: activeTab === tabName ? "var(--surface-card, #fff)" : "transparent",
    fontWeight: "bold",
    borderRadius: "8px 8px 0 0",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s"
  });

  return (
    <div style={{ padding: "2rem" }}> 
      {/* Header handled by children or here? Let's keep it clean here */}
      <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "2rem", textTransform: "uppercase" }}>
        Course Manager
      </h2>

      <div style={tabContainerStyle}>
        <button 
          style={getTabStyle("COURSE")} 
          onClick={() => handleTabChange("COURSE")}
        >
          <FontAwesomeIcon icon={faBook} />
          Courses
        </button>
        <button 
          style={getTabStyle("LESSON")} 
          onClick={() => handleTabChange("LESSON")}
        >
          <FontAwesomeIcon icon={faChalkboardTeacher} />
          Lessons
        </button>
        <button 
          style={getTabStyle("WEEK")} 
          onClick={() => handleTabChange("WEEK")}
        >
          <FontAwesomeIcon icon={faCalendarWeek} />
          Weeks
        </button>
      </div>

      <div style={{ animation: "fadeIn 0.3s ease" }}>
        {activeTab === "COURSE" && <ContentDashboard theme={theme} contentType="COURSE" embedded={true} />}
        {activeTab === "LESSON" && <ContentDashboard theme={theme} contentType="LESSON" embedded={true} />}
        {activeTab === "WEEK" && <ContentDashboard theme={theme} contentType="WEEK" embedded={true} />}
      </div>
    </div>
  );
};

export default CourseManager;
