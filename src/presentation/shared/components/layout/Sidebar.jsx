import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChalkboardUser,
  faCode,
  faCalendarAlt,
  faVideo,
  faComments,
  faTimes,
  faCopy,
  faMoon,
  faSun,
  faUserCircle,
  faBroadcastTower,
  faBars,
  faNewspaper,
  faCog,
  faMap,
  faBookOpen,
  faUser,
  faChartLine,
  faBook,
  faEdit,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import style from '@presentation/styles/components/sidebar.module.css'; // Make sure this path is correct alias
import axe from "@presentation/assets/icons/axe.svg";
import cat from "@presentation/assets/images/cat.webp";

const Sidebar = ({ isOpen, onClose, onOpen, theme, toggleTheme, user }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const themeIcon = theme === 'light-theme' ? faMoon : faSun;

  const [isContentMenuOpen, setIsContentMenuOpen] = React.useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = React.useState(false);

  // Prevent scrolling when sidebar is open (Mobile only)
  React.useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleToggle = () => {
     if (isOpen) {
       onClose();
     } else {
       onOpen();
     }
  };

  // Auto-open Content Menu if active
  React.useEffect(() => {
      if (location.pathname.includes('/settings/content') || location.pathname.includes('/settings/manage-')) {
          setIsContentMenuOpen(true);
      }
  }, [location.pathname]);

  const isContentActive = isActive('/settings/content') || isActive('/settings/manage-');

  return (
    <>
      <div 
        className={`${style.sidebarOverlay} ${isOpen ? style.open : ''}`} 

      />
      
      <div className={`${style.sidebarContainer} ${isOpen ? style.open : ''}`}>
        
        {/* Edge Toggle Button (Mobile Only) */}
        <button 
          className={style.edgeToggleBtn}
          onClick={handleToggle}
          aria-label="Toggle Menu"
          title="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
        </button>

        {/* Header */}
        <div className={style.sidebarHeader}>
          {/* Logo (Visible when Open) */}
          <Link to="/" className={style.logo} >
            <img src={axe} alt="Axe Code" />
            <span>AXE CODE</span>
          </Link>

          {/* Desktop Toggle (Internal File Icon) */}
          <button 
             className={style.desktopToggleBtn}
             onClick={handleToggle}
             title={isOpen ? "Collapse" : "Expand"}
          >
             <FontAwesomeIcon icon={faCopy} />
          </button>

          {/* Mobile Close Button */}
          <button className={style.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Navigation */}
        <div className={style.navContent}>
          <ul className={style.navList}>
            <li className={style.navItem}>
              <Link 
                to="/" 
                className={`${style.navLink} ${location.pathname === '/' ? style.active : ''}`}
                // onClick={onClose}
              >
                <FontAwesomeIcon icon={faHome} className={style.icon} />
                <span>Home</span>
              </Link>
            </li>
            
            <li className={style.navItem}>
              <Link 
                to="/courses" 
                className={`${style.navLink} ${isActive('/courses') ? style.active : ''}`}
                // onClick={onClose}
              >
                <FontAwesomeIcon icon={faChalkboardUser} className={style.icon} />
                <span>Courses</span>
              </Link>
            </li>

            <li className={style.navItem}>
              <Link 
                to="/practice" 
                className={`${style.navLink} ${isActive('/practice') ? style.active : ''}`}
                // onClick={onClose}
              >
                <FontAwesomeIcon icon={faCode} className={style.icon} />
                <span>Practice</span>
              </Link>
            </li>

            <li className={style.navItem}>
              <Link 
                to="/roadmaps" 
                className={`${style.navLink} ${isActive('/roadmaps') ? style.active : ''}`}
                // onClick={onClose}
              >
                <FontAwesomeIcon icon={faMap} className={style.icon} />
                <span>Roadmaps</span>
              </Link>
            </li>

            <div className={style.divider} />
            <div className={style.sectionTitle}>Community & Events</div>

            <li className={style.navItem}>
              <Link 
                to="/events" 
                className={`${style.navLink} ${isActive('/events') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className={style.icon} />
                <span>Events</span>
              </Link>
            </li>

            {/* READ Section */}
            <div className={style.divider} />
            <div className={style.sectionTitle}>Read</div>

            <li className={style.navItem}>
              <Link 
                to="/documents" 
                className={`${style.navLink} ${isActive('/documents') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faBookOpen} className={style.icon} />
                <span>Documents & Articles</span>
              </Link>
            </li>

            <li className={style.navItem}>
              <Link 
                to="/roadmaps" 
                className={`${style.navLink} ${isActive('/roadmaps') ? style.active : ''}`}
                // onClick={onClose}
              >
                <FontAwesomeIcon icon={faMap} className={style.icon} />
                <span>Roadmaps</span>
              </Link>
            </li>

            {/* <li className={style.navItem}>
              <Link 
                to="/roadmaps" 
                className={`${style.navLink} ${isActive('/roadmaps') ? style.active : ''}`}
                // onClick={onClose}
              >
                <FontAwesomeIcon icon={faMap} className={style.icon} />
                <span>Roadmaps</span>
              </Link>
            </li> */}

            <li className={style.navItem}>
              <Link 
                to="/live/schedule" 
                className={`${style.navLink} ${isActive('/live') ? style.active : ''}`}
                // onClick={onClose}
              >
                <FontAwesomeIcon icon={faBroadcastTower} className={style.icon} />
                <span>Live Stream</span>
              </Link>
            </li>

            <li className={style.navItem}>
              <Link 
                to="/blogs" 
                className={`${style.navLink} ${isActive('/blogs') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faNewspaper} className={style.icon} />
                <span>Blogs</span>
              </Link>
            </li>

            {/* <li className={style.navItem}>
              <Link 
                to="/community" 
                className={`${style.navLink} ${isActive('/community') ? style.active : ''}`}
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faUsers} className={style.icon} />
                <span>Community</span>
              </Link>
            </li> */}
            

        {/* Chat Rooms Section */}
        <li className={style.navItem} onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}>
          <div className={`${style.navLink} ${isActive('/chat') ? style.active : ''}`} style={{cursor: 'pointer', justifyContent: 'space-between'}}>
             <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <FontAwesomeIcon icon={faComments} className={style.icon} />
               <span>Chat Rooms</span>
             </div>
             <FontAwesomeIcon icon={isChatMenuOpen ? faChevronUp : faChevronDown} style={{fontSize: '0.8rem'}} />
          </div>
        </li>

        <ul className={`${style.subMenu} ${isChatMenuOpen ? style.open : ''}`}>
           <li className={style.subItem}>
              <Link to="/chat/global-chat" className={style.subLink}>Global Chat</Link>
           </li>
           <li className={style.subItem}>
              <Link to="/chat/conv-1" className={style.subLink}>JS Masters</Link>
           </li>
           <li className={style.subItem}>
              <Link to="/chat/conv-2" className={style.subLink}>React Group</Link>
           </li>
        </ul>

        {/* MANAGEMENT Section */}
            <div className={style.divider} />
            <div className={style.sectionTitle}>Management</div>

            <li className={style.navItem}>
              <Link 
                to="/settings/profile" 
                className={`${style.navLink} ${isActive('/settings/profile') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faUser} className={style.icon} />
                <span>My Profile</span>
              </Link>
            </li>

            <li className={style.navItem}>
              <Link 
                to="/settings/dashboard" 
                className={`${style.navLink} ${isActive('/settings/dashboard') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faChartLine} className={style.icon} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li className={style.navItem}>
              <Link 
                to="/settings/courses" 
                className={`${style.navLink} ${isActive('/settings/courses') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faBook} className={style.icon} />
                <span>My Courses</span>
              </Link>
            </li>

            {(user?.role?.name === "instructor" || user?.role?.name === "publisher") && (
              <>
                <li className={style.navItem} onClick={() => setIsContentMenuOpen(!isContentMenuOpen)}>
                  <div className={`${style.navLink} ${isContentActive ? style.active : ''}`} style={{cursor: 'pointer', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <FontAwesomeIcon icon={faEdit} className={style.icon} />
                      <span>Content Management</span>
                    </div>
                    <FontAwesomeIcon icon={isContentMenuOpen ? faChevronUp : faChevronDown} style={{fontSize: '0.8rem'}} />
                  </div>
                </li>
                
                <ul className={`${style.subMenu} ${isContentMenuOpen ? style.open : ''}`}>
                   <li className={style.subItem}>
                      <Link to="/settings/manage-courses" className={style.subLink}>Manage Courses</Link>
                   </li>
                   {/* <li className={style.subItem}>
                      <Link to="/settings/manage-lessons" className={style.subLink}>Manage Lessons</Link>
                   </li> */}
                   <li className={style.subItem}>
                      <Link to="/settings/manage-problems" className={style.subLink}>Manage Problems</Link>
                   </li>
                   <li className={style.subItem}>
                      <Link to="/settings/manage-events" className={style.subLink}>Manage Events</Link>
                   </li>
                   <li className={style.subItem}>
                      <Link to="/settings/manage-live" className={style.subLink}>Manage Live Streams</Link>
                   </li>
                   {/* <li className={style.subItem}>
                      <Link to="/settings/manage-blogs" className={style.subLink}>Manage Blogs</Link>
                   </li> */}
                   <li className={style.subItem}>
                      <Link to="/settings/manage-articles" className={style.subLink}>Manage Articles</Link>
                   </li>
                    <li className={style.subItem}>
                      <Link to="/settings/manage-roadmaps" className={style.subLink}>Manage Roadmaps</Link>
                   </li>
                   {/* <li className={style.subItem}>
                      <Link to="/settings/manage-chat" className={style.subLink}>Manage Chat</Link>
                   </li> */}
                </ul>
              </>
            )}

            <li className={style.navItem}>
              <Link 
                to="/settings/preferences" 
                className={`${style.navLink} ${isActive('/settings/preferences') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faCog} className={style.icon} />
                <span>Settings</span>
              </Link>
            </li>

            {/* <li className={style.navItem}>
              <Link 
                to="/settings" 
                className={`${style.navLink} ${isActive('/settings') ? style.active : ''}`}
              >
                <FontAwesomeIcon icon={faCog} className={style.icon} />
                <span>Settings</span>
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Footer */}
        <div className={style.sidebarFooter}>
          <Link to={user ? "/settings" : "/login"} className={style.userProfile} >
             <img 
               src={user?.avatar?.url ? `http://localhost:1338${user.avatar.url}` : cat} 
               alt="User" 
               className={style.avatar} 
             />
             <div className={style.userInfo}>
               <span className={style.userName}>{user ? user.username : 'Guest'}</span>
               <span className={style.userRole}>{user ? (user.role?.name || 'User') : 'Login'}</span>
             </div>
          </Link>

          <button className={style.themeToggle} onClick={toggleTheme}>
            <FontAwesomeIcon icon={themeIcon} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
