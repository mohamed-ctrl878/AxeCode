import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import useUpdateStoper from "./useUpdateStoper";
// import { useValidateInputEffect } from "./useValidateInputEffect";
// import { setLessonData } from "../@data/storage/storeRx/lessonData";
// import { checkLength } from "../utils/problemUploader/validation";

const StepMediaUpload = ({ dataSetter, storeName, style }) => {
  // const titleFromStore = useSelector((state) => state[storeName].title);
  // console.log(titleFromStore);
  // const [title, setTitle] = useState(titleFromStore || "");
  // const [err, setErr] = useState("");
  // const dispatch = useDispatch();
  // // useUpdateStoper is used to reset the error state when the title changes
  // useUpdateStoper({
  //   change: title,
  //   setErr,
  // });

  // // useValidateInputEffect is a custom hook that validates the title input
  // // *make this in another file
  // // and use it in other steps as well
  // useValidateInputEffect({
  //   fieldName: "title",
  //   setProberty: dataSetter,
  //   dispatch,
  //   value: title,
  //   currentFieldValue: titleFromStore,
  //   condition: title.length > 0,
  //   setError: setErr,
  //   validationFunc: checkLength,
  //   errorMessage: "Title must be at least 1 character long",
  // });

  return (
    <div className={`${style.step} ${style.active}`} id="step2">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Media Upload</h3>
        <p className={style.stepSubtitle}>Upload your video or image file</p>

        <div className={style.formGroup}>
          <label htmlFor="upload" className={style.formLabel}>
            Upload Media *
          </label>
          <input
            id="upload"
            type="file"
            className={style.formControl}
            accept="video/*,image/*"
            required
          />
          {/* {vidErr && <div className={style.error}>{vidErr}</div>} */}
          {/* {video && (
            <div className={style.filePreview}>
              <span className={style.fileName}>{video.name}</span>
              <span className={style.fileSize}>
                {(video.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default StepMediaUpload;
