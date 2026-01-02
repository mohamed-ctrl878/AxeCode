import { GetLessons } from "@data/repositories/lessonImps/GetLessons";
import getLessonsExe from "@domain/usecases/lesson/getLessonsExe";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGetContent from "@presentation/shared/hooks/useGetContent";
import React from "react"
import { Link } from "react-router-dom";
export default function LessonCartContainer(){
      async function caseUse() {
        return await getLessonsExe(new GetLessons(), "populate=*");
      }
      const { load, data, error } = useGetContent({ caseUse });

    return (<>
        {          data?.length>1&&data[1]?.data.map((lesson) => {
                    return (
                      <div
                        key={lesson.documentId || lesson.id}
                        // className={style.lessonCard}
                      >
                        <div style={{ position: "relative" }}>
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
                            dvdfvdfv
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
                                {lesson.title}
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
                              </div>
                            </div>
        
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                              <Link
                                to={`/lessons/preview/${lesson.documentId}/`}
                                className="btn btn-secondary"
                                style={{ flex: 1, textAlign: "center" }}
                              >
                                Preview
                              </Link>
    
                              <Link>edit</Link>
                                <Link>
                                <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
                                </Link>
                            </div>
                          </div>
                      </div>
                    );
                  })}
    </>)
}