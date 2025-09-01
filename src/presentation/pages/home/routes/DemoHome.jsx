import React, { useEffect, useRef } from "react";
import styles from "@presentation/styles/pages/demo-home.module.css";

const DemoHome = () => {
  const heroRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const { clientX, clientY } = e;
        const { left, top, width, height } =
          heroRef.current.getBoundingClientRect();
        const x = (clientX - left - width / 2) / 25;
        const y = (clientY - top - height / 2) / 25;
        heroRef.current.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1, 1, 1)`;
      }
    };

    const handleHeroLeave = () => {
      if (heroRef.current) {
        heroRef.current.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("mouseleave", handleHeroLeave);
    }

    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", handleMouseMove);
        hero.removeEventListener("mouseleave", handleHeroLeave);
      }
    };
  }, []);

  const handleCardMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleCardLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroContent}>
          <div className={styles.glowOrbs}>
            <div className={styles.orb}></div>
            <div className={styles.orb}></div>
            <div className={styles.orb}></div>
          </div>
          <h1 className={styles.title}>
            Master Your Code Journey
            <span className={styles.accentText}>One Challenge at a Time</span>
          </h1>
          <p className={styles.subtitle}>
            Join our community of developers and level up your programming
            skills through interactive challenges, real-world projects, and
            expert guidance.
          </p>
          <div className={styles.ctaButtons}>
            <button className={`${styles.button} ${styles.primaryButton}`}>
              Start Learning
              <span className={styles.buttonGlow}></span>
            </button>
            <button className={`${styles.button} ${styles.secondaryButton}`}>
              View Courses
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
        <div className={styles.featureGrid}>
          {[
            {
              title: "Interactive Learning",
              description:
                "Learn by doing with our hands-on coding challenges and real-time feedback system.",
              icon: "🚀",
            },
            {
              title: "Expert Mentorship",
              description:
                "Get guidance from industry professionals and experienced developers.",
              icon: "👨‍💻",
            },
            {
              title: "Project-Based",
              description:
                "Build real-world projects that you can add to your portfolio.",
              icon: "💼",
            },
          ].map((feature, index) => (
            <div
              key={index}
              ref={addToRefs}
              className={styles.featureCard}
              onMouseMove={(e) => handleCardMove(e, index)}
              onMouseLeave={() => handleCardLeave(index)}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className={styles.cardGlow}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statGrid}>
          {[
            { number: "10K+", label: "Active Students" },
            { number: "500+", label: "Coding Challenges" },
            { number: "50+", label: "Expert Mentors" },
            { number: "95%", label: "Success Rate" },
          ].map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <h3 className={styles.statNumber}>{stat.number}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Start Your Journey?</h2>
          <p>
            Join thousands of developers who have already leveled up their
            careers with us.
          </p>
          <button className={`${styles.button} ${styles.primaryButton}`}>
            Get Started Now
            <span className={styles.buttonGlow}></span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default DemoHome;
