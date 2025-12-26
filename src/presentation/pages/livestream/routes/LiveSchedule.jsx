import React from 'react';
import styles from '../../../styles/pages/live-schedule.module.css';

const SCHEDULE_DATA = [
  {
    day: "Today",
    date: "Dec 16",
    streams: [
      {
        id: 1,
        title: "Advanced React Patterns & Best Practices",
        time: "2:00 PM",
        duration: "90 min",
        instructor: "Dr. Sarah Johnson",
        avatar: "👩‍🏫",
        category: "Frontend",
        description: "Join us for an in-depth session on advanced React patterns, custom hooks, and performance optimization techniques.",
        isLive: true
      },
      {
        id: 2,
        title: "System Design Interview Prep",
        time: "5:00 PM",
        duration: "120 min",
        instructor: "Alex Chen",
        avatar: "👨‍💻",
        category: "Backend",
        description: "Deep dive into scalable system architecture. We'll design a real-time chat application from scratch.",
        isLive: false
      }
    ]
  },
  {
    day: "Tomorrow",
    date: "Dec 17",
    streams: [
      {
        id: 3,
        title: "CSS CSS CSS: Brutalism & Beyond",
        time: "11:00 AM",
        duration: "60 min",
        instructor: "Maria Garcia",
        avatar: "🎨",
        category: "Design",
        description: "Exploring the brutalist web design trend. How to implement hard shadows, bold typography and raw layouts.",
        isLive: false
      },
      {
        id: 4,
        title: "Intro to Rust Programming",
        time: "3:00 PM",
        duration: "90 min",
        instructor: "David Miller",
        avatar: "🦀",
        category: "Systems",
        description: "Getting started with Rust. Memory safety, ownership model, and basic syntax for beginners.",
        isLive: false
      }
    ]
  },
  {
    day: "Wednesday",
    date: "Dec 18",
    streams: [
      {
        id: 5,
        title: "GraphQL vs REST API APIs",
        time: "1:00 PM",
        duration: "60 min",
        instructor: "James Wilson",
        avatar: "🔌",
        category: "API",
        description: "A comparative analysis of GraphQL and REST. When to use which? Pros, cons, and performance benchmarks.",
        isLive: false
      }
    ]
  }
];

const LiveSchedule = ({ theme }) => {
  const themeClass = theme ? "dark-theme" : "light-theme";

  return (
    <div className={`${styles.scheduleContainer} ${themeClass}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Live Schedule</h1>
        <p className={styles.subtitle}>Upcoming streams, workshops, and coding sessions</p>
      </div>

      <div className={styles.scheduleContent}>
        {SCHEDULE_DATA.map((dayGroup, index) => (
          <div key={index} className={styles.dayGroup}>
            <div className={styles.dayHeader}>
              <h2 className={styles.dayTitle}>{dayGroup.day}</h2>
              <span className={styles.dateBadge}>{dayGroup.date}</span>
            </div>

            <div className={styles.streamList}>
              {dayGroup.streams.map((stream) => (
                <div 
                  key={stream.id} 
                  className={`${styles.streamCard} ${stream.isLive ? styles.liveNow : ''}`}
                >
                  <div className={styles.streamTimeBox}>
                    {stream.isLive && <span className={styles.liveTag}>LIVE NOW</span>}
                    <span className={styles.time}>{stream.time}</span>
                    <span className={styles.duration}>{stream.duration}</span>
                  </div>
                  
                  <div className={styles.streamInfo}>
                    <div className={styles.streamHeader}>
                      <h3 className={styles.streamTitle}>{stream.title}</h3>
                      <span className={styles.categoryBadge}>{stream.category}</span>
                    </div>
                    
                    <div className={styles.instructor}>
                      <span className={styles.instructorAvatar}>{stream.avatar}</span>
                      <span>{stream.instructor}</span>
                    </div>
                    
                    <p className={styles.description}>{stream.description}</p>
                    
                    <div className={styles.actions}>
                      {stream.isLive ? (
                         <button className={`${styles.actionBtn} ${styles.remindBtn}`} style={{background: 'var(--card-red)', color: 'white', borderColor: 'black'}}>
                           Join Stream
                         </button>
                      ) : (
                        <button className={`${styles.actionBtn} ${styles.remindBtn}`}>
                          Notify Me
                        </button>
                      )}
                      <button className={styles.detailsBtn}>View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSchedule;
