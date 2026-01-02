import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useUpdateStoper from "@presentation/shared/hooks/useUpdateStoper";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";

const StepEventDetails = ({ dataSetter, storeName, style }) => {
  const dispatch = useDispatch();
  const eventData = useSelector((state) => state[storeName]);

  const [date, setDate] = useState(eventData.date || "");
  const [onsite, setOnsite] = useState(eventData.onsite ?? false);
  const [liveStreaming, setLiveStreaming] = useState(eventData.live_streaming ?? false);
  const [location, setLocation] = useState(eventData.location || "");
  const [duration, setDuration] = useState(eventData.duration || "");

  const [dateErr, setDateErr] = useState("");
  const [locationErr, setLocationErr] = useState("");
  const [durationErr, setDurationErr] = useState("");

  useUpdateStoper({ change: date, setErr: setDateErr });
  useUpdateStoper({ change: location, setErr: setLocationErr });
  useUpdateStoper({ change: duration, setErr: setDurationErr });

  useValidateInputEffect({
    fieldName: "date",
    setProberty: dataSetter,
    dispatch,
    value: date,
    currentFieldValue: eventData.date,
    condition: date.length > 0,
    setError: setDateErr,
    validationFunc: (val) => val,
    errorMessage: "Event date is required",
  });

  useValidateInputEffect({
    fieldName: "onsite",
    setProberty: dataSetter,
    dispatch,
    value: onsite,
    currentFieldValue: eventData.onsite,
    condition: true,
    setError: () => {},
    validationFunc: (val) => val,
  });

  useValidateInputEffect({
    fieldName: "live_streaming",
    setProberty: dataSetter,
    dispatch,
    value: liveStreaming,
    currentFieldValue: eventData.live_streaming,
    condition: true,
    setError: () => {},
    validationFunc: (val) => val,
  });

  useValidateInputEffect({
    fieldName: "location",
    setProberty: dataSetter,
    dispatch,
    value: location,
    currentFieldValue: eventData.location,
    condition: onsite ? location.length > 0 : true,
    setError: setLocationErr,
    validationFunc: (val) => {
      if (onsite && !val) throw new Error("Location is required for onsite events");
      return val;
    },
    errorMessage: "Location is required for onsite events",
  });

  useValidateInputEffect({
    fieldName: "duration",
    setProberty: dataSetter,
    dispatch,
    value: duration,
    currentFieldValue: eventData.duration,
    condition: duration.toString().length > 0,
    setError: setDurationErr,
    validationFunc: (val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error("Duration must be a positive number");
      return num;
    },
    errorMessage: "Duration must be a positive number",
  });

  return (
    <div className={`${style.step} ${style.active}`}>
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Logistics & Access</h3>
        <p className={style.stepSubtitle}>Configure how and where the event takes place</p>

        <div className={style.formGroup}>
          <label className={style.formLabel}>Event Date *</label>
          <input
            type="date"
            className={style.formControl}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {dateErr && <div className={style.error}>{dateErr}</div>}
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.75rem' }}>
            <input
              type="checkbox"
              checked={onsite}
              onChange={(e) => setOnsite(e.target.checked)}
              style={{ width: '22px', height: '22px' }}
            />
            <span className={style.formLabel} style={{ margin: 0, textTransform: 'none' }}>Onsite Event</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.75rem' }}>
            <input
              type="checkbox"
              checked={liveStreaming}
              onChange={(e) => setLiveStreaming(e.target.checked)}
              style={{ width: '22px', height: '22px' }}
            />
            <span className={style.formLabel} style={{ margin: 0, textTransform: 'none' }}>Live Streaming</span>
          </label>
        </div>

        {onsite && (
          <div className={style.formGroup}>
            <label className={style.formLabel}>Location Location *</label>
            <input
              type="text"
              className={style.formControl}
              placeholder="Physical address or venue name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {locationErr && <div className={style.error}>{locationErr}</div>}
          </div>
        )}

        <div className={style.formGroup}>
          <label className={style.formLabel}>Duration (Minutes) *</label>
          <input
            type="number"
            className={style.formControl}
            placeholder="e.g. 120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          {durationErr && <div className={style.error}>{durationErr}</div>}
        </div>
      </div>
    </div>
  );
};

export default StepEventDetails;
