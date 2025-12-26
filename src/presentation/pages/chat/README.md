# 💬 Chat Page - AxeCode Platform

## Overview
A complete chat interface for AxeCode with conversations list and real-time messaging UI, following the Clean Brutalist design system.

## Features

### 🌍 Global Community Chat
- **Mandatory** conversation visible to all users
- Always appears at the top of conversations list
- Marked with "Required" badge
- 1200+ active community members

### 👥 Group Conversations
- Join optional group chats based on interests
- Topics include: JavaScript, React, Algorithms, Frontend, etc.
- Real-time participant count
- Online/offline indicators

### 💬 Messaging Interface
- Clean split-view layout (conversations list + messages)
- Message input with attach and emoji buttons
- Send messages with Enter key or Send button
- Own messages appear on the right (dark background)
- Others' messages appear on the left (white background)
- Timestamps for all messages
- Unread message badges

## Design System Integration

### Layout
- **Split View**: 380px sidebar + flexible message panel
- **Responsive**: Stacks vertically on mobile/tablet
- **Brutalist Style**: Sharp borders, solid shadows, clean typography

### Color Scheme
```css
Background: var(--main-bg-color)
Cards: var(--surface-card)
Borders: var(--border-dark) (3px solid)
Shadows: var(--shadow-solid) (3px 3px 0px black)
Active: var(--card-blue) with accent-blue border
```

### Components Used
- `btn-black` - Send button
- `btn-outline` - Action buttons
- `flex-between` - Header layout
- Custom scrollbars with design system colors

## File Structure
```
src/presentation/
├── pages/
│   └── chat/
│       ├── routes/
│       │   └── Chat.jsx          # Main component
│       └── index.js               # Module export
└── styles/
    └── pages/
        └── chat.module.css        # Styles
```

## Route
**Path**: `/chat`

## Usage

### Navigate to Chat
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/chat');
```

### Component Structure
```jsx
<Chat theme={theme} />
```

## Dummy Data

### Conversations
- Global Community Chat (mandatory, 1247 members)
- JavaScript Masters (42 members)
- React Study Group (28 members)
- Algorithm Practice (156 members)
- Frontend Developers (89 members)

### Messages
Sample messages with:
- Sender name and avatar
- Message content
- Timestamp
- Own/other differentiation

## Responsive Breakpoints

### Desktop (> 1024px)
- Sidebar: 380px fixed width
- Messages: Flexible width
- All features visible

### Tablet (768px - 1024px)
- Sidebar: 320px
- Reduced spacing
- Hidden action buttons

### Mobile (< 768px)
- Stacked vertical layout
- Sidebar: 40% height
- Messages: 60% height
- Minimal UI (no emoji button)

## Future Enhancements
- [ ] Real-time messaging with WebSocket
- [ ] File attachments
- [ ] Message reactions
- [ ] Search in conversations
- [ ] User @mentions
- [ ] Message editing/deletion
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Voice messages
- [ ] Video/audio calls integration

## Accessibility
- Keyboard navigation (Enter to send)
- Focus states on all interactive elements
- ARIA labels (to be added)
- High contrast borders for readability

## Performance
- Smooth animations (fadeInUp 0.3s)
- Optimized scrolling
- Lazy loading ready (for large message lists)

---

**Built with ❤️ following AxeCode Design System**
