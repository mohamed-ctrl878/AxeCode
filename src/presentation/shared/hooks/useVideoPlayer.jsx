import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for video player state and actions
 * Manages all video player logic separately from the UI component
 */
export default function useVideoPlayer({
  videoRef,
  containerRef,
  sources,
  defaultQuality,
  initialVolume = 0.9,
  theaterDefault = false,
  autoPlay = false,
}) {
  // State
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState(defaultQuality || "");
  const [theater, setTheater] = useState(theaterDefault);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevTimeRef = useRef(currentTime);
  const seekTargetRef = useRef(null);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!seekTargetRef.current) {
        setCurrentTime(video.currentTime);
      }
    };

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };

    const handleRateChange = () => {
      setPlaybackRate(video.playbackRate);
    };

    const handleError = (e) => {
      setError(e.target.error?.message || "Video error occurred");
      setLoading(false);
    };

    // Add event listeners
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("error", handleError);

    // Cleanup
    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("ratechange", handleRateChange);
      video.removeEventListener("error", handleError);
    };
  }, [videoRef]);

  // Initialize video properties
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = muted;
    video.playbackRate = playbackRate;
  }, [videoRef, volume, muted, playbackRate]);

  // Auto play effect
  useEffect(() => {
    if (autoPlay && videoRef.current && duration > 0) {
      videoRef.current.play().catch(() => {
        // Auto play blocked - that's fine
      });
    }
  }, [autoPlay, duration, videoRef]);

  // Fullscreen handlers
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setFullscreen(isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Actions
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.warn("Play failed:", err);
        setError("Failed to play video");
      });
    }
  }, [playing, videoRef]);

  const seekTo = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedTime = Math.max(0, Math.min(time, duration));
    video.currentTime = clampedTime;
    setCurrentTime(clampedTime);
    
    // Track seeking to prevent time update conflicts
    seekTargetRef.current = clampedTime;
    setTimeout(() => {
      seekTargetRef.current = null;
    }, 200);
  }, [duration, videoRef]);

  const seekBy = useCallback((seconds) => {
    seekTo(currentTime + seconds);
  }, [currentTime, seekTo]);

  const seekToFraction = useCallback((fraction) => {
    seekTo(duration * Math.max(0, Math.min(1, fraction)));
  }, [duration, seekTo]);

  const setVolumeAction = useCallback((newVolume) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    video.volume = clampedVolume;
    
    // Unmute if setting volume above 0
    if (clampedVolume > 0 && muted) {
      video.muted = false;
    }
  }, [videoRef, muted]);

  const changeVolumeBy = useCallback((delta) => {
    setVolumeAction(volume + delta);
  }, [volume, setVolumeAction]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !muted;
  }, [muted, videoRef]);

  const setSpeed = useCallback((rate) => {
    const video = videoRef.current;
    if (!video) return;

    const validRates = [0.5, 1, 1.25, 1.5, 2];
    const clampedRate = validRates.includes(rate) ? rate : 1;
    video.playbackRate = clampedRate;
  }, [videoRef]);

  const cycleSpeed = useCallback((direction) => {
    const rates = [0.5, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    let nextIndex;
    
    if (direction > 0) {
      nextIndex = currentIndex < rates.length - 1 ? currentIndex + 1 : currentIndex;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    }
    
    setSpeed(rates[nextIndex]);
  }, [playbackRate, setSpeed]);

  const changeQuality = useCallback((newQuality) => {
    const video = videoRef.current;
    if (!video) return;

    const wasPlaying = playing;
    const currentTimeBeforeChange = video.currentTime;
    
    setQuality(newQuality);
    
    // Wait a bit for React to update the source element, then restore position
    setTimeout(() => {
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        video.currentTime = currentTimeBeforeChange;
        if (wasPlaying) {
          video.play().catch(() => {
            console.warn("Failed to resume playback after quality change");
          });
        }
      } else {
        // Wait for loadeddata event
        const handleLoadedData = () => {
          video.currentTime = currentTimeBeforeChange;
          if (wasPlaying) {
            video.play().catch(() => {
              console.warn("Failed to resume playback after quality change");
            });
          }
          video.removeEventListener("loadeddata", handleLoadedData);
        };
        video.addEventListener("loadeddata", handleLoadedData);
      }
    }, 100);
  }, [playing, videoRef]);

  const toggleTheater = useCallback(() => {
    setTheater((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (fullscreen) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        // Enter fullscreen
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen failed:", err);
    }
  }, [fullscreen, containerRef]);

  // Return state and actions
  return {
    state: {
      playing,
      currentTime,
      duration,
      volume,
      muted,
      playbackRate,
      quality,
      theater,
      fullscreen,
      loading,
      error,
    },
    actions: {
      togglePlay,
      seekTo,
      seekBy,
      seekToFraction,
      setVolume: setVolumeAction,
      changeVolumeBy,
      toggleMute,
      setSpeed,
      cycleSpeed,
      changeQuality,
      toggleTheater,
      toggleFullscreen,
    },
    formatTime,
  };
}