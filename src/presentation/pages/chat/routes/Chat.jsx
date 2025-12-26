import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../styles/pages/chat.module.css';

// Dummy Data
const DUMMY_CONVERSATIONS = [
  {
    id: 'global-chat',
    name: 'Global Community Chat',
    type: 'global',
    mandatory: true,
    participants: 1247,
    lastMessage: 'Welcome to AxeCode community!',
    lastMessageTime: '2 min ago',
    unreadCount: 5,
    avatar: '🌍',
    isOnline: true
  },
  {
    id: 'conv-1',
    name: 'JavaScript Masters',
    type: 'group',
    mandatory: false,
    participants: 42,
    lastMessage: 'Check out this new ES2024 feature!',
    lastMessageTime: '10 min ago',
    unreadCount: 2,
    avatar: '⚡',
    isOnline: true
  },
  {
    id: 'conv-2',
    name: 'React Study Group',
    type: 'group',
    mandatory: false,
    participants: 28,
    lastMessage: 'Anyone working with Next.js 14?',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    avatar: '⚛️',
    isOnline: true
  },
  {
    id: 'conv-3',
    name: 'Algorithm Practice',
    type: 'group',
    mandatory: false,
    participants: 156,
    lastMessage: 'Solved the binary tree problem!',
    lastMessageTime: '3 hours ago',
    unreadCount: 0,
    avatar: '🧮',
    isOnline: false
  },
  {
    id: 'conv-4',
    name: 'Frontend Developers',
    type: 'group',
    mandatory: false,
    participants: 89,
    lastMessage: 'New CSS features are amazing',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    avatar: '🎨',
    isOnline: true
  }
];

const DUMMY_MESSAGES = {
  'global-chat': [
    {
      id: 1,
      sender: 'Admin',
      avatar: '👨‍💼',
      message: 'Welcome everyone to the AxeCode Global Community Chat! Feel free to ask questions and help each other.',
      timestamp: '10:30 AM',
      isOwn: false,
      type: 'text'
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      avatar: '👩‍💻',
      message: 'Thank you! Excited to be here and learn from everyone.',
      timestamp: '10:32 AM',
      isOwn: false,
      type: 'text'
    },
    {
      id: 3,
      sender: 'You',
      avatar: '😊',
      message: 'Hi everyone! Looking forward to collaborating with you all.',
      timestamp: '10:35 AM',
      isOwn: true,
      type: 'text'
    },
    {
      id: 4,
      sender: 'Mike Chen',
      avatar: '👨‍🎓',
      message: 'Does anyone have resources for advanced algorithms?',
      timestamp: '10:40 AM',
      isOwn: false,
      type: 'text'
    },
    {
      id: 5,
      sender: 'You',
      avatar: '😊',
      message: 'I have some great resources! Check out the Algorithm Practice group.',
      timestamp: '10:42 AM',
      isOwn: true,
      type: 'text'
    },
    {
      id: 6,
      sender: 'Emma Wilson',
      avatar: '👩‍🔬',
      message: 'Just finished my first project here! Thanks for all the support 🎉',
      timestamp: '10:45 AM',
      isOwn: false,
      type: 'text'
    }
  ],
  'conv-1': [
    {
      id: 1,
      sender: 'Alex Martinez',
      avatar: '👨‍💻',
      message: 'Check out this new ES2024 feature! The "groupBy" method is finally here.',
      timestamp: '9:20 AM',
      isOwn: false,
      type: 'text'
    },
    {
      id: 2,
      sender: 'You',
      avatar: '😊',
      message: 'That\'s awesome! I\'ve been waiting for this.',
      timestamp: '9:25 AM',
      isOwn: true,
      type: 'text'
    }
  ],
  'conv-2': [
    {
      id: 1,
      sender: 'John Doe',
      avatar: '👨‍🎓',
      message: 'Anyone working with Next.js 14?',
      timestamp: '8:00 AM',
      isOwn: false,
      type: 'text'
    }
  ]
};

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  // Find conversation by ID or default to first
  const initialConv = DUMMY_CONVERSATIONS.find(c => c.id === chatId) || DUMMY_CONVERSATIONS[0];
  
  const [selectedConversation, setSelectedConversation] = useState(initialConv);
  const [messageInput, setMessageInput] = useState('');
  // Initialize messages based on the simplified ID lookup or default
  const [messages, setMessages] = useState(DUMMY_MESSAGES[initialConv.id] || []);

  // Effect to update if URL changes
  React.useEffect(() => {
    if (chatId) {
       const conv = DUMMY_CONVERSATIONS.find(c => c.id === chatId);
       if (conv) {
         setSelectedConversation(conv);
         setMessages(DUMMY_MESSAGES[conv.id] || []);
       } else {
         // If chatId is invalid, navigate to the first conversation
         navigate(`/chat/${DUMMY_CONVERSATIONS[0].id}`);
       }
    } else {
      // If no chatId in URL, navigate to the first conversation
      navigate(`/chat/${DUMMY_CONVERSATIONS[0].id}`);
    }
  }, [chatId, navigate]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      avatar: '😊',
      message: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      type: 'text'
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

  return (
    <div className={styles.chatContainer}>
      {/* Right Panel - Messages - Now Full Width */}
      <main className={styles.messagesPanel}>
        {/* Chat Header */}
        <header className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.chatAvatar}>
              <span className={styles.avatarIcon}>{selectedConversation.avatar}</span>
              {selectedConversation.isOnline && <div className={styles.onlineIndicator}></div>}
            </div>
            <div className={styles.chatHeaderInfo}>
              <h2 className={styles.chatTitle}>{selectedConversation.name}</h2>
              <p className={styles.chatSubtitle}>
                {selectedConversation.participants} members
                {selectedConversation.isOnline && ' · Active now'}
              </p>
            </div>
          </div>

          <div className={styles.chatHeaderActions}>
            <button className={styles.headerActionBtn} title="Call">
              📞
            </button>
            <button className={styles.headerActionBtn} title="Video Call">
              📹
            </button>
            <button className={styles.headerActionBtn} title="Info">
              ℹ️
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className={styles.messagesArea}>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${
                  message.isOwn ? styles.ownMessage : styles.otherMessage
                }`}
              >
                {!message.isOwn && (
                  <div className={styles.messageAvatar}>
                    <span>{message.avatar}</span>
                  </div>
                )}

                <div className={styles.messageContent}>
                  {!message.isOwn && (
                    <span className={styles.messageSender}>{message.sender}</span>
                  )}
                  <div className={styles.messageBubble}>
                    <p className={styles.messageText}>{message.message}</p>
                  </div>
                  <span className={styles.messageTime}>{message.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input Area */}
        <footer className={styles.messageInputArea}>
          <button className={styles.attachmentBtn} title="Attach file">
            📎
          </button>

          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type a message..."
              className={styles.messageInput}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <button className={styles.emojiBtn} title="Add emoji">
            😊
          </button>

          <button
            className={styles.sendBtn}
            onClick={handleSendMessage}
            disabled={messageInput.trim() === ''}
          >
            <span>Send</span>
            <span className={styles.sendIcon}>➤</span>
          </button>
        </footer>
      </main>
    </div>
  );
};

export default Chat;
