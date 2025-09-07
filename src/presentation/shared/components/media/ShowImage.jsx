import React, { useState } from "react";
import styles from "@presentation/styles/components/showImage.module.css";
import useSetMediaSrc from "@presentation/shared/hooks/useSetMediaSrc";
const ShowImage = ({ file }) => {
  const [src, setSrc] = useState(null);

  useSetMediaSrc({ setSrc, file });

  if (!file) {
    return (
      <div className={`${styles.container}`}>
        <div className={styles.noPreview}>No video selected</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container}`}>
      <div className={styles.imageWrapper} data-fit={"contain"}>
        {src ? (
          <img className={styles.image} src={src} alt={"preview"} />
        ) : (
          <div className={styles.noPreviewInner}>Preview not available</div>
        )}
      </div>

      {/* {showMeta && (
        <div className={styles.meta}>
          <div className={styles.infoGroup}>
            <span className={styles.fileName}>{name}</span>
            {size && <span className={styles.fileSize}>{size}</span>}
          </div>

          {typeof onRemove === 'function' && (
            <button type="button" className={styles.removeBtn} onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      )} */}
    </div>
  );
};

export default ShowImage;
