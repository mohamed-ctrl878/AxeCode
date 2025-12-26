import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChartLine,
  faBook,
  faEdit,
  faSignOutAlt,
  faCog,
  faLock,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import style from "@presentation/styles/pages/settings.module.css";
import RenderProfileSection from "@presentation/pages/profile/routes/RenderProfileSection";
import RenderDashboardSection from "@presentation/pages/dashboard/routes/RenderDashboardSection";
import RenderCoursesSection from "@presentation/pages/dashboard/routes/RenderCoursesSection";
// import RenderDashboardSection from "@presentation/pages/dashboard/routes/RenderDashboardSection";
// import RenderCoursesSection from "@presentation/pages/dashboard/routes/RenderCoursesSection";
// import RenderContentSection from "@presentation/pages/dashboard/routes/RenderContentSection";
import ContentDashboard from "@presentation/pages/dashboard/routes/ContentDashboard";
import CourseManager from "@presentation/pages/dashboard/routes/CourseManager";
import RenderPreferencesSection from "@presentation/pages/dashboard/routes/RenderPreferencesSection";


const RenderAccessDenied = () => (
    <div className={style.accessDenied}>
        <FontAwesomeIcon icon={faLock} />
        <h3>Access Denied</h3>
        <p>This section is only available for instructors.</p>
    </div>
);

const Settings = ({ theme, user, setGetUserData }) => {
  const { topic } = useParams();
  const navigate = useNavigate();
  // Default to 'profile' if no topic is provided
  const activeSection = topic || "profile"; 
  
  // Convert boolean theme to string format for CSS classes
  const themeClass = theme === "dark-theme" ? "dark-theme" : "light-theme";
  
  // Ensure user data is available (using prop or context if needed, but prop 'user' is passed)
  // user prop is "data" from App.js
  const currentUser = user || {}; 

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <RenderProfileSection theme={theme} />;
      case "dashboard":
        return <RenderDashboardSection theme={theme} />;
      case "courses":
      case "manage-courses":
        return currentUser.role?.name === "instructor" || currentUser.role?.name === "publisher" ? (
          <CourseManager theme={theme} />
        ) : <RenderAccessDenied />;
        
      case "manage-problems":
        return <ContentDashboard theme={theme} contentType="PROBLEM" />;
        
      case "manage-events":
        return <ContentDashboard theme={theme} contentType="EVENT" />;
        
      case "manage-articles":
      case "blogs": // map existing 'blogs' if needed or separate
        return <ContentDashboard theme={theme} contentType="ARTICLE" />;
      case "manage-live":
        return <ContentDashboard theme={theme} contentType="LIVE" />;
        
      case "manage-roadmaps":
        return <ContentDashboard theme={theme} contentType="ROADMAP" />;

      case "content":
        return currentUser.role?.name === "instructor" || currentUser.role?.name === "publisher" ? (
          <ContentDashboard theme={theme} /> // Fallback or General View
        ) : (
          <div className={style.accessDenied}>
             <FontAwesomeIcon icon={faLock} />
             <h3>Access Denied</h3>
             <p>This section is only available for instructors.</p>
          </div>
        );
      case "preferences":
        return <RenderPreferencesSection theme={theme} />;
      default:
        return <RenderProfileSection theme={theme} />;
    }
  };

  return (
    <div className={`${style.settingsContainer} ${themeClass}`}>
      {/* Background Blobs */}
      <div className={style.backgroundBlobs}>
        <div className={style.blob1}></div>
        <div className={style.blob2}></div>
        <div className={style.blob3}></div>
      </div>

      {/* Main Content (Full Width now) */}
      <main className={style.mainContent}>
        {renderSection()}
      </main>
    </div>
  );
};

export default Settings;
