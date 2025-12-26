# 🎥 Live Stream Page - AxeCode Platform

## Overview
A comprehensive live streaming interface with video player and integrated live chat, following the Clean Brutalist design system.

## Features

### 📹 Video Player
- **16:9 Aspect Ratio** - Optimized for modern displays
- **Live Badge** - Pulsing "LIVE" indicator with animation
- **Viewer Count** - Real-time viewer statistics overlay
- **Video Controls** - Native HTML5 video controls
- **Click to Play/Pause** - Interactive video interaction
- **Placeholder Support** - Custom poster image

### 💬 Live Chat
- **Real-time messaging** - Instant message display
- **Instructor Badges** - Special highlighting for instructors
- **Auto-scroll** - Automatically scrolls to newest messages
- **Message Input** - Full-featured chat input
- **Enter to Send** - Keyboard shortcut support
- **Collapsible** - Toggle chat visibility
- **Message Count** - Display total message count

### 📊 Stream Information
- **Stream Title** - Prominent display of session name
- **Instructor Info** - Avatar and name
- **Category Tags** - Visual categorization
- **Live Stats** - Viewers, start time, duration
- **Description** - Detailed session information
- **Action Buttons** - Share and Save functionality

### 📚 Sidebar Resources
- **Resource Links** - Session notes, code examples, docs
- **Schedule** - Upcoming stream schedule
- **Additional Info** - Related content

## Design System Integration

### Layout
- **Flex Layout** - Video and chat in main column
- **Sidebar** - 320px fixed width (collapsible on mobile)
- **Responsive** - Full mobile/tablet support
- **Brutalist Style** - Bold borders, solid shadows

### Color Scheme
```css
Video Background: var(--text-primary)
Cards: var(--white)
Live Badge: var(--accent-red)
Tags: var(--card-blue) + var(--accent-blue)
Instructor Messages: var(--card-purple)
Borders: 3px solid var(--border-dark)
```

### Animations
- Live badge pulse (2s infinite)
- Live dot blink (1.5s infinite)
- Message slide-in (0.3s)
- Hover effects on resources

## File Structure
```
src/presentation/
├── pages/
│   └── livestream/
│       ├── routes/
│       │   └── LiveStream.jsx     # Main component
│       └── index.js               # Module export
└── styles/
    └── pages/
        └── livestream.module.css  # Styles
```

## Route
**Path**: `/live`

## Usage

### Navigate to Live Stream
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/live');
```

### Component Structure
```jsx
<LiveStream theme={theme} />
```

## Dummy Data

### Stream Info
```javascript
{
  title: 'Advanced React Patterns & Best Practices',
  instructor: 'Dr. Sarah Johnson',
  viewers: 1247,
  startTime: '2:00 PM',
  category: 'Web Development',
  tags: ['React', 'JavaScript', 'Frontend'],
  isLive: true,
  duration: '1:23:45'
}
```

### Chat Messages
- 5 initial messages
- Mix of regular users and instructor
- Instructor messages have special highlighting
- Auto-scrolling to bottom

## Responsive Breakpoints

### Desktop (> 1024px)
- Sidebar visible (320px)
- Full feature set
- Horizontal layout

### Tablet (768px - 1024px)
- Sidebar moves to bottom
- Horizontal card layout
- Reduced spacing

### Mobile (< 768px)
- Vertical stacking
- Sidebar cards stack vertically
- Reduced chat height (500px max)
- Smaller buttons and text

### Mobile Small (< 480px)
- Minimal padding
- Compact avatars
- Stacked chat input
- Full-width send button

## Component Sections

### 1. Video Section
```jsx
<section className={styles.videoSection}>
  <div className={styles.liveBadge}>🔴 LIVE</div>
  <div className={styles.videoPlayer}>
    <video controls />
    <div className={styles.videoOverlay}>
      <div className={styles.viewerCount}>
        👁️ 1,247 watching
      </div>
    </div>
  </div>
  <div className={styles.streamInfo}>
    {/* Stream metadata */}
  </div>
</section>
```

### 2. Chat Section
```jsx
<section className={styles.chatSection}>
  <div className={styles.chatHeader}>
    💬 Live Chat (5)
  </div>
  <div className={styles.chatMessages}>
    {/* Message list */}
  </div>
  <div className={styles.chatInput}>
    <input />
    <button>Send</button>
  </div>
</section>
```

### 3. Sidebar
```jsx
<aside className={styles.sidebar}>
  <div className={styles.sidebarCard}>
    📚 Stream Resources
  </div>
  <div className={styles.sidebarCard}>
    ⏰ Schedule
  </div>
</aside>
```

## Interactive Features

### Chat Functionality
- **Send Message** - Click send or press Enter
- **Auto-scroll** - Scrolls to bottom on new message
- **Toggle Chat** - Collapse/expand chat section
- **Message Validation** - Disabled send when empty

### Video Functionality
- **Play/Pause** - Click video to toggle
- **Native Controls** - Volume, fullscreen, timeline
- **Poster Image** - Displays before video loads

## Future Enhancements
- [ ] WebSocket real-time streaming
- [ ] Video quality selector
- [ ] Picture-in-Picture mode
- [ ] Chat reactions/emojis
- [ ] User mentions in chat
- [ ] Moderation tools
- [ ] Poll integration
- [ ] Q&A feature
- [ ] Screen sharing support
- [ ] Recording playback
- [ ] Timestamp-linked chat
- [ ] Multi-camera angles

## Accessibility
- Semantic HTML5 elements
- Keyboard navigation
- Focus states
- ARIA labels (to be added)
- High contrast borders

## Performance
- Lazy loading ready
- Optimized animations
- Efficient re-renders
- Scrollbar optimization

## CSS Modules Features
```css
✅ composes from design system
✅ CSS variables
✅ Keyframe animations
✅ Responsive media queries
✅ Custom scrollbars
✅ Hover transitions
```

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

**Built with ❤️ following AxeCode Design System**
