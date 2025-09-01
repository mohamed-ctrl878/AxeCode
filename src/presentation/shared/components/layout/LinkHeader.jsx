import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
import style from "@presentation/styles/components/header-new.module.css";
// import cat from "@assets/images/cat.webp";
// import axe from "@assets/icons/axe.svg";
import cat from "@presentation/assets/images/cat.webp";
import axe from "@presentation/assets/icons/axe.svg";
// import { switchState } from "../@data/storage/storeRx/themeSlice";
import { useDispatch } from "react-redux";
import { switchState } from "@data/storage/storeRx/globalStore/themeSlice";

const Header = React.memo(
  ({ className, theme, setTheme, setGetUserData, userHere, data }) => {
    console.log(data);
    const [profile, setProfile] = useState(false);
    const [tgl, setTgl] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const courseElement = (
      <FontAwesomeIcon className="icon" icon={faChalkboardUser} />
    );
    const codeElement = <FontAwesomeIcon className="icon" icon={faCode} />;
    const uploadElement = <FontAwesomeIcon className="icon" icon={faUpload} />;
    const userElement = <FontAwesomeIcon icon={faUser} />;
    const moonElement = <FontAwesomeIcon icon={faMoon} />;
    const sunElement = <FontAwesomeIcon icon={faSun} />;
    const barsElement = <FontAwesomeIcon icon={faBars} />;
    const active = useLocation();
    let match = useMatch("/practice/:type/:id");

    // Handle scroll effect
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const switchTheme = useDispatch();

    // Close mobile menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (mobileMenuOpen && !event.target.closest(".mobileMenuButton")) {
          setMobileMenuOpen(false);
          setTgl(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [mobileMenuOpen]);

    return (
      <>
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
            {" "}
            {/* Flex row for all header content */}
            {/* Logo */}
            <Link className={style.logo} to={"/"}>
              <img src={axe} alt="axe" />
            </Link>
            {/* Desktop Navigation */}
            <ul
              className={`${style.navList} ${
                mobileMenuOpen ? style.mobileOpen : ""
              }`}
            >
              <li className={style.navItem}>
                <Link
                  className={`${style.navLink} ${
                    active.pathname.startsWith("courses", 1) ? style.active : ""
                  }`}
                  to={"/courses"}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTgl(false);
                  }}
                >
                  <span>courses</span>
                  {courseElement}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link
                  className={`${style.navLink} ${
                    active.pathname.startsWith("practice", 1)
                      ? style.active
                      : ""
                  }`}
                  to={"/practice"}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTgl(false);
                  }}
                >
                  <span>Practices</span>
                  {codeElement}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link
                  className={`${style.navLink} ${
                    active.pathname.startsWith("community", 1)
                      ? style.active
                      : ""
                  }`}
                  to={"/community"}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTgl(false);
                  }}
                >
                  <span>community</span>
                </Link>
              </li>
            </ul>
            {/* Profile Section */}
            <section className={style.profileSection}>
              {/* Mobile Menu Button */}
              <button
                className={`${style.mobileMenuButton} mobileMenuButton`}
                onClick={() => {
                  setProfile(false);
                  setTgl(!mobileMenuOpen);
                  setMobileMenuOpen((e) => !e);
                }}
              >
                {barsElement}
              </button>

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

                        <button
                          className={style.logoutButton}
                          onClick={() => {
                            // logout function here
                            setProfile(false);
                          }}
                        >
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

        {/* Overlay */}
        {(profile || tgl) && (
          <div className={style.overlay} onClick={() => setProfile(false)} />
        )}
      </>
    );
  }
);

export default Header;
