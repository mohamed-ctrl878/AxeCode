import { faBell, faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import { switchState } from "../@data/storage/storeRx/themeSlice";
import style from "@presentation/styles/pages/settings.module.css";
import { switchState } from "@data/storage/storeRx/globalStore/themeSlice";

const RenderPreferencesSection = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.themeSlice.theme);

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

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    if (newTheme === "light") {
      dispatch(switchState(false));
    } else if (newTheme === "dark") {
      dispatch(switchState(true));
    } else {
      // Auto theme - use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(switchState(prefersDark));
    }
  };

  const getCurrentThemeValue = () => {
    return theme ? "dark" : "light";
  };

  return (
    <div className={style.sectionContent}>
      <div className={style.sectionHeader}>
        <h2 className={style.sectionTitle}>Settings</h2>
        <p className={style.sectionSubtitle}>
          Customize your preferences and account settings
        </p>
      </div>

      <div className={style.preferencesGrid}>
        <div className={style.preferencesCard}>
          <h3 className={style.cardTitle}>
            <FontAwesomeIcon icon={faBell} />
            Notifications
          </h3>
          <div className={style.preferencesList}>
            {Object.entries(mockUser.notifications).map(([key, value]) => (
              <div key={key} className={style.preferenceItem}>
                <div className={style.preferenceInfo}>
                  <h4>
                    {key === "email"
                      ? "Email Notifications"
                      : key === "push"
                      ? "Push Notifications"
                      : key === "sms"
                      ? "SMS Notifications"
                      : key === "courseUpdates"
                      ? "Course Updates"
                      : key === "comments"
                      ? "Comments"
                      : "Marketing"}
                  </h4>
                  <p>
                    {key === "email"
                      ? "Receive notifications via email"
                      : key === "push"
                      ? "Instant notifications in browser"
                      : key === "sms"
                      ? "Text messages to phone"
                      : key === "courseUpdates"
                      ? "Notifications when courses are updated"
                      : key === "comments"
                      ? "Notifications when someone comments"
                      : "Promotional offers and advertisements"}
                  </p>
                </div>
                <label className={style.toggleSwitch}>
                  <input type="checkbox" defaultChecked={value} />
                  <span className={style.slider}></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={style.preferencesCard}>
          <h3 className={style.cardTitle}>
            <FontAwesomeIcon icon={faPalette} />
            Display Settings
          </h3>
          <div className={style.preferencesList}>
            <div className={style.preferenceItem}>
              <div className={style.preferenceInfo}>
                <h4>Video Quality</h4>
                <p>Choose default video quality</p>
              </div>
              <select className={style.formSelect}>
                <option value="auto">Auto</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className={style.preferenceItem}>
              <div className={style.preferenceInfo}>
                <h4>Language</h4>
                <p>Interface language</p>
              </div>
              <select className={style.formSelect}>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div className={style.preferenceItem}>
              <div className={style.preferenceInfo}>
                <h4>Theme</h4>
                <p>Choose website appearance</p>
              </div>
              <select
                className={style.formSelect}
                value={getCurrentThemeValue()}
                onChange={handleThemeChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className={style.preferenceItem}>
              <div className={style.preferenceInfo}>
                <h4>Auto Play</h4>
                <p>Automatically play videos</p>
              </div>
              <label className={style.toggleSwitch}>
                <input type="checkbox" defaultChecked={true} />
                <span className={style.slider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderPreferencesSection;
