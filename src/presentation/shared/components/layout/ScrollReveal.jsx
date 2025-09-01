import React, { useEffect, useRef } from "react";

const ScrollReveal = ({ children, className, style }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(style.scrollRevealRevealed);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [style]);

  return (
    <div
      ref={elementRef}
      className={`${style.scrollReveal} ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
