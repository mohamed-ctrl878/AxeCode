import React, { useState } from "react";
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
    caseUse: getCourse,
  }); 
  
  const currentLesson = courseData?.weeks
    ?.flatMap((week) => week?.lessons || [])
    .find((lesson) => lesson?.id == lessonId);


    console.log(currentLesson)

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

  return (
    <div className={`${style.courseContentContainer} ${themeClass}`}>
      <div className={style.courseContentLayout}>
        {/* Sidebar */}
        <div className={style.sidebar}>
          <div className={style.courseInfo}>
            <div className={style.courseProgress}>
              <div className={style.progressBar}>
                <div className={style.progressFill}></div>
              </div>
            </div>
            <div className={style.courseStats}>
              <div className={style.statItem}>
                <span className={style.statNumber}>{completedLessons.size}</span>
                <span className={style.statLabel}>Completed</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}></span>
                <span className={style.statLabel}>Total</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}></span>
                <span className={style.statLabel}>Remaining</span>
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
                  <span>{week.title}</span>
                  <svg
                    className={`${style.moduleToggle} ${
                      expandedModules.has(week.id || weekIndex) ? style.expanded : ""
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

                {expandedModules.has(week.id || weekIndex) &&
                  week.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`${style.lessonItem} ${
                        lessonId == lesson.id ? style.active : ""
                      } ${
                        completedLessons.has(lesson.id) ? style.completed : ""
                      }`}
                      onClick={() => selectLesson(lesson.id)}
                    >
                      <div className={style.lessonIcon}>
                        {completedLessons.has(lesson.id) ? (
                          <span className={style.completedCheck}>✓</span>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                          </svg>
                        )}
                      </div>
                      <div className={style.lessonContent}>
                        <div className={style.lessonTitle}>{lesson.title}</div>
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
                <h1 className={style.contentTitle}>{currentLesson?.title}</h1>
                <div className={style.contentMeta}>
                  <div className={style.metaItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>{currentLesson?.duration}</span>
                  </div>
                  <div className={style.metaItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    <span>{currentLesson?.type}</span>
                  </div>
                  <div className={style.metaItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span>{courseData?.instructor}</span>
                  </div>
                </div>
              </div>

              <div className={style.contentBody}>
                <VideoPlayer
                  sources={videoSource ? [videoSource] : []}
                  initialQuality="1080p"
                  initialVolume={0.8}
                  theaterDefault={false}
                  autoPlay={false}
                />
                
                <div className={style.contentSection}>
                  <h2 className={style.sectionTitle}>
                    <svg className={style.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    About This Lesson
                  </h2>
                  <p className={style.description}>
                    {Array.isArray(currentLesson?.description) 
                      ? currentLesson.description.map(desc => desc?.children?.map(child => child.text).join(' ')).join('\n')
                      : currentLesson?.description}
                  </p>
                </div>

                {currentLesson?.resources && currentLesson?.resources.length > 0 && (
                  <div className={style.contentSection}>
                    <h2 className={style.sectionTitle}>
                      <svg className={style.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                      </svg>
                      Lesson Resources
                    </h2>
                    <div className={style.resourcesList}>
                      {currentLesson?.resources.map((resource) => (
                        <Link key={resource.id} to={"#"} className={style.resourceItem}>
                          <div className={style.resourceIcon}>
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className={style.resourceContent}>
                            <h3 className={style.resourceTitle}>{resource.title}</h3>
                            <p className={style.resourceMeta}>
                              {resource.type.toUpperCase()} • {resource.size}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={style.navigationControls}>
                <div>
                  {getPreviousLesson() && (
                    <button className={style.navButton} onClick={() => selectLesson(getPreviousLesson().id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                      Previous: {getPreviousLesson().title}
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {!completedLessons.has(lessonId) && (
                    <button className={style.completeButton} onClick={markLessonComplete}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      Mark Complete
                    </button>
                  )}

                  {getNextLesson() && (
                    <button className={`${style.navButton} ${style.primary}`} onClick={() => selectLesson(getNextLesson().id)}>
                      Next: {getNextLesson().title}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
