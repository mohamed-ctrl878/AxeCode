import React from "react";
import { useSelector } from "react-redux";
// import { themeSlice } from "@store/themeSlice";

const ThemeTest = ({ children }) => {
  const  isDark  = useSelector(state=>state.themeSlice.theme);
  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="dark:bg-gray-900">{children}</div>
    </div>
  );
};

export default ThemeTest;
