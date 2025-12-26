import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, 
  faPlus, 
  faEdit, 
  faTrash, 
  faCog, 
  faFileAlt, 
  faVideo 
} from "@fortawesome/free-solid-svg-icons";
import style from "@presentation/styles/pages/content-dashboard.module.css"; // We will need to create this CSS
const generateMockContent = (count) => {
  const types = ["PROBLEM", "COURSE", "EVENT", "ARTICLE", "LIVE", "ROADMAP", "LESSON", "WEEK"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Content Item ${i + 1}`,
    type: types[i % types.length],
    status: i % 3 === 0 ? "DRAFT" : "PUBLISHED",
    price: i % 3 === 0 ? "Free" : "$19.99",
    createdAt: new Date().toLocaleDateString(),
  }));
};
const ContentDashboard = ({ theme, contentType, embedded = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allContent, setAllContent] = useState([]);
  const [displayedContent, setDisplayedContent] = useState([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  // Simulate fetching data
  useEffect(() => {
    // In real app, fetching would happen here
    const data = generateMockContent(100); 
    setAllContent(data);
  }, []);
  // Filter and Pagination Logic
  useEffect(() => {
    let filtered = allContent;
    // Filter by Type (if prop provided)
    if (contentType) {
      filtered = filtered.filter(item => item.type === contentType);
    }
    // Filter by Search
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Pagination slice
    const visibleCount = page * ITEMS_PER_PAGE;
    setDisplayedContent(filtered.slice(0, visibleCount));
  }, [searchTerm, page, allContent, contentType]);
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  const hasMore = displayedContent.length < allContent.length && displayedContent.length < allContent.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).length;
  const getTitle = () => {
    switch(contentType) {
      case "COURSE": return "Course Management";
      case "PROBLEM": return "Problem Management";
      case "EVENT": return "Event Management";
      case "ARTICLE": return "Blog/Article Management";
      case "LIVE": return "Live Stream Management";
      case "ROADMAP": return "Roadmap Management";
      case "LESSON": return "Lesson Management";
      case "WEEK": return "Week Management";
      default: return "Content Management";
    }
  };
  const themeClass = theme === "dark-theme" ? style.dark : style.light;
  return (
    <div className={`${style.dashboardContainer} ${themeClass}`} style={embedded ? { padding: 0 } : {}}>
      {!embedded && (
        <header className={style.dashboardHeader}>
          <h2 className={style.title}>{getTitle()}</h2>
          <div className={style.actions}>
            {(!contentType || contentType === "COURSE") && (
              <Link to="/settings/profile/add-course" className={`${style.btn} ${style.btnPrimary}`}>
                  <FontAwesomeIcon icon={faPlus} /> Add Course
              </Link>
            )}
            {(!contentType || contentType === "PROBLEM") && (
              <Link to="/settings/content/add-problem" className={`${style.btn} ${style.btnPrimary}`}>
                  <FontAwesomeIcon icon={faPlus} /> Add Problem
              </Link>
            )}
            {contentType === "LESSON" && (
              <Link to="/settings/profile/add-lesson" className={`${style.btn} ${style.btnPrimary}`}>
                  <FontAwesomeIcon icon={faPlus} /> Add Lesson
              </Link>
            )}
            {/* Using a placeholder for Add Week as no explicit route was found, or user might mean Add Course -> Add Week flow */}
            {contentType === "WEEK" && (
              <Link to="/settings/profile/add-week" className={`${style.btn} ${style.btnPrimary}`}>
                  <FontAwesomeIcon icon={faPlus} /> Add Week
              </Link>
            )}
            {/* Add other buttons based on type if needed */}
          </div>
        </header>
      )}
      {/* If embedded, maybe we still want the ACTIONS (add button) but not the Title? 
          For now, let's assume CourseManager handles the separate "Add" buttons or we keep them here.
          The user asked for tabs to VIEW. Let's keep actions visible for now even if embedded? 
          Actually, the Plan said "Allow embedding (hide main header if needed)".
          Let's hide the TITLE but keep the ACTIONS if possible, or hide entire header if CourseManager has one.
          CourseManager has a title. So hiding title is good. 
          But we need the "Add" buttons.
          Let's modify to only hide Title if embedded, but keep Actions. 
      */}
      
      {embedded && (
         <div className={style.dashboardHeader} style={{marginBottom: '1rem'}}>
            <div style={{flex: 1}}></div> {/* Spacer */}
            <div className={style.actions}>
              {contentType === "COURSE" && (
                <Link to="/settings/profile/add-course" className={`${style.btn} ${style.btnPrimary}`}>
                    <FontAwesomeIcon icon={faPlus} /> Add Course
                </Link>
              )}
               {contentType === "LESSON" && (
                <Link to="/settings/profile/add-lesson" className={`${style.btn} ${style.btnPrimary}`}>
                    <FontAwesomeIcon icon={faPlus} /> Add Lesson
                </Link>
              )}
            {/* Add Week Button */}
            {contentType === "WEEK" && (
                <Link to="/settings/profile/add-week" className={`${style.btn} ${style.btnPrimary}`}>
                    <FontAwesomeIcon icon={faPlus} /> Add Week
                </Link>
            )}
               {/* Add Lesson/Week buttons would go here if routes existed */}
            </div>
         </div>
      )}
      {/* Search Bar */}
      <div className={style.searchBarWrapper}>
        <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
        <input 
          type="text" 
          placeholder="Search by title or type..." 
          className={style.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>
      {/* Content Grid/Table */}
      <div className={style.contentGrid}>
        {displayedContent.length > 0 ? (
          displayedContent.map((item) => (
            <div key={item.id} className={style.contentCard}>
              <div className={style.cardHeader}>
                <span className={`${style.badge} ${item.type === "PROBLEM" ? style.badgeProblem : style.badgeCourse}`}>
                  {item.type}
                </span>
                <span className={`${style.status} ${item.status === "DRAFT" ? style.statusDraft : style.statusPublished}`}>
                  {item.status}
                </span>
              </div>
              <h3 className={style.cardTitle}>{item.title}</h3>
              <p className={style.cardMeta}>Created: {item.createdAt} • Price: {item.price}</p>
              
              <div className={style.cardActions}>
                 {/* Entitlement Configuration Link */}
                <button 
                  onClick={() => navigate(`/settings/content/configure/${item.id}`)} 
                  className={`${style.actionBtn} ${style.btnConfig}`}
                  title="Configure Entitlement"
                >
                  <FontAwesomeIcon icon={faCog} /> Authorization
                </button>
                <button className={style.actionBtn} title="Edit">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className={`${style.actionBtn} ${style.btnDelete}`} title="Delete">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={style.noResults}>No content found matching "{searchTerm}"</div>
        )}
      </div>
      {/* Pagination Load More */}
      {hasMore && (
        <div className={style.paginationWrapper}>
          <button onClick={handleLoadMore} className={style.loadMoreBtn}>
            Read More
          </button>
        </div>
      )}
    </div>
  );
};
export default ContentDashboard;