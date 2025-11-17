import { useRef, useEffect, useMemo, useCallback, useState } from "react";
// import useVideoPlayer from "./useVideoPlayer";
import styles from "./VideoPlayer.module.css";
import useVideoPlayer from "@presentation/shared/hooks/useVideoPlayer";

/**
 * VideoPlayer Component
 * - Custom controls (Play/Pause, Seek, Volume, Fullscreen)
 * - Quality Selector (switches sources without losing position)
 * - Theater Mode (wider, cinema-style view)
 * - Playback Speed Control
 * - Prevent Download (no native controls, disable context menu, controlsList)
 * - Accessible (keyboard shortcuts + ARIA)
 * - TailwindCSS styling, responsive, minimal & modern
 */

/**
 * Props:
 * @param {Array<{quality: string; src: string; type?: string}>} sources - list of quality options
 * @param {string} [poster] - poster image
 * @param {string} [initialQuality] - default quality label to start with
 * @param {number} [initialVolume] - 0..1 default volume
 * @param {boolean} [theaterDefault] - start in theater mode
 * @param {string} [className] - extra class names for container
 * @param {boolean} [autoPlay] - start playing automatically when ready
 */
export default function VideoPlayer({
  sources = [],
  poster,
  initialQuality,
  initialVolume = 0.9,
  theaterDefault = false,
  className = "",
  autoPlay = false,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const qualities = useMemo(
    () => (sources || []).map((s) => s.quality),
    [sources]
  );

  const defaultQuality = useMemo(() => {
    if (initialQuality && qualities.includes(initialQuality))
      return initialQuality;
    // Prefer 1080p -> 720p -> 480p -> first
    const preferred = ["1080p", "720p", "480p"];
    for (const q of preferred) if (qualities.includes(q)) return q;
    return qualities[0];
  }, [initialQuality, qualities]);

  const [hovering, setHovering] = useState(false);

  const { state, actions, formatTime } = useVideoPlayer({
    videoRef,
    containerRef,
    sources,
    defaultQuality,
    initialVolume,
    theaterDefault,
    autoPlay,
  });

  const onKeyDown = useCallback(
    (e) => {
      // Skip if focus is on range inputs to not conflict with arrow keys
      const tag = document.activeElement?.tagName?.toLowerCase();
      const role = document.activeElement?.getAttribute?.("role");
      if (tag === "input" || role === "slider") return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          actions.togglePlay();
          break;
        case "arrowright":
          actions.seekBy(5);
          break;
        case "arrowleft":
          actions.seekBy(-5);
          break;
        case "arrowup":
          actions.changeVolumeBy(0.05);
          break;
        case "arrowdown":
          actions.changeVolumeBy(-0.05);
          break;
        case "m":
          actions.toggleMute();
          break;
        case "f":
          actions.toggleFullscreen();
          break;
        case "t":
          actions.toggleTheater();
          break;
        case ",":
          actions.cycleSpeed(-1);
          break;
        case ".":
          actions.cycleSpeed(1);
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          actions.seekToFraction(parseInt(e.key, 10) / 10);
          break;
        default:
          break;
      }
    },
    [actions]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const currentSource = useMemo(
    () => sources.find((s) => s.quality === state.quality) || sources[0],
    [sources, state.quality]
  );

  return (
    <section
      ref={containerRef}
      className={`${
        state.theater
          ? styles.videoPlayerContainer + " " + styles.theater
          : styles.videoPlayerContainer + " " + styles.normal
      } ${className}`}
      tabIndex={0}
      aria-label="Custom video player"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Player Shell */}
      <div
        className={`${styles.playerShell} ${
          state.theater ? styles.theater : ""
        }`}
      >
        {/* Video */}
        <div style={{ position: "relative", background: "#000" }}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            poster={poster}
            preload="metadata"
            playsInline
            // Prevent default browser controls and download
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplaybook"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            // Source managed via <source> elements
          >
            {/* {currentSource?.src ? (
              <source src={currentSource.src} type={currentSource.type || "video/mp4"} />
            ) : null} */}
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Center overlay (Play button when paused) */}
          {!state.playing && (
            <button
              type="button"
              aria-label={state.playing ? "Pause" : "Play"}
              onClick={actions.togglePlay}
              className={styles.centerPlayButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {state.playing ? (
                  <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>
          )}

          {/* Loading State */}
          {state.loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}

          {/* Top bar: Quality, Speed, Theater, Fullscreen */}
          <div
            className={`${styles.topControlsBar} ${
              hovering || !state.playing ? styles.visible : styles.hidden
            }`}
          >
            <div className={styles.topControlsLeft}>
              {/* Quality Selector */}
              <div>
                <label className={styles.srOnly} htmlFor="quality-select">
                  Quality
                </label>
                <select
                  id="quality-select"
                  value={state.quality}
                  onChange={(e) => actions.changeQuality(e.target.value)}
                  className={styles.controlSelect}
                  aria-label="Select quality"
                >
                  {qualities.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed Selector */}
              <div>
                <label className={styles.srOnly} htmlFor="speed-select">
                  Playback speed
                </label>
                <select
                  id="speed-select"
                  value={state.playbackRate}
                  onChange={(e) => actions.setSpeed(parseFloat(e.target.value))}
                  className={styles.controlSelect}
                  aria-label="Select playback speed"
                >
                  {[0.5, 1, 1.25, 1.5, 2].map((v) => (
                    <option key={v} value={v}>
                      {v}x
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.topControlsRight}>
              {/* Theater Mode */}
              <button
                type="button"
                onClick={actions.toggleTheater}
                className={styles.controlButton}
                aria-pressed={state.theater}
                aria-label="Toggle theater mode"
              >
                Theater
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={actions.toggleFullscreen}
                className={styles.controlButton}
                aria-pressed={state.fullscreen}
                aria-label="Toggle fullscreen"
              >
                Fullscreen
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div
            className={`${styles.bottomControls} ${
              hovering || !state.playing ? styles.visible : styles.hidden
            }`}
          >
            <div className={styles.controlsPanel}>
              {/* Seek bar */}
              <div className={styles.seekBarContainer}>
                <span className={styles.timeDisplay}>
                  {formatTime(state.currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={Math.max(1, state.duration)}
                  step={0.1}
                  value={state.currentTime}
                  onChange={(e) => actions.seekTo(parseFloat(e.target.value))}
                  aria-label="Seek video"
                  role="slider"
                  className={styles.seekBar}
                />
                <span className={styles.timeDisplay}>
                  {formatTime(state.duration)}
                </span>
              </div>

              {/* Buttons Row */}
              <div className={styles.bottomButtonRow}>
                <div className={styles.leftControls}>
                  {/* Play/Pause */}
                  <button
                    type="button"
                    onClick={actions.togglePlay}
                    className={styles.playButton}
                    aria-label={state.playing ? "Pause" : "Play"}
                  >
                    {state.playing ? "Pause" : "Play"}
                  </button>

                  {/* Mute */}
                  <button
                    type="button"
                    onClick={actions.toggleMute}
                    className={styles.secondaryButton}
                    aria-pressed={state.muted}
                    aria-label="Toggle mute"
                  >
                    {state.muted ? "Unmute" : "Mute"}
                  </button>

                  {/* Volume */}
                  <label className={styles.srOnly} htmlFor="volume-range">
                    Volume
                  </label>
                  <input
                    id="volume-range"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={state.muted ? 0 : state.volume}
                    onChange={(e) =>
                      actions.setVolume(parseFloat(e.target.value))
                    }
                    aria-label="Volume"
                    role="slider"
                    className={styles.volumeSlider}
                  />
                </div>

                <div className={styles.rightInfo}>
                  <span>{state.quality}</span>
                  <span>•</span>
                  <span>{state.playbackRate}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helper: Keyboard shortcuts hint (screen readers) */}
      <p className={styles.srOnly} aria-live="polite">
        Keyboard shortcuts: Space or K to play/pause. Arrow Left/Right to seek.
        Arrow Up/Down to change volume. M to mute. F for fullscreen. T for
        theater. , and . to change speed. 0-9 to seek.
      </p>
    </section>
  );
}
