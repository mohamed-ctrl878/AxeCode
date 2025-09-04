import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";

const StepReview = ({
  lsnOrCrs,
  tittle,
  description,
  video,
  courseId,
  linksArr,
}) => {
  return (
    <div className={`${style.step} ${style.active}`} id="step6">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Review & Submit</h3>
        <p className={style.stepSubtitle}>
          Review your information before submitting
        </p>

        <div className={style.reviewSection}>
          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Title:</h4>
            <p className={style.reviewValue}>{tittle}</p>
          </div>

          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Media File:</h4>
            <p className={style.reviewValue}>
              {video ? video.name : "No file selected"}
            </p>
          </div>

          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Description:</h4>
            <p className={style.reviewValue}>{description}</p>
          </div>

          {lsnOrCrs === "lesson" && (
            <div className={style.reviewItem}>
              <h4 className={style.reviewLabel}>Course ID:</h4>
              <p className={style.reviewValue}>{courseId || "Not selected"}</p>
            </div>
          )}

          {lsnOrCrs === "lesson" && linksArr.length > 0 && (
            <div className={style.reviewItem}>
              <h4 className={style.reviewLabel}>Links:</h4>
              <div className={style.reviewLinks}>
                {linksArr.map((link, index) => (
                  <div key={index} className={style.reviewLink}>
                    <span className={style.linkName}>{link.url}</span>
                    <span className={style.linkUrl}>
                      {link.children[0].text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={style.submitSection}>
          <button type="submit" className={`${style.btn} ${style.btnPrimary}`}>
            Upload {lsnOrCrs}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
