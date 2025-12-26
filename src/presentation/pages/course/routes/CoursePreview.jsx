import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import style from "@presentation/styles/pages/course-preview.module.css";
import { GetOneCourse } from "@data/repositories/courseImps/GetOneCourse";
import useGetContent from "@presentation/shared/hooks/useGetContent";
import { getCoursesInfoExe } from "@domain/usecases/course/getCoursesInfoExe";
import { getOneItemExe } from "@domain/usecases/shared/getOneItemExe";
import RichTextRenderer from "@presentation/shared/components/ui/themes&other/RichTextRenderer";
import { courseQuery } from "@core/queries/courseQuery";
import getVideoDuration from "@core/utils/userhelpers/getVideoDuration";

const CoursePreview = ({ theme }) => {
  const { id } = useParams();
  const [expandedModule, setExpandedModule] = useState(null);

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";
  async function caseUse() {
    return await getOneItemExe(new GetOneCourse(), id, courseQuery());
  }
  const { load, data, error } = useGetContent({ caseUse });

  const [duration, setDuration] = useState();

  const sumOflesson =
    data?.weeks.reduce((p, c, a) => {
      console.log(p, c, a);
      return p?.lessons?.length + c?.lessons?.length;
    }) || 0;

  const getDuration = async (url) => {
    return await getVideoDuration(`http://localhost:1338${url}`);
  };

  useEffect(() => {
    if (!data?.weeks) return;

    const loadDurations = async () => {
      const matrix = await Promise.all(
        data.weeks.map(async (week) =>
          Promise.all(
            (week?.lessons ?? []).map(async (lesson) => {
              const duration = await getDuration(lesson?.video?.url);
              return parseInt(60 / duration);
            })
          )
        )
      );

      setDuration(matrix);
    };

    loadDurations();
  }, [data]);

  console.log(data);
  // Mock course data - replace with actual API call
  const courseData = {
    id: parseInt(id) || 1,
    title: "Complete React Development Masterclass",
    subtitle:
      "Build modern web applications with React, Redux, and the latest JavaScript ES6+ features",
    description:
      "Master React.js from the ground up and build amazing user interfaces. This comprehensive course covers everything from React fundamentals to advanced concepts like state management with Redux, hooks, context API, and modern development practices. Perfect for beginners and intermediate developers looking to level up their React skills.",
    instructor: {
      name: "Ahmed Ali",
      title: "Senior Full-Stack Developer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      students: 12540,
      courses: 8,
    },
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    price: 99,
    originalPrice: 149,
    rating: 4.8,
    students: 1250,
    duration: "12 weeks",
    lessons: 45,
    language: "English",
    level: "Intermediate",
    lastUpdated: "December 2024",
    skills: [
      "React.js Fundamentals",
      "Component Architecture",
      "State Management",
      "React Hooks",
      "Redux & Context API",
      "Modern JavaScript ES6+",
      "API Integration",
      "Testing with Jest",
      "Deployment Strategies",
      "Performance Optimization",
    ],
    features: [
      "45 hours of on-demand video",
      "12 coding exercises",
      "8 downloadable resources",
      "Certificate of completion",
      "Lifetime access",
      "Mobile and TV access",
      "Community support",
      "30-day money-back guarantee",
    ],
    curriculum: [
      {
        id: 1,
        title: "Getting Started with React",
        duration: "2h 15m",
        lessons: 8,
        lessons_list: [
          { title: "Introduction to React", type: "video", duration: "15m" },
          {
            title: "Setting up Development Environment",
            type: "video",
            duration: "20m",
          },
          {
            title: "Your First React Component",
            type: "video",
            duration: "18m",
          },
          { title: "JSX Fundamentals", type: "video", duration: "25m" },
          { title: "Props and Components", type: "video", duration: "30m" },
          { title: "Handling Events", type: "video", duration: "22m" },
          {
            title: "Exercise: Build a Simple App",
            type: "exercise",
            duration: "15m",
          },
          { title: "Quiz: React Basics", type: "quiz", duration: "10m" },
        ],
      },
      {
        id: 2,
        title: "State Management & Lifecycle",
        duration: "3h 30m",
        lessons: 12,
        lessons_list: [
          { title: "Understanding State", type: "video", duration: "25m" },
          { title: "useState Hook", type: "video", duration: "30m" },
          { title: "useEffect Hook", type: "video", duration: "35m" },
          { title: "Component Lifecycle", type: "video", duration: "28m" },
          { title: "Conditional Rendering", type: "video", duration: "20m" },
          { title: "Lists and Keys", type: "video", duration: "25m" },
          { title: "Form Handling", type: "video", duration: "32m" },
          { title: "Exercise: Todo App", type: "exercise", duration: "25m" },
          { title: "Custom Hooks", type: "video", duration: "30m" },
          { title: "useContext Hook", type: "video", duration: "25m" },
          { title: "useReducer Hook", type: "video", duration: "20m" },
          { title: "Quiz: State Management", type: "quiz", duration: "15m" },
        ],
      },
      {
        id: 3,
        title: "Advanced React Patterns",
        duration: "4h 45m",
        lessons: 15,
        lessons_list: [
          { title: "Higher-Order Components", type: "video", duration: "35m" },
          { title: "Render Props Pattern", type: "video", duration: "30m" },
          {
            title: "React.memo and Optimization",
            type: "video",
            duration: "25m",
          },
          { title: "useCallback and useMemo", type: "video", duration: "28m" },
          { title: "Error Boundaries", type: "video", duration: "20m" },
          { title: "Portals and Refs", type: "video", duration: "25m" },
          {
            title: "Suspense and Lazy Loading",
            type: "video",
            duration: "30m",
          },
          { title: "Context API Deep Dive", type: "video", duration: "35m" },
          {
            title: "Exercise: Advanced Patterns",
            type: "exercise",
            duration: "40m",
          },
          { title: "Testing React Components", type: "video", duration: "32m" },
          { title: "Debugging Techniques", type: "video", duration: "18m" },
          { title: "Performance Profiling", type: "video", duration: "22m" },
          { title: "Best Practices", type: "video", duration: "20m" },
          {
            title: "Project: Component Library",
            type: "exercise",
            duration: "45m",
          },
          { title: "Quiz: Advanced Concepts", type: "quiz", duration: "20m" },
        ],
      },
      {
        id: 4,
        title: "Redux & State Management",
        duration: "3h 20m",
        lessons: 10,
        lessons_list: [
          { title: "Introduction to Redux", type: "video", duration: "25m" },
          { title: "Actions and Reducers", type: "video", duration: "30m" },
          { title: "Store and Dispatch", type: "video", duration: "28m" },
          { title: "React-Redux Integration", type: "video", duration: "35m" },
          { title: "Redux Toolkit", type: "video", duration: "32m" },
          { title: "Async Actions with Thunk", type: "video", duration: "30m" },
          { title: "Redux DevTools", type: "video", duration: "15m" },
          {
            title: "Exercise: Redux Todo App",
            type: "exercise",
            duration: "35m",
          },
          { title: "Alternative: Zustand", type: "video", duration: "20m" },
          { title: "Quiz: State Management", type: "quiz", duration: "10m" },
        ],
      },
    ],
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
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
      case "exercise":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4m-3-2h-2m0 0V4m0 5a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2"></path>
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

  return (
    <div className={`${style.coursePreviewContainer} ${themeClass}`}>
      {/* Hero Section */}
      <div className={style.courseHero}>
        <div className={style.heroContent}>
          <div className={style.heroText}>
            <h1 className={style.courseTitle}>{data?.title}</h1>
            {/* <p className={style.courseSubtitle}>{courseData.subtitle}</p> */}

            <div className={style.courseMeta}>
              <div className={style.metaItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <span>{data?.difficulty}</span>
              </div>
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
                <span>{data?.weeks.length} week</span>
              </div>
              <div className={style.metaItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{courseData.language}</span>
              </div>
              <div className={style.metaItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>{courseData.rating}</span>
              </div>
            </div>

            <div className={style.courseStats}>
              <div className={style.statItem}>
                <span className={style.statNumber}>{sumOflesson}</span>
                <span className={style.statLabel}>Lessons</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}>{courseData.students}</span>
                <span className={style.statLabel}>Students</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}>4.8</span>
                <span className={style.statLabel}>Rating</span>
              </div>
            </div>
          </div>

          <div className={style.heroCard}>
            <img
              src={courseData.image}
              alt={courseData.title}
              className={style.heroImage}
            />
            <div className={style.heroCardContent}>
              <div className={style.priceSection}>
                <span className={style.price}>${courseData.price}</span>
                <span className={style.oldPrice}>
                  ${courseData.originalPrice}
                </span>
              </div>
              <Link to={`/courses/preview/${data?.id}/${data?.weeks[0]?.lessons[0]?.id}`} className={style.enrollButton}>Enroll Now</Link>
              <button className={style.previewButton}>Preview Course</button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={style.contentSection}>
        <div className={style.mainContent}>
          {/* Course Description */}
          <div className={style.sectionCard}>
            <h2 className={style.sectionTitle}>About This Course</h2>
            <p className={style.description}>
              <RichTextRenderer content={data?.description}></RichTextRenderer>
            </p>
          </div>

          {/* What You'll Learn */}
          <div className={style.sectionCard}>
            <h2 className={style.sectionTitle}>What You'll Learn</h2>
            <ul className={style.skillsList}>
              {data?.course_types &&
                data?.problem_types &&
                [...data.course_types, ...data.problem_types].map(
                  (skill, index) => (
                    <li key={index} className={style.skillItem}>
                      <span className={style.skillCheck}>✓</span>
                      <span>{skill?.title}</span>
                    </li>
                  )
                )}
            </ul>
          </div>

          {/* Course Curriculum */}
          <div className={style.sectionCard}>
            <h2 className={style.sectionTitle}>Course Curriculum</h2>
            <div className={style.curriculumList}>
              {data?.weeks.map((module, i) => (
                <div key={module.id} className={style.moduleItem}>
                  <div
                    className={style.moduleHeader}
                    onClick={() => toggleModule(module.id)}
                  >
                    <h3 className={style.moduleTitle}>{module.title}</h3>
                    <div className={style.moduleInfo}>
                      <span>{module?.lessons.length} lessons</span>
                      {/* <span>{module.duration}</span> */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          transform:
                            expandedModule === module.id
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </div>
                  </div>
                  {expandedModule === module.id && (
                    <div className={style.lessonsList}>
                      {module?.lessons.map((lesson, index) => {
                        return (
                          <div key={index} className={style.lessonItem}>
                            <div className={style.lessonIcon}>
                              {getTypeIcon(lesson.type)}
                            </div>
                            <span>{lesson.title}</span>
                            <span
                              style={{
                                marginLeft: "auto",
                                fontSize: "0.75rem",
                              }}
                            >
                              {duration[i][index]} meniute
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={style.sidebar}>
          {/* Instructor Card */}
          <div className={style.instructorCard}>
            <img
              src={courseData.instructor.avatar}
              alt={courseData.instructor.name}
              className={style.instructorAvatar}
            />
            <h3 className={style.instructorName}>
              {courseData.instructor.name}
            </h3>
            <p className={style.instructorTitle}>
              {courseData.instructor.title}
            </p>

            <div className={style.instructorStats}>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {courseData.instructor.rating}
                </span>
                <span className={style.statLabel}>Rating</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {courseData.instructor.students.toLocaleString()}
                </span>
                <span className={style.statLabel}>Students</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {courseData.instructor.courses}
                </span>
                <span className={style.statLabel}>Courses</span>
              </div>
            </div>
          </div>

          {/* Course Features */}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
