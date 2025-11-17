import React from 'react';
import VideoPlayer from '../shared/components/video/VideoPlayer';
import styles from './VideoPlayerDemo.module.css';

/**
 * Demo page showcasing the custom VideoPlayer component
 */
export default function VideoPlayerDemo() {
  // Example video sources with different qualities
  const videoSources = [
    {
      quality: '1080p',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4'
    },
    {
      quality: '720p',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'video/mp4'
    },
    {
      quality: '480p',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'video/mp4'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Custom Video Player Demo
          </h1>
          <p className={styles.subtitle}>
            A fully custom React video player with quality selector, theater mode, and accessibility features
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          
          {/* Video Player Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Video Player
            </h2>
            
            <VideoPlayer
              sources={videoSources}
              poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
              initialQuality="720p"
              initialVolume={0.7}
              theaterDefault={false}
              autoPlay={false}
              className={styles.videoPlayerSection}
            />
          </section>

          {/* Features Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Features
            </h2>
            
            <div className={styles.featuresGrid}>
              <FeatureCard
                icon="🎥"
                title="Quality Selector"
                description="Switch between different video qualities (1080p, 720p, 480p) without losing your position"
              />
              <FeatureCard
                icon="🎬"
                title="Theater Mode"
                description="Expand to a wider, cinema-style view for an immersive viewing experience"
              />
              <FeatureCard
                icon="⚡"
                title="Playback Speed"
                description="Control playback speed with options: 0.5x, 1x, 1.25x, 1.5x, 2x"
              />
              <FeatureCard
                icon="🚫"
                title="Download Protection"
                description="Prevents direct video downloads by disabling context menu and browser controls"
              />
              <FeatureCard
                icon="⌨️"
                title="Keyboard Shortcuts"
                description="Full keyboard navigation support for accessibility and power users"
              />
              <FeatureCard
                icon="📱"
                title="Responsive Design"
                description="Works seamlessly on desktop, tablet, and mobile devices"
              />
            </div>
          </section>

          {/* Keyboard Shortcuts Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Keyboard Shortcuts
            </h2>
            
            <div className={styles.shortcutsPanel}>
              <div className={styles.shortcutsGrid}>
                <ShortcutItem shortcut="Space / K" description="Play/Pause" />
                <ShortcutItem shortcut="← / →" description="Seek backward/forward 5s" />
                <ShortcutItem shortcut="↑ / ↓" description="Volume up/down" />
                <ShortcutItem shortcut="M" description="Toggle mute" />
                <ShortcutItem shortcut="F" description="Toggle fullscreen" />
                <ShortcutItem shortcut="T" description="Toggle theater mode" />
                <ShortcutItem shortcut=", / ." description="Decrease/increase speed" />
                <ShortcutItem shortcut="0-9" description="Seek to % of video" />
              </div>
            </div>
          </section>

          {/* Usage Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Usage Example
            </h2>
            
            <div className={styles.codePanel}>
              <pre className={styles.codeBlock}>
                <code className={styles.code}>
{`import VideoPlayer from './VideoPlayer';

const sources = [
  {
    quality: '1080p',
    src: '/video-1080p.mp4',
    type: 'video/mp4'
  },
  {
    quality: '720p',
    src: '/video-720p.mp4',
    type: 'video/mp4'
  }
];

<VideoPlayer
  sources={sources}
  poster="/poster.jpg"
  initialQuality="720p"
  initialVolume={0.8}
  theaterDefault={false}
  autoPlay={false}
/>`}
                </code>
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/**
 * Feature card component
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

/**
 * Keyboard shortcut item
 */
function ShortcutItem({ shortcut, description }) {
  return (
    <div className={styles.shortcutItem}>
      <kbd className={styles.shortcutKey}>
        {shortcut}
      </kbd>
      <span className={styles.shortcutDescription}>{description}</span>
    </div>
  );
}
