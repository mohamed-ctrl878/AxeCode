import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faMoon,
  faSun,
  faUpload,
  faCode,
  faChalkboardUser,
  faClock,
  faSignOutAlt,
  faCog,
  faComments,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import style from "@presentation/styles/components/header-new.module.css";
// import cat from "@assets/images/cat.webp";
// import axe from "@assets/icons/axe.svg";
import cat from "@presentation/assets/images/cat.webp";
import axe from "@presentation/assets/icons/axe.svg";
// import { switchState } from "../@data/storage/storeRx/themeSlice";
import { useDispatch } from "react-redux";
import { switchState } from "@data/storage/storeRx/globalStore/themeSlice";
import { logoutExe } from "@domain/usecases/user/logoutExe";
import AuthLogoutBase from "@data/repositories/userImps/Logout";
import useLogout from "@presentation/shared/hooks/useLogout";

import Sidebar from "./Sidebar";

const Header = React.memo(
  ({ className, theme, setTheme, setGetUserData, userHere, data }) => {
    // console.log(data);
    const [profile, setProfile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop

    // Sync body class for layout shifting
    useEffect(() => {
      // Remove old classes
      document.body.classList.remove("sidebar-expanded", "sidebar-collapsed");

      if (sidebarOpen) {
        document.body.classList.add("sidebar-expanded");
      } else {
        document.body.classList.add("sidebar-collapsed");
      }
    }, [sidebarOpen]);

    // Unused icons but kept if needed later or cleaning up import if causing issues
    const moonElement = <FontAwesomeIcon icon={faMoon} />;
    const sunElement = <FontAwesomeIcon icon={faSun} />;
    const barsElement = <FontAwesomeIcon icon={faBars} />;

    const switchTheme = useDispatch();

    const handleThemeToggle = () => {
      switchTheme(switchState());
    };

    const { logout } = useLogout(setProfile);
    return (
      <>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
          theme={theme}
          toggleTheme={handleThemeToggle}
          user={data}
        />

        <header
          className={`${style.headerContainer} ${theme} 
          `}
        >
          <div
            className={style.headerContent}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Left Side: Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link className={style.logo} to={"/"}>
                <img src={axe} alt="axe" />
              </Link>
            </div>

            {/* Center: Search Box */}
            <div className={style.searchContainer}>
              <div className={style.searchBox}>
                <input
                  type="text"
                  placeholder="Search courses, mentors, problems..."
                  className={style.searchInput}
                />
                <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
              </div>
            </div>

            {/* Right: Profile Section */}
            <section className={style.profileSection}>
              {/* Profile Button */}
              <button
                className={style.profileButton}
                onClick={() => setProfile(!profile)}
              >
                {!data ? (
                  <FontAwesomeIcon icon={faUser} />
                ) : (
                  <img
                    src={
                      data && data.avatar
                        ? `http://localhost:1338${data.avatar.url}`
                        : cat
                    }
                    alt="profile"
                  />
                )}
              </button>

              {/* Profile Dropdown */}
              {profile && (
                <div className={style.profileDropdown}>
                  {data ? (
                    <>
                      {/* Profile Header */}
                      <div className={style.profileHeader}>
                        <img
                          className={style.profileAvatar}
                          src={
                            data && data.avatar
                              ? `http://localhost:1338${data.avatar.url}`
                              : cat
                          }
                          alt="profile"
                        />
                        <div className={style.profileInfo}>
                          <div className={style.profileName}>
                            {data.username}
                          </div>
                          <div className={style.profileRole}>
                            {data.role?.name || "User"}
                          </div>
                        </div>
                      </div>

                      {/* Profile Actions */}
                      <div className={style.profileActions}>
                        <Link
                          className={style.profileAction}
                          to="/settings/profile"
                          onClick={() => setProfile(false)}
                        >
                          <FontAwesomeIcon icon={faCog} />
                          <span>Settings</span>
                        </Link>
                        <button
                          className={style.themeToggle}
                          onClick={() => {
                            switchTheme(switchState());
                            setProfile(false);
                          }}
                        >
                          {theme === "light-theme" ? moonElement : sunElement}
                        </button>

                        <button className={style.logoutButton} onClick={logout}>
                          <FontAwesomeIcon icon={faSignOutAlt} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Guest Actions */}
                      <div className={style.profileActions}>
                        <Link
                          className={style.profileAction}
                          to="/login"
                          onClick={() => setProfile(false)}
                        >
                          <FontAwesomeIcon icon={faUser} />
                          <span>Login</span>
                        </Link>

                        <Link
                          className={style.profileAction}
                          to="/register"
                          onClick={() => setProfile(false)}
                        >
                          <FontAwesomeIcon icon={faUser} />
                          <span>Register</span>
                        </Link>

                        <button
                          className={style.themeToggle}
                          onClick={() => {
                            switchTheme(switchState());
                            setProfile(false);
                          }}
                        >
                          {theme === "light-theme" ? moonElement : sunElement}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>
          </div>
        </header>

        {/* Overlay for Profile Dropdown */}
        {profile && (
          <div className={style.overlay} onClick={() => setProfile(false)} />
        )}
      </>
    );
  }
);

export default Header;
