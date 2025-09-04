import React, { useState } from "react";
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
import RenderContentSection from "@presentation/pages/dashboard/routes/RenderContentSection";
import RenderPreferencesSection from "@presentation/pages/dashboard/routes/RenderPreferencesSection";


const Settings = ({ theme, user, setGetUserData }) => {
  // Convert boolean theme to string format for CSS classes
  const themeClass = theme === "dark-theme" ? "dark-theme" : "light-theme";
  const [activeSection, setActiveSection] = useState("profile");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Ahmed Ali Mohamed",
    email: "ahmed.ali@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "instructor",
    country: "Egypt",
    language: "English",
    isVerified: true,
    joinDate: "2023-01-15",
    notifications: {
      email: true,
      push: true,
      sms: false,
      courseUpdates: true,
      comments: true,
      marketing: false,
    },
  };

  // Mock content data

  const navigationItems = [
    {
      id: "profile",
      name: "My Profile",
      icon: faUser,
      description: "Manage personal information",
    },
    {
      id: "dashboard",
      name: "Dashboard",
      icon: faChartLine,
      description: "Overview of your activity",
    },
    {
      id: "courses",
      name: "My Courses",
      icon: faBook,
      description: "Manage educational courses",
    },
    {
      id: "content",
      name: "Content Management",
      icon: faEdit,
      description: "Create and edit content",
      instructorOnly: true,
    },
    {
      id: "preferences",
      name: "Settings",
      icon: faCog,
      description: "Customize preferences",
    },
  ];

  const handleLogout = () => {
    // console.log("Logging out...");
  };
  const renderSection =
    activeSection === "profile" ? (
      <RenderProfileSection theme={theme} />
    ) : activeSection === "dashboard" ? (
      <RenderDashboardSection theme={theme} />
    ) : activeSection === "courses" ? (
      <RenderCoursesSection theme={theme} />
    ) : activeSection === "content" ? (
      mockUser.role === "instructor" ? (
        <RenderContentSection theme={theme} />
      ) : (
        <div className={style.accessDenied}>
          <FontAwesomeIcon icon={faLock} />
          <h3>Access Denied</h3>
          <p>This section is only available for instructors.</p>
        </div>
      )
    ) : activeSection === "preferences" ? (
      <RenderPreferencesSection theme={theme} />
    ) : (
      <div className={style.sectionContent}>
        <h2>Section Not Found</h2>
        <p>The requested section could not be found.</p>
      </div>
    );

  return (
    <div className={`${style.settingsContainer} ${themeClass}`}>
      {/* Background Blobs */}
      <div className={style.backgroundBlobs}>
        <div className={style.blob1}></div>
        <div className={style.blob2}></div>
        <div className={style.blob3}></div>
      </div>

      {/* Sidebar */}
      <aside
        className={`${style.sidebar} ${
          isSidebarCollapsed ? style.collapsed : ""
        }`}
      >
        <div className={style.sidebarHeader}>
          <button
            className={style.collapseBtn}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <FontAwesomeIcon
              icon={isSidebarCollapsed ? faChevronRight : faChevronLeft}
            />
          </button>
          {!isSidebarCollapsed && (
            <>
              <h2 className={style.sidebarTitle}>Settings</h2>
              <p className={style.sidebarSubtitle}>
                Manage your account and preferences
              </p>
            </>
          )}
        </div>

        <nav className={style.navigation}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`${style.navItem} ${
                activeSection === item.id ? style.active : ""
              }`}
              onClick={() => setActiveSection(item.id)}
              disabled={item.instructorOnly && mockUser.role !== "instructor"}
            >
              <FontAwesomeIcon icon={item.icon} className={style.navIcon} />
              {!isSidebarCollapsed && (
                <div className={style.navContent}>
                  <span className={style.navName}>{item.name}</span>
                  <span className={style.navDescription}>
                    {item.description}
                  </span>
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className={style.sidebarFooter}>
          <button className={style.logoutBtn} onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {!isSidebarCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      <main className={style.mainContent}>{renderSection}</main>
    </div>
  );
};

export default Settings;
