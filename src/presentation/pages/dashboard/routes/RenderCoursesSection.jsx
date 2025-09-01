import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import style from "../../../styles/pages/settings.module.css";
import {
  faBook,
  faEdit,
  faEye,
  faPlus,
  faTrash,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const RenderCoursesSection = () => {
  return (
    <div className={style.sectionContent}>
      <div className={style.sectionHeader}>
        <h2 className={style.sectionTitle}>My Courses</h2>
        <p className={style.sectionSubtitle}>Manage your educational courses</p>
      </div>

      <div className={style.coursesHeader}>
        <div className={style.coursesStats}>
          <span className={style.stat}>
            <FontAwesomeIcon icon={faBook} />8 Courses
          </span>
        </div>

        <button className={style.createCourseBtn}>
          <FontAwesomeIcon icon={faPlus} />
          Create New Course
        </button>
      </div>

      <div className={style.coursesGrid}>
        <div className={style.courseCard}>
          <div className={style.courseImage}>
            <img
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop"
              alt="React Course"
            />
            <div className={style.courseStatus}>
              <span className={`${style.statusBadge} ${style.published}`}>
                Published
              </span>
            </div>
          </div>

          <div className={style.courseContent}>
            <h3 className={style.courseTitle}>React.js for Beginners</h3>

            <div className={style.courseStats}>
              <span>
                <FontAwesomeIcon icon={faBook} /> 24 Lessons
              </span>
              <span>
                <FontAwesomeIcon icon={faUsers} /> 156 Students
              </span>
              <span>
                <FontAwesomeIcon icon={faTrophy} /> 4.8
              </span>
            </div>

            <div className={style.courseActions}>
              <button className={style.actionBtn}>
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </button>
              <button className={style.actionBtn}>
                <FontAwesomeIcon icon={faEye} />
                View
              </button>
              <button className={style.actionBtn}>
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderCoursesSection;
