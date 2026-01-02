import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "@presentation/styles/pages/course-content.module.css";
import VideoPlayer from "@presentation/shared/components/video/VideoPlayer";
import useGetContent from "@presentation/shared/hooks/useGetContent";
import { GetOneCourse } from "@data/repositories/courseImps/GetOneCourse";
import { getOneItemExe } from "@domain/usecases/shared/getOneItemExe";

const CourseContent = ({ theme }) => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set([0]));
  
  async function getCourse() {
    return await getOneItemExe(new GetOneCourse(), `${courseId}`,`populate[0]=weeks&populate[1]=weeks.lessons&populate[2]=weeks.lessons.video`);
  }
  
  const { load: loadCourse, data: courseData, error: errorCourse } = useGetContent({
    lsnId: lessonId,
    crsId: courseId,
    caseUse: getCourse,
  }); 
  
  const currentLesson = courseData?.weeks
    ?.flatMap((week) => week?.lessons || [])
    .find((lesson) => lesson?.id == lessonId);



  const videoSource = currentLesson?.video?.url 
    ? {
        quality: "1080p", 
        src: `http://localhost:1338${currentLesson.video.url}`,
        type: currentLesson.video.mime || "video/mp4",
      }
    : null;
    
  const themeClass = theme ? "dark-theme" : "light-theme";

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const selectLesson = (id) => {
    navigate(`/courses/preview/${courseId}/${id}`);
  };

  const markLessonComplete = () => {
    const newCompleted = new Set(completedLessons);
    if(lessonId) newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);
  };

  const getNextLesson = () => {
    if (!courseData?.weeks) return null;
    const allLessons = courseData.weeks.flatMap((week) => week?.lessons || []);
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id == lessonId
    );
    return currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;
  };

  const getPreviousLesson = () => {
    if (!courseData?.weeks) return null;
    const allLessons = courseData.weeks.flatMap((week) => week?.lessons || []);
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id == lessonId
    );
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "pdf":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        );
      case "zip":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 22h2a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <path d="M10 20v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"></path>
          </svg>
        );
      case "link":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
          </svg>
        );
    }
  };

  useEffect(() => {
    if (courseData && courseData.price > 0 && !courseData.hasAccess) {
      navigate(`/courses/preview/${courseId}`);
    }
  }, [courseData, courseId, navigate]);

  const progressCount = courseData?.weeks?.flatMap((w) => w.lessons).length || 1;
  const progressPercentage = Math.round((completedLessons.size / progressCount) * 100);

  return (
    <div className={`${style.courseContentContainer} ${themeClass}`}>
      <div className={style.courseContentLayout}>
        {/* Sidebar */}
        <div className={style.sidebar}>
          <div className={style.courseInfoCard}>
            <h2 className={style.sidebarCourseTitle}>{courseData?.title}</h2>
            <div className={style.difficultyBadge}>{courseData?.difficulty}</div>

            <div className={style.courseProgressSection}>
              <div className={style.progressHeader}>
                <span className={style.progressLabel}>Your Progress</span>
                <span className={style.progressPercentage}>{progressPercentage}%</span>
              </div>
              <div className={style.progressBar}>
                <div
                  className={style.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className={style.courseStatsBrutalist}>
              <div className={style.statBox}>
                <span className={style.statVal}>{courseData?.rate || "9.0"}</span>
                <span className={style.statLab}>Rating</span>
              </div>
              <div className={style.statBox}>
                <span className={style.statVal}>{courseData?.student_count || "0"}</span>
                <span className={style.statLab}>Students</span>
              </div>
            </div>
          </div>

          <div className={style.lessonsList}>
            {courseData?.weeks?.map((week, weekIndex) => (
              <div key={week.id || weekIndex} className={style.moduleSection}>
                <div
                  className={style.moduleHeader}
                  onClick={() => toggleModule(week.id || weekIndex)}
                >
                  <span className={style.moduleTitleText}>{week.title}</span>
                  <svg
                    className={`${style.moduleToggle} ${
                      expandedModules.has(week.id || weekIndex) ? style.expanded : ""
                    }`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>

                <div
                  className={`${style.moduleContent} ${
                    expandedModules.has(week.id || weekIndex) ? style.moduleExpanded : ""
                  }`}
                >
                  {week.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`${style.lessonItem} ${
                        lessonId == lesson.id ? style.active : ""
                      } ${completedLessons.has(lesson.id) ? style.completed : ""}`}
                      onClick={() => selectLesson(lesson.id)}
                    >
                      <div className={style.lessonStatusIcon}>
                        {completedLessons.has(lesson.id) ? (
                          <div className={style.checkCircle}>✓</div>
                        ) : (
                          <div className={style.playCircle}></div>
                        )}
                      </div>
                      <div className={style.lessonInfo}>
                        <div className={style.lessonTitleText}>{lesson.title}</div>
                        {lesson.duration && (
                          <div className={style.lessonTime}>{lesson.duration}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={style.mainContent}>
          {currentLesson ? (
            <div className={style.contentWrapper}>
              <div className={style.videoCard}>
                <VideoPlayer
                  key={lessonId}
                  sources={videoSource ? [videoSource] : []}
                  initialQuality="1080p"
                  initialVolume={0.8}
                  theaterDefault={false}
                  autoPlay={false}
                />
              </div>

              <div className={style.lessonDetailsCard}>
                <div className={style.detailsHeader}>
                  <h1 className={style.mainLessonTitle}>{currentLesson?.title}</h1>
                  <div className={style.lessonMetaBrutalist}>
                    <div className={style.metaPill}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      {currentLesson?.duration}
                    </div>
                    <div className={style.metaPill}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      {currentLesson?.type || "Video"}
                    </div>
                  </div>
                </div>

                <div className={style.descriptionSection}>
                  <h3 className={style.sectionSubTitle}>About Lesson</h3>
                  <div className={style.descriptionText}>
                    {Array.isArray(currentLesson?.description)
                      ? currentLesson.description.map((desc) =>
                          desc?.children?.map((child) => child.text).join(" ")
                        ).join("\n")
                      : currentLesson?.description}
                  </div>
                </div>

                {currentLesson?.resources && currentLesson?.resources.length > 0 && (
                  <div className={style.resourcesSection}>
                    <h3 className={style.sectionSubTitle}>Resources</h3>
                    <div className={style.resourcesGrid}>
                      {currentLesson?.resources.map((resource) => (
                        <Link key={resource.id} to={"#"} className={style.brutalistResource}>
                          <div className={style.resourceIconBox}>
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className={style.resourceTextInfo}>
                            <div className={style.resName}>{resource.title}</div>
                            <div className={style.resMeta}>
                              {resource.type.toUpperCase()} • {resource.size}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={style.navigationFooter}>
                <div className={style.navGroup}>
                  {getPreviousLesson() && (
                    <button
                      className={style.brutalistNavBtn}
                      onClick={() => selectLesson(getPreviousLesson().id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                      <span>Previous</span>
                    </button>
                  )}
                </div>

                <div className={style.navGroup}>
                  {!completedLessons.has(lessonId) && (
                    <button className={style.brutalistCompleteBtn} onClick={markLessonComplete}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      Mark as Complete
                    </button>
                  )}

                  {getNextLesson() && (
                    <button
                      className={`${style.brutalistNavBtn} ${style.primaryNav}`}
                      onClick={() => selectLesson(getNextLesson().id)}
                    >
                      <span>Next Lesson</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={style.emptyState}>
              <div className={style.emptyCard}>
                <h2>Select a lesson to start learning</h2>
                <p>Welcome to {courseData?.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
