import React from "react";
// import editor from "@/assets/images/editor.webp";

const HeroSec = ({ theme, style }) => {
  return (
    <>
      <section className={`${style.heroSection} ${theme}`}>
        {/* Enhanced Gradient Background Shapes */}
        <div className={style.heroBackground}>
          <div className={style.gradientShape1}></div>
          <div className={style.gradientShape2}></div>
          <div className={style.gradientShape3}></div>

          {/* Additional Floating Elements */}
          <div className={style.floatingElement}></div>
          <div className={style.floatingElement}></div>
          <div className={style.floatingElement}></div>
        </div>

        {/* Hero Content */}
        <div className={style.heroContent}>
          <h1 className={style.heroTitle}>
            Develop Your Skills <br />
            with AxeCode
          </h1>
          <p className={style.heroSubtitle}>
            Practice coding challenges, get feedback from professionals and
            build your portfolio <br />
            with our interactive learning platform.
          </p>
          <div className={style.heroButtons}>
            <button
              className={`${style.heroButton} ${style.heroButtonPrimary}`}
            >
              Start Practicing
            </button>
            <button
              className={`${style.heroButton} ${style.heroButtonSecondary}`}
            >
              Explore Courses
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSec;
