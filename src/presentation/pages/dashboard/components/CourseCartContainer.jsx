import { GetCourse } from "@data/repositories/courseImps/GetCourse";
import { getCoursesInfoExe } from "@domain/usecases/course/getCoursesInfoExe";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGetContent from "@presentation/shared/hooks/useGetContent";
import React from "react"
import { Link } from "react-router-dom";


export default function CourseCartContainer(){
  async function caseUse() {
    return await getCoursesInfoExe(new GetCourse(), "populate=*");
  }
  const { load, data, error } = useGetContent({ caseUse });
    return (<>

    {          data?.map((course) => {
                const firstLessonId = course.weeks?.find(w => w.lessons?.length > 0)?.lessons[0]?.id;
                return (
                  <div
                    key={course.documentId || course.id}
                    // className={style.courseCard}
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
                      {course.price > 0 && !course.hasAccess && (
                        <div style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "var(--card-yellow)",
                          padding: "4px 8px",
                          border: "2px solid var(--border-dark)",
                          fontWeight: "800",
                          fontSize: "0.75rem",
                          boxShadow: "2px 2px 0px var(--border-dark)"
                        }}>
                          ${course.price}
                        </div>
                      )}
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
                              justifyContent: "space-between",
                              color: "var(--text-secondary)",
                              fontSize: "0.875rem",
                              marginTop: "0.5rem",
                            }}
                          >
                            <span>Difficulty: {course.difficulty || "All Levels"}</span>
                            <span>{course.student_count || 0} Students</span>
                          </div>
                        </div>
    
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <Link
                            to={`/courses/preview/${course.documentId}/`}
                            className="btn btn-secondary"
                            style={{ flex: 1, textAlign: "center" }}
                          >
                            Preview
                          </Link>

                          <Link>edit</Link>
                            <Link to={`/settings/content/configure/course/${course?.documentId}`}>
                            <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
                            </Link>
                        </div>
                      </div>
                  </div>
                );
              })}
    </>)
}