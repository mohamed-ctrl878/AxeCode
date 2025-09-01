import React from "react";
import style from "@presentation/styles/pages/settings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faEdit,
  faEye,
  faGlobe,
  faPlus,
  faTrash,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const RenderContentSection = () => {
  const mockContent = {
    problems: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        category: "Arrays",
        status: "published",
        views: 1240,
        submissions: 89,
        successRate: 78,
        lastUpdated: "2024-01-15",
      },
      {
        id: 2,
        title: "Valid Parentheses",
        difficulty: "Medium",
        category: "Stack",
        status: "draft",
        views: 0,
        submissions: 0,
        successRate: 0,
        lastUpdated: "2024-01-10",
      },
      {
        id: 3,
        title: "Binary Tree Inorder Traversal",
        difficulty: "Hard",
        category: "Trees",
        status: "published",
        views: 890,
        submissions: 45,
        successRate: 65,
        lastUpdated: "2024-01-12",
      },
    ],
    courses: [
      {
        id: 1,
        title: "React.js for Beginners",
        image:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
        status: "published",
        lessons: 24,
        students: 156,
        rating: 4.8,
        price: 199,
        lastUpdated: "2024-01-15",
      },
      {
        id: 2,
        title: "JavaScript ES6+",
        image:
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
        status: "draft",
        lessons: 18,
        students: 0,
        rating: 0,
        price: 149,
        lastUpdated: "2024-01-10",
      },
    ],
  };
  return (
    <div className={style.sectionContent}>
      <div className={style.sectionHeader}>
        <h2 className={style.sectionTitle}>Content Management</h2>
        <p className={style.sectionSubtitle}>
          Create and edit your educational content
        </p>
      </div>

      <div className={style.contentTabs}>
        <div className={style.tabContent}>
          {/* Problems Management */}
          <div className={style.contentSection}>
            <div className={style.sectionHeader}>
              <h3>Problems Management</h3>

              <Link to={"add-problem"} className={style.createBtn}>
                <FontAwesomeIcon icon={faPlus} />
                Add New Problem
              </Link>
            </div>
            <div className={style.contentTable}>
              <div className={style.tableHeader}>
                <div className={style.tableCell}>Title</div>
                <div className={style.tableCell}>Difficulty</div>
                <div className={style.tableCell}>Category</div>
                <div className={style.tableCell}>Status</div>
                <div className={style.tableCell}>Views</div>
                <div className={style.tableCell}>Success Rate</div>
                <div className={style.tableCell}>Actions</div>
              </div>

              {mockContent.problems.map((problem) => (
                <div key={problem.id} className={style.tableRow}>
                  <div className={style.tableCell}>
                    <div className={style.problemInfo}>
                      <h4>{problem.title}</h4>
                      <span className={style.problemId}>#{problem.id}</span>
                    </div>
                  </div>
                  <div className={style.tableCell}>
                    <span
                      className={`${style.difficultyBadge} ${
                        style[problem.difficulty.toLowerCase()]
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className={style.tableCell}>
                    <span className={style.categoryTag}>
                      {problem.category}
                    </span>
                  </div>
                  <div className={style.tableCell}>
                    <span
                      className={`${style.statusBadge} ${
                        style[problem.status]
                      }`}
                    >
                      {problem.status}
                    </span>
                  </div>
                  <div className={style.tableCell}>
                    {problem.views.toLocaleString()}
                  </div>
                  <div className={style.tableCell}>
                    <div className={style.successRate}>
                      <div className={style.rateBar}>
                        <div
                          className={style.rateFill}
                          style={{ width: `${problem.successRate}%` }}
                        ></div>
                      </div>
                      <span>{problem.successRate}%</span>
                    </div>
                  </div>
                  <div className={style.tableCell}>
                    <div className={style.actionButtons}>
                      <button className={style.actionBtn} title="Edit">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className={style.actionBtn} title="View">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className={style.actionBtn} title="Publish">
                        <FontAwesomeIcon icon={faGlobe} />
                      </button>
                      <button className={style.actionBtn} title="Delete">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Management */}
          <div className={style.contentSection}>
            <div className={style.sectionHeader}>
              <h3>Courses Management</h3>
              <Link to={"add-course"} className={style.createBtn}>
                <FontAwesomeIcon icon={faPlus} />
                Add New Course
              </Link>
            </div>

            <div className={style.coursesGrid}>
              {mockContent.courses.map((course) => (
                <div key={course.id} className={style.courseCard}>
                  <div className={style.courseImage}>
                    <img src={course.image} alt={course.title} />
                    <div className={style.courseStatus}>
                      <span
                        className={`${style.statusBadge} ${
                          style[course.status]
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                  </div>

                  <div className={style.courseContent}>
                    <h3 className={style.courseTitle}>{course.title}</h3>

                    <div className={style.courseStats}>
                      <span>
                        <FontAwesomeIcon icon={faBook} /> {course.lessons}{" "}
                        Lessons
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faUsers} /> {course.students}{" "}
                        Students
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faTrophy} /> {course.rating}
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
                        <FontAwesomeIcon icon={faGlobe} />
                        Publish
                      </button>
                      <button className={style.actionBtn}>
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderContentSection;
