import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUpload,
  faSave,
  faLock,
  faUserTie,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import style from "@presentation/styles/pages/settings.module.css";
import ContributionGraph from "../components/ContriputionGraph";

const RenderProfileSection = ({ theme }) => {
  const mockUser = {
    name: "Ahmed Ali",
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
  return (
    <div className={style.sectionContent}>
      <div className={style.sectionHeader}>
        <h2 className={style.sectionTitle}>My Profile</h2>
        <p className={style.sectionSubtitle}>
          Manage your personal information and settings
        </p>
      </div>

      <div className={style.profileGrid}>
        <div className={style.profileCard}>
          <div className={style.profileHeader}>
            <div className={style.avatarSection}>
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className={style.avatar}
              />
              <button className={style.changeAvatarBtn}>
                <FontAwesomeIcon icon={faUpload} />
                Change Photo
              </button>
            </div>
            <div className={style.profileInfo}>
              <h3 className={style.userName}>
                {mockUser.name}
                {mockUser.isVerified && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className={style.verifiedBadge}
                  />
                )}
              </h3>
              <p className={style.userRole}>
                <FontAwesomeIcon
                  icon={
                    mockUser.role === "instructor" ? faUserTie : faUserGraduate
                  }
                />
                {mockUser.role === "instructor" ? "Instructor" : "Student"}
              </p>
            </div>
          </div>

          <div className={style.profileForm}>
            <div className={style.formGroup}>
              <label className={style.formLabel}>Full Name</label>
              <input
                type="text"
                defaultValue={mockUser.name}
                className={style.formInput}
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.formLabel}>Email Address</label>
              <input
                type="email"
                defaultValue={mockUser.email}
                className={style.formInput}
              />
            </div>

            <div className={style.formActions}>
              <button className={style.saveBtn}>
                <FontAwesomeIcon icon={faSave} />
                Save Changes
              </button>
              <button className={style.changePasswordBtn}>
                <FontAwesomeIcon icon={faLock} />
                Change Password
              </button>
            </div>
            <ContributionGraph></ContributionGraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderProfileSection;
