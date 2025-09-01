import React, { useEffect, useRef } from "react";
import { useLocation, useMatch } from "react-router-dom";
// import style from "../../../styles/pages/problem.module.css";

const ForOutlet = React.memo(({ children, theme }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
});

export default ForOutlet;
