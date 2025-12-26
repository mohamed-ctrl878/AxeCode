import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Styles
import style from "@presentation/styles/pages/courses.module.css";
import useGetContent from "@presentation/shared/hooks/useGetContent";
import { getCoursesInfoExe } from "@domain/usecases/course/getCoursesInfoExe";
import { GetCourse } from "@data/repositories/courseImps/GetCourse";
import { courseDTO } from "@data/models/courseDTO";

const Courses = ({ theme }) => {
  async function caseUse() {
    return await getCoursesInfoExe(new GetCourse(), "populate=*");
  }
  const { load, data, error } = useGetContent({ caseUse });
  console.log(data);
  const [searchTerm, setSearchTerm] = useState("");

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  // Filter logic
  const filteredCourses = (data || []).filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.title?.toLowerCase().includes(term) ||
      course.publisher?.toLowerCase().includes(term)
    );
  });
  if (load) {
    return (
      <div className={`${style.coursesContainer} ${themeClass}`}>
        <div
          className="card card-elevated"
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid var(--border-primary)",
              borderTop: "4px solid var(--primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading courses...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${style.coursesContainer} ${themeClass}`}>
        <div
          className="card card-elevated"
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <h3 style={{ color: "var(--error)", marginBottom: "1rem" }}>
            Something went wrong
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Unable to load courses. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${style.coursesContainer} ${themeClass}`}>
      {/* Enhanced Header Section */}
      <div className={style.coursesHeader}>
        <div className={style.headerContent}>
          <h1 className={style.coursesTitle}>Explore Our Courses</h1>
          <p className={style.coursesSubtitle}>
            Discover the perfect course to advance your skills and career with
            expert-led content
          </p>
          <div className={style.coursesStats}>
            <div className={style.statItem}>
              <span className={style.statNumber}>{data?.length || 0}</span>
              <span className={style.statLabel}>Total Courses</span>
            </div>
            <div className={style.statItem}>
              <span className={style.statNumber}>{filteredCourses.length}</span>
              <span className={style.statLabel}>Showing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className={style.searchFilterSection}>
        <div className={style.searchContainer} style={{ maxWidth: "100%" }}>
          <input
            type="text"
            placeholder="Search courses or publishers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchInput}
          />
          <div className={style.searchIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Enhanced Courses Grid */}
      <div className={style.coursesGrid}>
        {filteredCourses.length === 0 ? (
          <div
            className="card card-elevated"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "3rem",
            }}
          >
            <div style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3
              style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}
            >
              No courses found
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <>
              {console.log(`http://localhost:1338${course.picture}`)}
              <div
                key={course.documentId || course.id}
                className={style.courseCard}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={`http://localhost:1338${course.picture?.url || course.picture}`}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "1rem" }}>
                      <h3
                        style={{
                          color: "var(--text-primary)",
                          marginBottom: "0.5rem",
                          fontSize: "1.25rem",
                          fontWeight: "600",
                        }}
                      >
                        {course.title}
                      </h3>
                      {course.difficulty && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "var(--text-secondary)",
                            fontSize: "0.875rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <span>Difficulty: {course.difficulty}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <Link
                        to={`/courses/preview/${course.id}/`}
                        className="btn btn-secondary"
                        style={{ flex: 1, textAlign: "center" }}
                      >
                        Preview
                      </Link>
                      <Link
                        to={`/courses/${course.documentId || course.id}/content`}
                        className="btn btn-primary"
                        style={{ flex: 1, textAlign: "center" }}
                      >
                        Start Learning
                      </Link>
                    </div>
                  </div>
              </div>
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;
