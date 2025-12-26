import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../../../styles/pages/live-detail.module.css';

// Mock Data - In real app, fetch based on ID
const MOCK_STREAM_DETAILS = {
  id: 1,
  title: "Advanced React Patterns & Best Practices",
  description: "Dive deep into the world of Advanced React Patterns in this comprehensive masterclass. We will cover Compound Components, Render Props, Custom Hooks, and state reducers. By the end of this session, you will be able to write cleaner, more reusable React code that simplifies complex logic.",
  instructor: "Dr. Sarah Johnson",
  instructorTitle: "Senior Staff Engineer @ TechCorp",
  avatar: "👩‍🏫",
  date: "December 16, 2025",
  time: "2:00 PM - 3:30 PM EST",
  status: "live", // 'live' or 'upcoming'
  tags: ["Frontend", "React", "Architecture"],
  thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&fit=crop&q=80"
};

const LiveDetail = ({ theme }) => {
  const { id } = useParams();
  // Simulate data fetch based on ID
  const event = MOCK_STREAM_DETAILS; 
  
  const themeClass = theme ? "dark-theme" : "light-theme";

  return (
    <div className={`${styles.detailContainer} ${themeClass}`}>
      <div className={styles.contentWrapper}>
        
        {/* Main Content (Left) */}
        <div className={styles.mainContent}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.thumbnailWrapper}>
              <img src={event.thumbnail} alt={event.title} className={styles.thumbnail} />
              {event.status === 'live' ? (
                <div className={styles.statusBadge}>
                  <span className={styles.dot}>●</span> LIVE NOW
                </div>
              ) : (
                <div className={`${styles.statusBadge} ${styles.upcoming}`}>
                  UPCOMING
                </div>
              )}
            </div>
            
            <div className={styles.heroContent}>
              <div className={styles.metaTags}>
                {event.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <h1 className={styles.title}>{event.title}</h1>
            </div>
          </div>

          {/* Description & Instructor */}
          <div className={styles.descriptionCard}>
            <h2 className={styles.sectionTitle}>About This Session</h2>
            <p className={styles.descriptionText}>{event.description}</p>

            <h2 className={styles.sectionTitle}>Your Instructor</h2>
            <div className={styles.instructorCard}>
              <div className={styles.instructorAvatar}>
                {event.avatar}
              </div>
              <div className={styles.instructorInfo}>
                <h3>{event.instructor}</h3>
                <p className={styles.instructorTitle}>{event.instructorTitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className={styles.sidebar}>
          <div className={styles.actionCard}>
            <div className={styles.dateTimeInfo}>
              <div className={styles.date}>
                📅 {event.date}
              </div>
              <div className={styles.time}>
                ⏰ {event.time}
              </div>
            </div>

            {event.status === 'live' ? (
              <Link to="/live" className={styles.ctaButton} style={{ textDecoration: 'none', display: 'block' }}>
                Join Stream Now
              </Link>
            ) : (
              <button className={styles.ctaButton}>
                Register for Event
              </button>
            )}

            <button className={styles.secondaryBtn}>
              Add to Calendar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveDetail;
