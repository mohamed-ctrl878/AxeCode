import React, { useState } from "react";
import { useParams } from "react-router-dom";
import style from "@presentation/styles/pages/course-content.module.css";
import VideoPlayer from "@presentation/shared/components/video/VideoPlayer";

const CourseContent = ({ theme }) => {
  const { id } = useParams();
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set([0, 1, 2])); // Mock completed lessons
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // First module expanded by default

  // dome

  const sources = [
    {
      quality: "1080p",
      src: "/video-1080p.mp4",
      type: "video/mp4",
    },
    {
      quality: "720p",
      src: "/video-720p.mp4",
      type: "video/mp4",
    },
    {
      quality: "480p",
      src: "/video-480p.mp4",
      type: "video/mp4",
    },
  ];
  // dome
  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  // Mock course data - replace with actual API call
  const courseData = {
    id: parseInt(id) || 1,
    title: "Complete React Development Masterclass",
    instructor: "Ahmed Ali",
    totalLessons: 45,
    completedCount: 12,
    progress: 27, // percentage
    modules: [
      {
        id: 0,
        title: "Getting Started with React",
        lessons: [
          {
            id: 0,
            title: "Introduction to React",
            type: "video",
            duration: "15m",
            description:
              "Welcome to the Complete React Development Masterclass! In this introductory lesson, we'll explore what React is, why it's so popular, and what you'll learn throughout this comprehensive course.",
            videoUrl: "#", // Mock video URL
            resources: [
              {
                id: 1,
                title: "React Official Documentation",
                type: "link",
                size: "External Link",
              },
              {
                id: 2,
                title: "Course Slides - Introduction",
                type: "pdf",
                size: "2.1 MB",
              },
            ],
          },
          {
            id: 1,
            title: "Setting up Development Environment",
            type: "video",
            duration: "20m",
            description:
              "Learn how to set up your development environment with Node.js, npm, and create-react-app. We'll also configure your code editor for optimal React development.",
            videoUrl: "#",
            resources: [
              {
                id: 3,
                title: "Development Setup Checklist",
                type: "pdf",
                size: "1.5 MB",
              },
              {
                id: 4,
                title: "VS Code Extensions List",
                type: "txt",
                size: "0.5 MB",
              },
            ],
          },
          {
            id: 2,
            title: "Your First React Component",
            type: "video",
            duration: "18m",
            description:
              "Create your first React component from scratch. Understand the basic anatomy of a React component and how JSX works under the hood.",
            videoUrl: "#",
            resources: [
              {
                id: 5,
                title: "First Component Code",
                type: "zip",
                size: "0.8 MB",
              },
              {
                id: 6,
                title: "Component Cheat Sheet",
                type: "pdf",
                size: "1.2 MB",
              },
            ],
          },
          {
            id: 3,
            title: "JSX Fundamentals",
            type: "video",
            duration: "25m",
            description:
              "Deep dive into JSX syntax, expressions, and best practices. Learn how to write clean, readable JSX code.",
            videoUrl: "#",
            resources: [
              { id: 7, title: "JSX Examples", type: "zip", size: "1.1 MB" },
            ],
          },
        ],
      },
      {
        id: 1,
        title: "State Management & Lifecycle",
        lessons: [
          {
            id: 4,
            title: "Understanding State",
            type: "video",
            duration: "25m",
            description:
              "Master the concept of state in React components. Learn when and how to use state effectively.",
            videoUrl: "#",
            resources: [
              { id: 8, title: "State Examples", type: "zip", size: "1.4 MB" },
            ],
          },
          {
            id: 5,
            title: "useState Hook",
            type: "video",
            duration: "30m",
            description:
              "Comprehensive guide to the useState hook, including multiple state variables and functional updates.",
            videoUrl: "#",
            resources: [
              {
                id: 9,
                title: "useState Examples",
                type: "zip",
                size: "1.8 MB",
              },
              {
                id: 10,
                title: "Hook Rules Reference",
                type: "pdf",
                size: "0.9 MB",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Advanced React Patterns",
        lessons: [
          {
            id: 6,
            title: "Higher-Order Components",
            type: "video",
            duration: "35m",
            description:
              "Learn about Higher-Order Components (HOCs) and how to use them for code reuse and component composition.",
            videoUrl: "#",
            resources: [
              { id: 11, title: "HOC Patterns", type: "zip", size: "2.1 MB" },
            ],
          },
        ],
      },
    ],
  };

  // Get current lesson data
  const currentLesson = courseData.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.id === activeLesson);

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const selectLesson = (lessonId) => {
    setActiveLesson(lessonId);
  };

  const markLessonComplete = () => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(activeLesson);
    setCompletedLessons(newCompleted);
  };

  const getNextLesson = () => {
    const allLessons = courseData.modules.flatMap((module) => module.lessons);
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === activeLesson
    );
    return currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;
  };

  const getPreviousLesson = () => {
    const allLessons = courseData.modules.flatMap((module) => module.lessons);
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === activeLesson
    );
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        );
      case "reading":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        );
      case "quiz":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "pdf":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
        );
      case "zip":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 22h2a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <path d="M10 20v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"></path>
          </svg>
        );
      case "link":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
          </svg>
        );
    }
  };

  return (
    <div className={`${style.courseContentContainer} ${themeClass}`}>
      <div className={style.courseContentLayout}>
        {/* Sidebar */}
        <div className={style.sidebar}>
          <div className={style.courseInfo}>
            <h1 className={style.courseTitle}>{courseData.title}</h1>
            <div className={style.courseProgress}>
              <div className={style.progressBar}>
                <div
                  className={style.progressFill}
                  style={{ width: `${courseData.progress}%` }}
                ></div>
              </div>
              <span className={style.progressText}>{courseData.progress}%</span>
            </div>
            <div className={style.courseStats}>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {completedLessons.size}
                </span>
                <span className={style.statLabel}>Completed</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {courseData.totalLessons}
                </span>
                <span className={style.statLabel}>Total</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {courseData.totalLessons - completedLessons.size}
                </span>
                <span className={style.statLabel}>Remaining</span>
              </div>
            </div>
          </div>

          <div className={style.lessonsList}>
            {courseData.modules.map((module) => (
              <div key={module.id} className={style.moduleSection}>
                <div
                  className={style.moduleHeader}
                  onClick={() => toggleModule(module.id)}
                >
                  <span>{module.title}</span>
                  <svg
                    className={`${style.moduleToggle} ${
                      expandedModules.has(module.id) ? style.expanded : ""
                    }`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>

                {expandedModules.has(module.id) &&
                  module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`${style.lessonItem} ${
                        activeLesson === lesson.id ? style.active : ""
                      } ${
                        completedLessons.has(lesson.id) ? style.completed : ""
                      }`}
                      onClick={() => selectLesson(lesson.id)}
                    >
                      <div className={style.lessonIcon}>
                        {completedLessons.has(lesson.id) ? (
                          <span className={style.completedCheck}>✓</span>
                        ) : (
                          getTypeIcon(lesson.type)
                        )}
                      </div>
                      <div className={style.lessonContent}>
                        <div className={style.lessonTitle}>{lesson.title}</div>
                        <div className={style.lessonDuration}>
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={style.mainContent}>
          {currentLesson && (
            <>
              <div className={style.contentHeader}>
                <h1 className={style.contentTitle}>{currentLesson.title}</h1>
                <div className={style.contentMeta}>
                  <div className={style.metaItem}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>{currentLesson.duration}</span>
                  </div>
                  <div className={style.metaItem}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect
                        x="8"
                        y="2"
                        width="8"
                        height="4"
                        rx="1"
                        ry="1"
                      ></rect>
                    </svg>
                    <span>{currentLesson.type}</span>
                  </div>
                  <div className={style.metaItem}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span>{courseData.instructor}</span>
                  </div>
                </div>
              </div>

              <div className={style.contentBody}>
                {/* Video Player */}
                {/* {currentLesson.type === 'video' && (
                  <div className={style.videoContainer}>
                    <div className={style.videoPlayer}>
                      <button className={style.playButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                    </div>
                    <div className={style.videoControls}>
                      <div className={style.controlsRow}>
                        <button className={style.controlButton}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </button>
                        <button className={style.controlButton}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          </svg>
                        </button>
                        <select className={style.speedControl}>
                          <option>0.5x</option>
                          <option>0.75x</option>
                          <option selected>1x</option>
                          <option>1.25x</option>
                          <option>1.5x</option>
                          <option>2x</option>
                        </select>
                        <button className={style.controlButton}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <path d="M9 9h6v6H9z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )} */}
                <VideoPlayer
                  sources={sources}
                  // poster="/poster.jpg"
                  initialQuality="720p"
                  initialVolume={0.8}
                  theaterDefault={false}
                  autoPlay={false}
                />{" "}
                {/* Lesson Description */}
                <div className={style.contentSection}>
                  <h2 className={style.sectionTitle}>
                    <svg
                      className={style.sectionIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    About This Lesson
                  </h2>
                  <p className={style.description}>
                    {currentLesson.description}
                  </p>
                </div>
                {/* Resources */}
                {currentLesson.resources &&
                  currentLesson.resources.length > 0 && (
                    <div className={style.contentSection}>
                      <h2 className={style.sectionTitle}>
                        <svg
                          className={style.sectionIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14,2 14,8 20,8"></polyline>
                        </svg>
                        Lesson Resources
                      </h2>
                      <div className={style.resourcesList}>
                        {currentLesson.resources.map((resource) => (
                          <a
                            key={resource.id}
                            href="#"
                            className={style.resourceItem}
                          >
                            <div className={style.resourceIcon}>
                              {getResourceIcon(resource.type)}
                            </div>
                            <div className={style.resourceContent}>
                              <h3 className={style.resourceTitle}>
                                {resource.title}
                              </h3>
                              <p className={style.resourceMeta}>
                                {resource.type.toUpperCase()} • {resource.size}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Navigation Controls */}
              <div className={style.navigationControls}>
                <div>
                  {getPreviousLesson() && (
                    <button
                      className={style.navButton}
                      onClick={() => selectLesson(getPreviousLesson().id)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                      Previous: {getPreviousLesson().title}
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {!completedLessons.has(activeLesson) && (
                    <button
                      className={style.completeButton}
                      onClick={markLessonComplete}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      Mark Complete
                    </button>
                  )}

                  {getNextLesson() && (
                    <button
                      className={`${style.navButton} ${style.primary}`}
                      onClick={() => selectLesson(getNextLesson().id)}
                    >
                      Next: {getNextLesson().title}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
