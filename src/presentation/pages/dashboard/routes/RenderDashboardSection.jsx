import React from "react";
import style from "../../../styles/pages/settings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faDollarSign,
  faEye,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const RenderDashboardSection = () => {
  return (
    <div className={style.sectionContent}>
      <div className={style.sectionHeader}>
        <h2 className={style.sectionTitle}>Dashboard</h2>
        <p className={style.sectionSubtitle}>
          Overview of your activity and performance
        </p>
      </div>

      <div className={style.dashboardGrid}>
        <div className={style.statsGrid}>
          <div className={style.statCard}>
            <div className={style.statIcon}>
              <FontAwesomeIcon icon={faEye} />
            </div>
            <div className={style.statInfo}>
              <h3>15,420</h3>
              <p>Total Views</p>
            </div>
          </div>

          <div className={style.statCard}>
            <div className={style.statIcon}>
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className={style.statInfo}>
              <h3>342</h3>
              <p>Total Students</p>
            </div>
          </div>

          <div className={style.statCard}>
            <div className={style.statIcon}>
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <div className={style.statInfo}>
              <h3>$12,500</h3>
              <p>Total Earnings</p>
            </div>
          </div>

          <div className={style.statCard}>
            <div className={style.statIcon}>
              <FontAwesomeIcon icon={faBook} />
            </div>
            <div className={style.statInfo}>
              <h3>8</h3>
              <p>Total Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderDashboardSection;
