import React, { useEffect, useState } from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import { useSelector } from "react-redux";
import ShowImage from "@presentation/shared/components/media/ShowImage";
import ShowVideo from "@presentation/shared/components/media/ShowVideo";
import { get } from "idb-keyval";
import RichTextRenderer from "@presentation/shared/components/ui/themes&other/RichTextRenderer";

const StepReview = ({
  lsnOrCrs,
  tittle,
  description,
  storeName,
  media,
  courseId,
  linksArr,
}) => {
  const file = useSelector((state) => state[storeName]);
  const [currentMedia, setMedia] = useState(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      setMedia(await get(file[media]));
    })();
  }, [file]);
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
            <p className={style.reviewValue}>{file?.title}</p>
          </div>

          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Media File:</h4>

            {currentMedia &&
              (media === "video" ? (
                <ShowVideo file={currentMedia}></ShowVideo>
              ) : (
                <ShowImage
                  file={
                    currentMedia instanceof File &&
                    URL.createObjectURL(currentMedia)
                  }
                ></ShowImage>
              ))}
          </div>
          <div className={style.reviewItem}>
            <h4 className={style.reviewLabel}>Description:</h4>
            {file && (
              <RichTextRenderer content={file.description}></RichTextRenderer>
            )}
            {/* <p className={style.reviewValue}>{description}</p> */}
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
