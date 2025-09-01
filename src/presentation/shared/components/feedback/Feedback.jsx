import React from "react";
import ScrollReveal from "../layout/ScrollReveal";
// import ScrollReveal from "./ScrollReveal";

const Feedback = ({ mood, style }) => {
  return (
    <div className={`${style.developerFeedbackContainer} ${mood}`}>
      <ScrollReveal style={style}>
        <h2 className={style.developerFeedbackTitle}>Developer Feedback</h2>
      </ScrollReveal>
      <div className={style.feedbackGrid}>
        <ScrollReveal style={style}>
          <div className={`${style.feedbackCard} ${mood}`}>
            <div className={style.feedbackHeader}>
              <div className={style.avatar}>A</div>
              <div className={style.userInfo}>
                <p className={style.userName}>Alex Johnson</p>
                <p className={style.userTitle}>Senior Front-End Engineer</p>
              </div>
              <p className={style.feedbackDate}>May 1, 2025</p>
            </div>
            <p className={style.feedbackText}>
              "The React hooks practice modules really helped me understand the
              concept of custom hooks and how to implement them properly."
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal style={style}>
          <div className={`${style.feedbackCard} ${mood}`}>
            <div className={style.feedbackHeader}>
              <div className={style.avatar}>S</div>
              <div className={style.userInfo}>
                <p className={style.userName}>Sarah Williams</p>
                <p className={style.userTitle}>Full Stack Developer</p>
              </div>
              <p className={style.feedbackDate}>Apr 28, 2025</p>
            </div>
            <p className={style.feedbackText}>
              "The TypeScript challenges are excellent. They helped me grasp
              complex types and improved my day-to-day coding at work."
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal style={style}>
          <div className={`${style.feedbackCard} ${mood}`}>
            <div className={style.feedbackHeader}>
              <div className={style.avatar}>M</div>
              <div className={style.userInfo}>
                <p className={style.userName}>Michael Chen</p>
                <p className={style.userTitle}>Lead Software Engineer</p>
              </div>
              <p className={style.feedbackDate}>Apr 25, 2025</p>
            </div>
            <p className={style.feedbackText}>
              "These algorithm problems are structured in a way that builds your
              problem-solving skills incrementally. Highly recommended!"
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal style={style}>
          <div className={`${style.feedbackCard} ${mood}`}>
            <div className={style.feedbackHeader}>
              <div className={style.avatar}>P</div>
              <div className={style.userInfo}>
                <p className={style.userName}>Priya Sharma</p>
                <p className={style.userTitle}>UX Engineer</p>
              </div>
              <p className={style.feedbackDate}>Apr 20, 2025</p>
            </div>
            <p className={style.feedbackText}>
              "The CSS grid practice modules helped me understand complex
              layouts that I was struggling with for months."
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Feedback;
