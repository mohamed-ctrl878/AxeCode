import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Styles
import style from "@presentation/styles/pages/courses.module.css";

const Courses = ({ theme }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockCourses = [
          {
            id: 1,
            title: "React Fundamentals",
            description:
              "Learn the basics of React.js and build your first application",
            category: "frontend",
            instructor: "Ahmed Ali",
            duration: "8 weeks",
            students: 1250,
            rating: 4.8,
            image:
              "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            price: 99,
            level: "Beginner",
          },
          {
            id: 2,
            title: "Advanced JavaScript",
            description:
              "Master advanced JavaScript concepts and modern ES6+ features",
            category: "programming",
            instructor: "Sarah Johnson",
            duration: "10 weeks",
            students: 890,
            rating: 4.9,
            image:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
            price: 129,
            level: "Advanced",
          },
          {
            id: 3,
            title: "Node.js Backend Development",
            description:
              "Build scalable backend applications with Node.js and Express",
            category: "backend",
            instructor: "Mohammed Hassan",
            duration: "12 weeks",
            students: 756,
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
            price: 149,
            level: "Intermediate",
          },
          {
            id: 4,
            title: "Python Data Science",
            description: "Learn data analysis and machine learning with Python",
            category: "data-science",
            instructor: "Fatima Ahmed",
            duration: "14 weeks",
            students: 1120,
            rating: 4.6,
            image:
              "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
            price: 179,
            level: "Intermediate",
          },
          {
            id: 5,
            title: "UI/UX Design Principles",
            description:
              "Master the fundamentals of user interface and user experience design",
            category: "design",
            instructor: "Layla Omar",
            duration: "6 weeks",
            students: 634,
            rating: 4.5,
            image:
              "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
            price: 89,
            level: "Beginner",
          },
          {
            id: 6,
            title: "Mobile App Development",
            description:
              "Build cross-platform mobile applications with React Native",
            category: "mobile",
            instructor: "Omar Khalil",
            duration: "16 weeks",
            students: 445,
            rating: 4.4,
            image:
              "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
            price: 199,
            level: "Advanced",
          },
        ];

        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, courses]);

  const categories = [
    { id: "all", name: "All Courses" },
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "programming", name: "Programming" },
    { id: "data-science", name: "Data Science" },
    { id: "design", name: "Design" },
    { id: "mobile", name: "Mobile" },
  ];

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "badge-success";
      case "intermediate":
        return "badge-warning";
      case "advanced":
        return "badge-error";
      default:
        return "badge-success";
    }
  };

  if (loading) {
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
      </div>
    );
  }

  return (
    <div className={`${style.coursesContainer} ${themeClass}`}>
      {/* Header Section */}
      <div
        className="card card-elevated"
        style={{ marginBottom: "2rem", textAlign: "center", padding: "2rem" }}
      >
        <h1
          style={{
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
            fontSize: "2.25rem",
            fontWeight: "700",
          }}
        >
          Explore Our Courses
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
          Discover the perfect course to advance your skills and career
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ width: "100%", paddingLeft: "2.5rem" }}
            />
            <div
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            >
              <svg
                width="16"
                height="16"
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn ${
                selectedCategory === category.id
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
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
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className="card card-elevated"
              style={{ overflow: "hidden" }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={course.image}
                  alt={course.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <span className={`badge ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  <span className="badge badge-primary">${course.price}</span>
                </div>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.125rem" }}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color:
                              i < Math.floor(course.rating)
                                ? "var(--warning)"
                                : "var(--text-muted)",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {course.rating}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {course.description}
                </p>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                      <span>{course.instructor}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="m23 21-2-2-2 2"></path>
                      </svg>
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    View Course
                  </Link>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredCourses.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <button className="btn btn-primary">Load More Courses</button>
        </div>
      )}

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
};

export default Courses;
