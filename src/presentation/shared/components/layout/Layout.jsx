import React, { useRef } from "react";
import { useParams } from "react-router-dom";

const Layout = React.memo(({ children, theme, className }) => {
  const themeClass = theme ? "dark-theme" : "light-theme";

  return (
    <div className={`big-cont ${className} ${themeClass}`}>
       <style>{`
        /* Default: No shift */
        .big-cont {
          transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          /* padding-top: 70px; Removed as per user request */
        }
        
        /* Desktop: Shift based on Sidebar State */
        @media (min-width: 1024px) {
          body.sidebar-expanded .big-cont {
            padding-left: 300px;
          }
          body.sidebar-collapsed .big-cont {
            padding-left: 80px; /* Mini Sidebar Width */
          }
        }
      `}</style>
      {/* <div className='background'></div> */}
      {children}
      <div className="lamb"></div>
    </div>
  );
});

export default Layout;
