// ShowVideo.jsx
import React, {  useState } from "react";
import styles from "@presentation/styles/components/showVideo.module.css";
import useSetMediaSrc from "@presentation/shared/hooks/useSetMediaSrc";


const ShowVideo = ({ file = null,  }) => {
  const [src, setSrc] = useState(null);

  useSetMediaSrc({ setSrc, file });

  if (!file) {
    return (
      <div className={`${styles.container}`} >
        <div className={styles.noPreview}>No video selected</div>
      </div>
    );
  }
  return (
    <div className={`${styles.container}`} >
      <div className={styles.videoWrapper}>
        <video
          className={styles.video}
          src={src}
          controls={true}
          autoPlay={false}
          loop={false}
          muted={false}
        >
          Your browser does not support the video tag.
        </video>
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

export default ShowVideo;

/*
  ShowVideo.module.css
  --------------------
  Create a file named `ShowVideo.module.css` next to `ShowVideo.jsx` and paste the CSS below.

  NOTE: this CSS block is intentionally inside a single JS block comment to keep
  this file self-contained for the canvas. When you copy the CSS into a real
  `ShowVideo.module.css` file, do NOT include the surrounding comment markers.
*/

/*
.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: flex-start;
}

.videoWrapper {
  width: 100%;
  max-width: 720px;
  aspect-ratio: 16 / 9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.video {
  width: 100%;
  height: 100%;
  object-fit: contain; 
}

.meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 720px;
}

.infoGroup {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.fileName {
  font-weight: 600;
  font-size: 0.95rem;
  color: #111827;
}

.fileSize {
  font-size: 0.85rem;
  color: #6b7280;
}

.removeBtn {
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.noPreview {
  color: #6b7280;
  padding: 12px 14px;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
}
*/

/*
  USAGE EXAMPLE (paste into a React component):

  import React, { useState } from 'react';
  import ShowVideo from './ShowVideo';

  function Demo() {
    const [file, setFile] = useState(null);

    return (
      <div>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <ShowVideo
          file={file}
          controls
          showMeta
          onRemove={() => setFile(null)}
        />
      </div>
    );
  }

  export default Demo;

  SIMPLE TEST (manual):
  - Select a local video file with the input -> the player should appear and play (if autoplay true)
  - The file name and size should display under the player
  - Clicking Remove should clear the preview
*/
