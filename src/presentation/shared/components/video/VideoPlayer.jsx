import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';

// A reusable VideoPlayer component using Video.js
export default function VideoPlayer({ src, type = 'video/mp4' }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Initialize Video.js player
      playerRef.current = videojs(videoRef.current, {
      
        controls: true,
        responsive: true,
        fluid: true,
        techOrder: ['html5'], // force HTML5 tech
        controlBar: {
          playToggle: true,
          currentTimeDisplay: true,
          timeDivider: true,
          durationDisplay: true,
          progressControl: true,
          fullscreenToggle: true,
        },
        sources: [{ src, type }],
      });

      // CSS overrides for mobile responsiveness
      const playerEl = playerRef.current.el();
      // // Ensure control bar always flex-wrap
      // playerEl.querySelector('.vjs-control-bar').style.flexWrap = 'wrap';
      // // Ensure time displays show on small screens
      playerEl.querySelector('.vjs-current-time').style.display = 'block';
      // playerEl.querySelector('.vjs-duration-display').style.display = 'block';
      // // Style volume panel vertical slider for small screens
      // const volPanel = playerEl.querySelector('.vjs-volume-panel');
      // if (volPanel) {
      //   volPanel.style.display = 'flex';
      //   volPanel.style.flexDirection = 'column';
      //   volPanel.style.alignItems = 'center';
      // }
      // const volControl = playerEl.querySelector('.vjs-volume-control');
      // if (volControl) {
      //   volControl.classList.add('vjs-volume-vertical');
      // }
    }

    return () => {
      // Dispose on unmount
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src({ src, type });
      playerRef.current.load();
      playerRef.current.play().catch(() => {});
    }
  }, [src, type]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered"
        playsInline
      />
    </div>
  );
}
