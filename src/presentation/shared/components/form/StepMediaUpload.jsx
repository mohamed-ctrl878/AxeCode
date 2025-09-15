import { toFormData } from "@core/utils/problemUploader/handellers";
import { checkLength } from "@core/utils/problemUploader/validation";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import React, { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import useUpdateStoper from "./useUpdateStoper";
// import { useValidateInputEffect } from "./useValidateInputEffect";
// import { setLessonData } from "../@data/storage/storeRx/lessonData";
// import { checkLength } from "../utils/problemUploader/validation";

const StepMediaUpload = ({
  ShowMedia,
  dataSetter,
  storeName,
  style,
  media,
}) => {
  const mediaFromStore = useSelector((state) => state[storeName][media]);
  const Store = useSelector((state) => state[storeName]);

  console.log(mediaFromStore);
  console.log(Store);
  const [mediaCurrent, setMediaCurrent] = useState(mediaFromStore);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  // useUpdateStoper is used to reset the error state when the title changes
  useUpdateStoper({
    change: mediaCurrent,
    setErr,
  });
  useValidateInputEffect({
    fieldName: media,
    setProberty: dataSetter,
    dispatch,
    value: mediaCurrent,
    currentFieldValue: mediaFromStore,
    condition: mediaCurrent instanceof File,
    setError: setErr,
    validationFunc: checkLength,
    errorMessage: "Title must be at least 1 character long",
  });
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith(`${media}/`)) {
      setErr(`Please upload a valid ${media} file.`);
      setMediaCurrent(null);
      return;
    }
    setMediaCurrent(file);
  };

  useEffect(() => {
    if (!mediaCurrent) return;
    const ac = new AbortController();

    const uploadMedia = async () => {
      try {
        const formData = toFormData(mediaCurrent);
        // debug
        for (const pair of formData.entries()) {
          console.log("formData entry:", pair[0], pair[1]);
        }
        console.log("formData", formData);
        // الحصول على التوكن (عدّل حسب استخدامك: من localStorage أو redux)
        const token = localStorage.getItem("token"); // مثال

        const res = await fetch(import.meta.env.VITE_API_UPLOADS, {
          method: "POST",
          headers: {
            // لا تضيف Content-Type هنا — المتصفح يضبط boundary تلقائيًا
          },

          credentials: "include",
          // إذا ستراپي يستخدم JWT عبر header فاستعمل Authorization.
          // إذا كنت تعتمد على session cookies فممكن تضع credentials: "include"
          // لكن تأكد من إعدادات CORS على السيرفر.
          body: formData,
          // signal: ac.signal,
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = text;
        }

        if (!res.ok) {
          console.error("Upload failed:", res.status, data);
          return;
        }

        console.log("Upload success:", data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Upload error:", err);
      }
    };

    uploadMedia();
    return () => ac.abort();
  }, [mediaCurrent]);
  return (
    <div className={`${style.step} ${style.active}`} id="step2">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Media Upload</h3>
        <p className={style.stepSubtitle}>Upload your {media} file</p>

        <div className={style.formGroup}>
          <label htmlFor="upload" className={style.formLabel}>
            Upload Media *
          </label>
          <input
            id="upload"
            type="file"
            className={style.formControl}
            accept={media === "video" ? "video/*" : "image/*"}
            required
            onChange={handleChange}
          />
          {/* {vidErr && <div className={style.error}>{vidErr}</div>} */}
          {mediaCurrent?.name && (
            <div className={style.filePreview}>
              <span className={style.fileName}>{mediaCurrent?.name}</span>
              <span className={style.fileSize}>
                {(mediaCurrent?.size / 1024 / 1024).toFixed(2)} MB
                {ShowMedia ? <ShowMedia file={mediaCurrent} /> : null}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepMediaUpload;
