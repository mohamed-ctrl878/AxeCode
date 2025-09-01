import React, { useRef } from "react";
import { useParams } from "react-router-dom";

const Layout = React.memo(({ children, theme, className }) => {
  const themeClass = theme ? "dark-theme" : "light-theme";

  return (
    <div className={`big-cont ${className} ${themeClass}`}>
      {/* <div className='background'></div> */}
      {children}
      <div className="lamb"></div>
    </div>
  );
});

export default Layout;
