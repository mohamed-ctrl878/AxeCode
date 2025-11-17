import React from "react";
import style from "@presentation/styles/pages/tech-events.module.css";

const TechEvent = ({ theme }) => {
  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  // Mock event data - replace with actual API call
  const eventData = {
    id: 1,
    title: "React & Modern Web Development Summit 2024",
    subtitle: "Join leading developers and industry experts for a full day of React insights, best practices, and the future of web development",
    description: "This comprehensive tech summit brings together React developers, full-stack engineers, and technology leaders to explore the latest trends, tools, and techniques in modern web development. Experience cutting-edge presentations, hands-on workshops, and networking opportunities with the React community.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    date: "January 15, 2025",
    time: "9:00 AM - 6:00 PM PST",
    location: "San Francisco Convention Center",
    format: "Hybrid Event",
    price: "Free",
    attendees: 1250,
    isLive: false,
    registrationDeadline: "January 10, 2025",
    speakers: [
      {
        id: 1,
        name: "Sarah Chen",
        title: "Senior React Developer at Meta",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b4f5a8b5?w=150&h=150&fit=crop&crop=face",
        topic: "React 18 Features & Performance"
      },
      {
        id: 2,
        name: "Michael Rodriguez",
        title: "Lead Engineer at Vercel",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        topic: "Next.js 14 & Server Components"
      },
      {
        id: 3,
        name: "Emily Zhang",
        title: "Tech Lead at Airbnb",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        topic: "State Management Evolution"
      },
      {
        id: 4,
        name: "David Kumar",
        title: "Frontend Architect at Stripe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        topic: "Micro-frontends at Scale"
      }
    ],
    agenda: [
      {
        time: "9:00",
        period: "AM",
        title: "Welcome & Registration",
        description: "Check-in, networking breakfast, and welcome remarks from the organizing team"
      },
      {
        time: "9:30",
        period: "AM",
        title: "Opening Keynote: The Future of React",
        description: "Sarah Chen explores upcoming React features, performance improvements, and the roadmap ahead"
      },
      {
        time: "10:30",
        period: "AM",
        title: "Next.js 14 Deep Dive",
        description: "Michael Rodriguez demonstrates server components, app directory, and advanced Next.js patterns"
      },
      {
        time: "11:30",
        period: "AM",
        title: "Coffee Break & Networking",
        description: "Connect with fellow developers, grab refreshments, and visit sponsor booths"
      },
      {
        time: "12:00",
        period: "PM",
        title: "Modern State Management Panel",
        description: "Emily Zhang leads a discussion on Redux Toolkit, Zustand, and emerging state solutions"
      },
      {
        time: "1:00",
        period: "PM",
        title: "Lunch & Community Tables",
        description: "Networking lunch with themed tables for different experience levels and interests"
      },
      {
        time: "2:30",
        period: "PM",
        title: "Micro-frontends Workshop",
        description: "Hands-on workshop with David Kumar on building and deploying micro-frontend architectures"
      },
      {
        time: "4:00",
        period: "PM",
        title: "Lightning Talks",
        description: "Community-driven 5-minute talks on various React topics and personal projects"
      },
      {
        time: "5:00",
        period: "PM",
        title: "Closing Remarks & Networking",
        description: "Final thoughts, resource sharing, and continued networking opportunities"
      }
    ],
    relatedEvents: [
      {
        id: 2,
        title: "JavaScript Testing Masterclass",
        date: "Jan 22, 2025",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=80&fit=crop"
      },
      {
        id: 3,
        title: "Vue.js 3 Workshop Series",
        date: "Feb 5, 2025",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=120&h=80&fit=crop"
      },
      {
        id: 4,
        title: "Full-Stack Development Bootcamp",
        date: "Feb 18, 2025",
        image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=120&h=80&fit=crop"
      }
    ]
  };

  const handleRegister = () => {
    // This would typically connect to a registration API
    alert("Registration functionality would be implemented here!");
  };

  const handleJoinOnline = () => {
    // This would typically open a live stream or video conference
    alert("Online joining functionality would be implemented here!");
  };

  const handleShare = () => {
    // This would typically open share options
    if (navigator.share) {
      navigator.share({
        title: eventData.title,
        text: eventData.subtitle,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  return (
    <div className={`${style.techEventsContainer} ${themeClass}`}>
      {/* Header Section */}
      <div className={style.eventsHeader}>
        <div className={style.headerContent}>
          <h1 className={style.eventsTitle}>Tech Events</h1>
          <p className={style.eventsSubtitle}>
            Connect, learn, and grow with the developer community
          </p>
        </div>
      </div>

      {/* Event Detail Section */}
      <div className={style.eventDetail}>
        <div className={style.mainContent}>
          {/* Event Hero */}
          <div className={style.eventHero}>
            <img src={eventData.image} alt={eventData.title} className={style.eventImage} />
            <div className={style.eventHeroContent}>
              <div className={style.eventBadge}>
                {eventData.isLive ? (
                  <span className={style.liveBadge}>🔴 Live Event</span>
                ) : (
                  <span>📅 Upcoming Event</span>
                )}
              </div>
              
              <h1 className={style.eventTitle}>{eventData.title}</h1>
              
              <div className={style.eventMeta}>
                <div className={style.metaItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className={style.metaValue}>{eventData.date}</span>
                </div>
                
                <div className={style.metaItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span className={style.metaValue}>{eventData.time}</span>
                </div>
                
                <div className={style.metaItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className={style.metaValue}>{eventData.location}</span>
                </div>
                
                <div className={style.metaItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m23 21-2-2-2 2"></path>
                  </svg>
                  <span className={style.metaValue}>{eventData.attendees.toLocaleString()} registered</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Event */}
          <div className={style.sectionCard}>
            <h2 className={style.sectionTitle}>About This Event</h2>
            <p className={style.description}>{eventData.description}</p>
          </div>

          {/* Speakers */}
          <div className={style.sectionCard}>
            <h2 className={style.sectionTitle}>Featured Speakers</h2>
            <div className={style.speakersList}>
              {eventData.speakers.map((speaker) => (
                <div key={speaker.id} className={style.speakerCard}>
                  <img 
                    src={speaker.avatar} 
                    alt={speaker.name}
                    className={style.speakerAvatar}
                  />
                  <h3 className={style.speakerName}>{speaker.name}</h3>
                  <p className={style.speakerTitle}>{speaker.title}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {speaker.topic}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Event Agenda */}
          <div className={style.sectionCard}>
            <h2 className={style.sectionTitle}>Event Schedule</h2>
            <div className={style.agendaList}>
              {eventData.agenda.map((item, index) => (
                <div key={index} className={style.agendaItem}>
                  <div className={style.agendaTime}>
                    <span style={{ fontSize: '1.1rem' }}>{item.time}</span>
                    <span style={{ fontSize: '0.7rem' }}>{item.period}</span>
                  </div>
                  <div className={style.agendaContent}>
                    <h3 className={style.agendaTitle}>{item.title}</h3>
                    <p className={style.agendaDescription}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={style.sidebar}>
          {/* Event Actions Card */}
          <div className={style.eventCard}>
            <div className={style.eventActions}>
              <button className={style.registerButton} onClick={handleRegister}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Register for Event
              </button>
              
              {eventData.isLive && (
                <button className={style.joinButton} onClick={handleJoinOnline}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  Join Live Stream
                </button>
              )}
              
              <button className={style.shareButton} onClick={handleShare}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share Event
              </button>
            </div>

            <div className={style.eventInfo}>
              <div className={style.infoList}>
                <div className={style.infoItem}>
                  <svg className={style.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  <span className={style.infoValue}>Duration: 9 hours</span>
                </div>
                
                <div className={style.infoItem}>
                  <svg className={style.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                  <span className={style.infoValue}>{eventData.format}</span>
                </div>
                
                <div className={style.infoItem}>
                  <svg className={style.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <span className={style.infoValue}>Price: {eventData.price}</span>
                </div>
                
                <div className={style.infoItem}>
                  <svg className={style.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className={style.infoValue}>Language: English</span>
                </div>
                
                <div className={style.infoItem}>
                  <svg className={style.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  </svg>
                  <span className={style.infoValue}>Certificate Included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Events */}
          <div className={style.relatedEvents}>
            <h3 className={style.sectionTitle}>Related Events</h3>
            <div className={style.relatedEventsList}>
              {eventData.relatedEvents.map((event) => (
                <div key={event.id} className={style.relatedEventItem}>
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className={style.relatedEventImage}
                  />
                  <div className={style.relatedEventContent}>
                    <h4 className={style.relatedEventTitle}>{event.title}</h4>
                    <p className={style.relatedEventDate}>{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechEvent;