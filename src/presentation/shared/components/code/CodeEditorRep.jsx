import React from "react";
import Loader from "../ui/loader/Loader";
// import style from "../../../styles/pages/problem.module.css";
const CodeEditorReplace = ({ className }) => {
  return (
    <div className={`${className} ${""}`}>
      <Loader></Loader>
    </div>
  );
};

export default CodeEditorReplace;
