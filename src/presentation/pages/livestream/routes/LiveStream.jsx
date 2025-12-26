import React, { useState, useRef, useEffect } from 'react';
import styles from '../../../styles/pages/livestream.module.css';

// Dummy Live Stream Data
const LIVE_STREAM_INFO = {
  title: 'Advanced React Patterns & Best Practices',
  instructor: 'Dr. Sarah Johnson',
  instructorAvatar: '👩‍🏫',
  viewers: 1247,
  startTime: '2:00 PM',
  category: 'Web Development',
  tags: ['React', 'JavaScript', 'Frontend'],
  description: 'Join us for an in-depth session on advanced React patterns, custom hooks, and performance optimization techniques.',
  isLive: true,
  duration: '1:23:45'
};

// Dummy Chat Messages
const INITIAL_MESSAGES = [
  {
    id: 1,
    username: 'CodeMaster',
    avatar: '👨‍💻',
    message: 'Excited for this session!',
    timestamp: '2:01 PM',
    isInstructor: false
  },
  {
    id: 2,
    username: 'Dr. Sarah Johnson',
    avatar: '👩‍🏫',
    message: 'Welcome everyone! We will start in 2 minutes.',
    timestamp: '2:02 PM',
    isInstructor: true
  },
  {
    id: 3,
    username: 'ReactFan99',
    avatar: '⚛️',
    message: 'Can\'t wait to learn about custom hooks!',
    timestamp: '2:03 PM',
    isInstructor: false
  },
  {
    id: 4,
    username: 'DevGuru',
    avatar: '🚀',
    message: 'Is this session being recorded?',
    timestamp: '2:04 PM',
    isInstructor: false
  },
  {
    id: 5,
    username: 'Dr. Sarah Johnson',
    avatar: '👩‍🏫',
    message: 'Yes! The recording will be available after the stream.',
    timestamp: '2:04 PM',
    isInstructor: true
  }
];

const LiveStream = ({ theme }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      username: 'You',
      avatar: '😊',
      message: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      isInstructor: false
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={styles.liveStreamContainer}>
      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Video Section */}
        <section className={styles.videoSection}>
          {/* Live Badge */}
          {LIVE_STREAM_INFO.isLive && (
            <div className={styles.liveBadge}>
              <span className={styles.liveDot}></span>
              LIVE
            </div>
          )}

          {/* Video Player */}
          <div className={styles.videoPlayer}>
            <video
              ref={videoRef}
              className={styles.video}
              poster="https://via.placeholder.com/1280x720/141413/f0eee6?text=Live+Stream"
              controls
              onClick={togglePlayPause}
            >
              <source src="" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Video Overlay Info */}
            <div className={styles.videoOverlay}>
              <div className={styles.viewerCount}>
                <span className={styles.viewerIcon}>👁️</span>
                <span>{LIVE_STREAM_INFO.viewers.toLocaleString()} watching</span>
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className={styles.streamInfo}>
            <div className={styles.streamHeader}>
              <div className={styles.instructorInfo}>
                <div className={styles.instructorAvatar}>
                  {LIVE_STREAM_INFO.instructorAvatar}
                </div>
                <div className={styles.instructorDetails}>
                  <h1 className={styles.streamTitle}>{LIVE_STREAM_INFO.title}</h1>
                  <p className={styles.instructorName}>{LIVE_STREAM_INFO.instructor}</p>
                </div>
              </div>

              <div className={styles.streamActions}>
                <button className={styles.actionBtn} title="Share">
                  🔗 Share
                </button>
                <button className={styles.actionBtn} title="Save">
                  💾 Save
                </button>
              </div>
            </div>

            <div className={styles.streamMeta}>
              <div className={styles.metaTags}>
                {LIVE_STREAM_INFO.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.streamStats}>
                <span className={styles.stat}>
                  <strong>Category:</strong> {LIVE_STREAM_INFO.category}
                </span>
                <span className={styles.stat}>
                  <strong>Started:</strong> {LIVE_STREAM_INFO.startTime}
                </span>
                <span className={styles.stat}>
                  <strong>Duration:</strong> {LIVE_STREAM_INFO.duration}
                </span>
              </div>
            </div>

            <p className={styles.streamDescription}>{LIVE_STREAM_INFO.description}</p>
          </div>
        </section>

        {/* Live Chat Section */}
        <section className={styles.chatSection}>
          <div className={styles.chatHeader}>
            <h2 className={styles.chatTitle}>
              💬 Live Chat
              <span className={styles.chatCount}>({messages.length})</span>
            </h2>
            <button 
              className={styles.toggleChatBtn}
              onClick={() => setIsChatVisible(!isChatVisible)}
            >
              {isChatVisible ? '▼' : '▲'}
            </button>
          </div>

          {isChatVisible && (
            <>
              {/* Messages Area */}
              <div className={styles.chatMessages}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.chatMessage} ${
                      msg.isInstructor ? styles.instructorMessage : ''
                    }`}
                  >
                    <div className={styles.messageAvatar}>{msg.avatar}</div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageHeader}>
                        <span className={styles.messageUsername}>
                          {msg.username}
                          {msg.isInstructor && (
                            <span className={styles.instructorBadge}>Instructor</span>
                          )}
                        </span>
                        <span className={styles.messageTime}>{msg.timestamp}</span>
                      </div>
                      <p className={styles.messageText}>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className={styles.chatInput}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className={styles.messageInputField}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className={styles.sendMessageBtn}
                  onClick={handleSendMessage}
                  disabled={messageInput.trim() === ''}
                >
                  Send ➤
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Sidebar (Optional - for related streams or info) */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>📚 Stream Resources</h3>
          <ul className={styles.resourcesList}>
            <li>📄 Session Notes</li>
            <li>💻 Code Examples</li>
            <li>📖 Documentation</li>
            <li>🔗 Useful Links</li>
          </ul>
        </div>

        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>⏰ Schedule</h3>
          <div className={styles.scheduleInfo}>
            <p><strong>Today:</strong> Advanced React Patterns</p>
            <p><strong>Tomorrow:</strong> Testing Best Practices</p>
            <p><strong>Wed:</strong> State Management Deep Dive</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LiveStream;
