import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faBookOpen, 
  faCode, 
  faTerminal,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import style from '@presentation/styles/pages/documents.module.css';

const articles = [
  {
    id: 1,
    title: 'Getting Started with React 19',
    excerpt: 'Explore the new features in React 19, including the React Compiler, Actions, and improved Suspense.',
    category: 'Frontend',
    readTime: '5 min read',
    date: 'Dec 15, 2024',
    color: '#FFD700'
  },
  {
    id: 2,
    title: 'Mastering CSS Grid & Flexbox',
    excerpt: 'A comprehensive guide to building complex layouts with modern CSS techniques. Say goodbye to floats.',
    category: 'Design',
    readTime: '8 min read',
    date: 'Dec 12, 2024',
    color: '#FF6B6B'
  },
  {
    id: 3,
    title: 'Node.js Performance Optimization',
    excerpt: 'Learn how to scale your Node.js applications and handle thousands of concurrent requests efficiently.',
    category: 'Backend',
    readTime: '12 min read',
    date: 'Dec 10, 2024',
    color: '#4ECDC4'
  },
  {
    id: 4,
    title: 'Understanding Clean Architecture',
    excerpt: 'How to structure your applications for maintainability, testability, and independence of frameworks.',
    category: 'Architecture',
    readTime: '15 min read',
    date: 'Dec 05, 2024',
    color: '#95E1D3'
  },
  {
    id: 5,
    title: 'Docker for Beginners',
    excerpt: 'Containerize your applications and ensure they run consistently across all environments.',
    category: 'DevOps',
    readTime: '10 min read',
    date: 'Nov 28, 2024',
    color: '#A8D8EA'
  },
  {
    id: 6,
    title: 'The Future of AI in Web Dev',
    excerpt: 'How unexpected tools and AI agents are reshaping the way we build and deploy web applications.',
    category: 'Trends',
    readTime: '6 min read',
    date: 'Nov 20, 2024',
    color: '#F3E5F5'
  }
];

const Documents = ({ theme }) => {
  return (
    <div className={`${style.container} ${theme}`}>
      <header className={style.header}>
        <h1 className={style.title}>Documents & Articles</h1>
        <p className={style.subtitle}>
          Curated reading materials, technical guides, and industry insights to keep you ahead.
        </p>
      </header>

      <div className={style.grid}>
        {articles.map((article) => (
          <article key={article.id} className={style.card}>
            <div className={style.cardContent}>
              <div className={style.category} style={{ color: article.color }}>
                <span style={{ backgroundColor: article.color, width: '10px', height: '10px', display: 'inline-block', border: '1px solid black', marginRight: '5px' }}></span>
                {article.category}
              </div>
              
              <Link to={`/documents/${article.id}`} style={{ textDecoration: 'none' }}>
                <h2 className={style.cardTitle}>{article.title}</h2>
              </Link>
              
              <p className={style.cardExcerpt}>{article.excerpt}</p>
              
              <div className={style.meta}>
                <span className={style.date}>{article.date}</span>
                <span className={style.readTime}>
                  <FontAwesomeIcon icon={faClock} />
                  {article.readTime}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Documents;
