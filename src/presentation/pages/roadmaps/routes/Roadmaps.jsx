import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, 
  faServer, 
  faLaptopCode, 
  faMobileAlt, 
  faRobot, 
  faArrowRight, 
  faMapSigns
} from '@fortawesome/free-solid-svg-icons';
import style from '@presentation/styles/pages/roadmaps.module.css';

const stacks = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Master the art of creating beautiful user interfaces. Learn HTML, CSS, JavaScript, React, and modern styling frameworks.',
    icon: faLaptopCode,
    tags: ['React', 'CSS', 'JavaScript'],
    color: '#FFD700' // Gold
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Build robust server-side applications. Dive into Node.js, Databases, API design, and system architecture.',
    icon: faServer,
    tags: ['Node.js', 'SQL', 'APIs'],
    color: '#FF6B6B' // Red
  },
  {
    id: 'fullstack',
    title: 'Full Stack',
    description: 'Become a complete developer. Bridge the gap between frontend and backend to build entire applications from scratch.',
    icon: faLayerGroup,
    tags: ['MERN', 'DevOps', 'System Design'],
    color: '#4ECDC4' // Teal
  },
  {
    id: 'android',
    title: 'Android Developer',
    description: 'Create powerful mobile applications for the Android ecosystem using Kotlin and Jetpack Compose.',
    icon: faMobileAlt,
    tags: ['Kotlin', 'Compose', 'Mobile'],
    color: '#95E1D3' // Mint
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    description: 'Streamline development and deployment. Master Docker, Kubernetes, CI/CD pipelines, and cloud infrastructure.',
    icon: faMapSigns, // Placeholder
    tags: ['Docker', 'AWS', 'CI/CD'],
    color: '#A8D8EA' // Light Blue
  },
  {
    id: 'ai-data',
    title: 'AI & Data Scientist',
    description: 'Unlock the power of data. Learn Python, Machine Learning, Deep Learning, and data visualization techniques.',
    icon: faRobot,
    tags: ['Python', 'ML', 'TensorFlow'],
    color: '#F3E5F5' // Lavender
  }
];

const Roadmaps = ({ theme }) => {
  return (
    <div className={`${style.container} ${theme}`}>
      <header className={style.header}>
        <h1 className={style.title}>Tech Roadmaps</h1>
        <p className={style.subtitle}>
          Step-by-step guides to mastering different technology stacks. Choose your path and start your journey.
        </p>
      </header>

      <div className={style.grid}>
        {stacks.map((stack) => (
          <div key={stack.id} className={style.card}>
            <div className={style.cardHeader}>
              <div className={style.iconWrapper} style={{ backgroundColor: stack.color }}>
                <FontAwesomeIcon icon={stack.icon} />
              </div>
              <h2 className={style.cardTitle}>{stack.title}</h2>
            </div>
            
            <p className={style.cardDescription}>{stack.description}</p>
            
            <div className={style.tags}>
              {stack.tags.map(tag => (
                <span key={tag} className={style.tag}>{tag}</span>
              ))}
            </div>

            <Link to={`/roadmaps/${stack.id}`} className={style.button}>
              <span>View Roadmap</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
