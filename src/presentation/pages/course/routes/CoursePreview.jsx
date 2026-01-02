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

  const [duration, setDuration] = useState([]);

  const sumOflesson = data?.weeks?.reduce((acc, week) => acc + (week?.lessons?.length || 0), 0) || 0;

  const getDuration = async (url) => {
    return await getVideoDuration(`http://localhost:1338${url}`);
  };

  useEffect(() => {
    if (!data?.weeks) return;

    const loadDurations = async () => {
      const matrix = await Promise.all(
        data?.weeks.map(async (week) =>
          Promise.all(
            (week?.lessons ?? []).map(async (lesson) => {
              if (lesson?.video?.url) {
                const dur = await getDuration(lesson.video.url);
                return Math.round(dur / 60);
              }
              return 0;
            })
          )
        )
      );

      setDuration(matrix);
    };

    loadDurations();
  }, [data]);

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        );
      case "exercise":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4m-3-2h-2m0 0V4m0 5a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2"></path>
          </svg>
        );
      case "quiz":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
    }
  };

  const instructorName = data?.users_permissions_user 
    ? (data?.users_permissions_user.firstname && data?.users_permissions_user.lastname 
        ? `${data?.users_permissions_user.firstname} ${data?.users_permissions_user.lastname}`
        : data?.users_permissions_user.username)
    : "Expert Instructor";

  if (load) return <div className={style.loadingState}>Loading Course Details...</div>;
  if (error) return <div className={style.errorState}>Error loading course data?.</div>;

  return (
    <div className={`${style.coursePreviewContainer} ${themeClass}`}>
      {/* Hero Section */}
      <div className={style.courseHero}>
        <div className={style.heroContent}>
          <div className={style.heroText}>
            <div className={style.difficultyBadge}>{data?.difficulty || "All Levels"}</div>
            <h1 className={style.courseTitle}>{data?.title}</h1>
            
            <div className={style.courseMetaBrutalist}>
              <div className={style.metaPill}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <span>{data?.weeks?.length || 0} Modules</span>
              </div>
              <div className={style.metaPill}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                <span>{data?.rate || "9.0"} Rating</span>
              </div>
              <div className={style.metaPill}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{data?.student_count || "0"} Enrolled</span>
              </div>
            </div>

            <div className={style.instructorQuickInfo}>
              <div className={style.instrIcon}>BY</div>
              <span className={style.instrName}>{instructorName}</span>
            </div>
          </div>

          <div className={style.heroCardBrutalist}>
            <div className={style.imageContainer}>
              <img
                src={data?.picture?.url ? `http://localhost:1338${data?.picture.url}` : "https://via.placeholder.com/800x450?text=Course+Thumbnail"}
                alt={data?.title}
                className={style.heroImage}
              />
            </div>
            <div className={style.heroCardContent}>
              <div className={style.priceWrapper}>
                <span className={style.priceLabel}>Full Course Access</span>
                <span className={style.priceValue}>{data?.price ? `$${data?.price}` : "Free"}</span>
              </div>
              <div className={style.actionButtons}>
                {(() => {
                  const firstLessonId = data?.weeks?.find(w => w.lessons?.length > 0)?.lessons[0]?.id;
                  const firstLessonPath = firstLessonId ? `/courses/preview/${data?.documentId}/${firstLessonId}` : "#";
                  
                  return (
                    <Link 
                      to={
                        data?.hasAccess
                          ? firstLessonPath
                          : (data?.price > 0 
                              ? `/courses/checkout/${data?.documentId}` 
                              : `/courses/preview/${data?.documentId}/${firstLessonId}/${data?.entitlementId}`)
                      } 
                      className={style.enrollButton}
                    >
                      {data?.hasAccess 
                        ? "Continue Learning" 
                        : (data?.price > 0 ? "Enroll Now" : "Get Started Now")}
                    </Link>
                  );
                })()}
                <button className={style.previewButton}>Watch Preview</button>
              </div>
              <p className={style.guaranteeText}>30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={style.contentLayout}>
        <div className={style.mainContent}>
          {/* About Section */}
          <div className={style.brutalistSection}>
            <h2 className={style.sectionHeading}>About This Course</h2>
            <div className={style.descriptionContent}>
              <RichTextRenderer content={data?.description}></RichTextRenderer>
            </div>
          </div>

          {/* Integration Section */}
          <div className={style.brutalistSection}>
            <h2 className={style.sectionHeading}>What You'll Master</h2>
            <div className={style.skillsGrid}>
              {data?.course_types && [...data?.course_types, ...(data?.problem_types || [])].map((item, index) => (
                <div key={index} className={style.skillBox}>
                  <div className={style.skillCheck}>✓</div>
                  <span className={style.skillTitle}>{item?.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Section */}
          <div className={style.brutalistSection}>
            <h2 className={style.sectionHeading}>Course Curriculum</h2>
            <div className={style.curriculumBrutalist}>
              {data?.weeks?.map((module, mIndex) => (
                <div key={module.id || mIndex} className={style.moduleCard}>
                  <div
                    className={style.moduleHeader}
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className={style.moduleMain}>
                      <span className={style.weekIndicator}>Module {mIndex + 1}</span>
                      <h3 className={style.moduleTitle}>{module.title}</h3>
                    </div>
                    <div className={style.moduleMeta}>
                      <span>{module?.lessons?.length || 0} Lessons</span>
                      <svg
                        className={`${style.chevron} ${expandedModule === module.id ? style.active : ""}`}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  <div className={`${style.lessonsPanel} ${expandedModule === module.id ? style.expanded : ""}`}>
                    {module?.lessons?.map((lesson, lIndex) => (
                      <div key={lesson.id || lIndex} className={style.lessonRow}>
                        <div className={style.lessonType}>
                          {getTypeIcon(lesson.type)}
                        </div>
                        <span className={style.lessonTitle}>{lesson.title}</span>
                        <div className={style.lessonDuration}>
                          {duration[mIndex]?.[lIndex] ? `${duration[mIndex][lIndex]} min` : "Video"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className={style.sidebar}>
          <div className={style.instructorCardBrutalist}>
            <h3 className={style.sideHeading}>Instructor</h3>
            <div className={style.instrHeader}>
              <div className={style.instrAvatarBox}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className={style.instrText}>
                <h4 className={style.instrName}>{instructorName}</h4>
                <p className={style.instrTitle}>AxeCode Certified Instructor</p>
              </div>
            </div>
            <div className={style.instrDescription}>
              Dedicated to delivering high-quality, actionable technical education in the AxeCode ecosystem.
            </div>
          </div>

          <div className={style.featuresCardBrutalist}>
            <h3 className={style.sideHeading}>This Course Includes</h3>
            <div className={style.featureList}>
              <div className={style.featureItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span>{sumOflesson} Video Lessons</span>
              </div>
              <div className={style.featureItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                <span>Downloadable Resources</span>
              </div>
              <div className={style.featureItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <span>Full Lifetime Access</span>
              </div>
              <div className={style.featureItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
                <span>Certificate of Completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
