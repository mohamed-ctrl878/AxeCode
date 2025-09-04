import React, { useEffect, useRef } from "react";
// import ScrollReveal from "./ScrollReveal";
import { current } from "@reduxjs/toolkit";
import ScrollReveal from "@presentation/shared/components/layout/ScrollReveal";
// import { ScrollReveal } from "@/presentation/shared/components";

const PinedPosts = ({ theme, mood, style }) => {
  // console.log(theme);
  // console.log(mood);
  const ref = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 50;
      const y = (clientY - window.innerHeight / 2) / 50;
      if (ref.current) {
        ref.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ref]);
  return (
    <div className={`${style.pinnedPostsContainer} ${mood}`}>
      <ScrollReveal style={style}>
        <h2 className={style.pinnedPostsTitle}>New Posts</h2>
      </ScrollReveal>
      <div className={style.pinnedPostsGrid}>
        <ScrollReveal style={style}>
          <div ref={ref} className={`${style.pinnedPostCard} ${mood}`}>
            <h3>Master React Hooks</h3>
            <p>
              Practice using `useState`, `useEffect`, and custom hooks in
              real-world...
            </p>
            <a href="#" className={style.goToPracticeButton}>
              Go to Practice
            </a>
            <div></div>
          </div>
        </ScrollReveal>
        <ScrollReveal style={style}>
          <div className={`${style.pinnedPostCard} ${mood}`}>
            <h3>Advanced CSS Grid...</h3>
            <p>
              Take your layout skills to the next level with these tricky
              grid...
            </p>
            <a href="#" className={style.goToPracticeButton}>
              Go to Practice
            </a>
          </div>
        </ScrollReveal>
        <ScrollReveal style={style}>
          <div className={`${style.pinnedPostCard} ${mood}`}>
            <h3>TypeScript...</h3>
            <p>Learn type safety through hands-on problems and practical...</p>
            <a href="#" className={style.goToPracticeButton}>
              Go to Practice
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PinedPosts;
