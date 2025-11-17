import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "@presentation/styles/pages/events-listing.module.css";

const EventsListing = ({ theme }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    eventTypes: [],
    levels: []
  });
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showLoadMore, setShowLoadMore] = useState(false);

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  // Mock events data with different categories
  const mockEvents = [
    {
      id: 1,
      title: "React & Modern Web Development Summit 2024",
      description: "Join leading developers and industry experts for a full day of React insights, best practices, and the future of web development.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      date: "January 15, 2025",
      time: "9:00 AM - 6:00 PM PST",
      location: "San Francisco Convention Center",
      categories: ["Programming", "Frontend"],
      eventType: "Conference",
      level: "Intermediate",
      attendees: 1250,
      price: "Free",
      speakers: ["Sarah Chen", "Michael Rodriguez"]
    },
    {
      id: 2,
      title: "Data Structures & Algorithms Masterclass",
      description: "Deep dive into advanced DSA concepts with hands-on coding challenges and real-world problem-solving techniques.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      date: "January 22, 2025",
      time: "2:00 PM - 8:00 PM EST",
      location: "Online Event",
      categories: ["DSA", "Programming"],
      eventType: "Workshop",
      level: "Advanced",
      attendees: 890,
      price: "$49",
      speakers: ["Dr. John Smith"]
    },
    {
      id: 3,
      title: "Clean Architecture in Software Design",
      description: "Learn how to build maintainable, scalable applications using clean architecture principles and design patterns.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      date: "February 5, 2025",
      time: "10:00 AM - 4:00 PM GMT",
      location: "London Tech Hub",
      categories: ["Architecture", "Design Patterns"],
      eventType: "Workshop",
      level: "Intermediate",
      attendees: 456,
      price: "$89",
      speakers: ["Emily Zhang", "Robert Wilson"]
    },
    {
      id: 4,
      title: "AI & Machine Learning Bootcamp",
      description: "Comprehensive introduction to AI/ML concepts, with practical projects using Python, TensorFlow, and modern ML frameworks.",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop",
      date: "February 18, 2025",
      time: "9:00 AM - 7:00 PM PST",
      location: "Silicon Valley Campus",
      categories: ["AI/ML", "Python"],
      eventType: "Bootcamp",
      level: "Beginner",
      attendees: 678,
      price: "$199",
      speakers: ["David Kumar", "Lisa Chen"]
    },
    {
      id: 5,
      title: "UI/UX Design Workshop",
      description: "Master modern design principles, user research techniques, and prototyping tools in this intensive design workshop.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      date: "March 2, 2025",
      time: "1:00 PM - 6:00 PM CET",
      location: "Berlin Design Studio",
      categories: ["Design", "UX/UI"],
      eventType: "Workshop",
      level: "Beginner",
      attendees: 324,
      price: "$75",
      speakers: ["Maria Garcia"]
    },
    {
      id: 6,
      title: "Microservices Architecture Summit",
      description: "Explore microservices patterns, deployment strategies, and best practices for building distributed systems at scale.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      date: "March 15, 2025",
      time: "8:00 AM - 5:00 PM EST",
      location: "New York Convention Center",
      categories: ["Architecture", "Backend"],
      eventType: "Conference",
      level: "Advanced",
      attendees: 987,
      price: "$149",
      speakers: ["Alex Johnson", "Priya Patel"]
    }
  ];

  // Filter options
  const filterOptions = {
    categories: [
      { id: "programming", label: "Programming Languages", count: 3 },
      { id: "dsa", label: "Data Structures & Algorithms", count: 1 },
      { id: "architecture", label: "Clean Architecture", count: 2 },
      { id: "design", label: "UI/UX Design", count: 1 },
      { id: "ai", label: "AI/Machine Learning", count: 1 },
      { id: "frontend", label: "Frontend Development", count: 1 },
      { id: "backend", label: "Backend Development", count: 1 }
    ],
    eventTypes: [
      { id: "conference", label: "Conference", count: 2 },
      { id: "workshop", label: "Workshop", count: 3 },
      { id: "bootcamp", label: "Bootcamp", count: 1 }
    ],
    levels: [
      { id: "beginner", label: "Beginner", count: 2 },
      { id: "intermediate", label: "Intermediate", count: 2 },
      { id: "advanced", label: "Advanced", count: 2 }
    ]
  };

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    };

    loadEvents();
  }, []);

  // Filter and search events
  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filters
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(event =>
        event.categories.some(cat => 
          selectedFilters.categories.includes(cat.toLowerCase())
        )
      );
    }

    // Apply event type filters
    if (selectedFilters.eventTypes.length > 0) {
      filtered = filtered.filter(event =>
        selectedFilters.eventTypes.includes(event.eventType.toLowerCase())
      );
    }

    // Apply level filters
    if (selectedFilters.levels.length > 0) {
      filtered = filtered.filter(event =>
        selectedFilters.levels.includes(event.level.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "popularity":
          return b.attendees - a.attendees;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
    setShowLoadMore(filtered.length > 6);
  }, [events, searchTerm, selectedFilters, sortBy]);

  const handleFilterChange = (filterType, filterId) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(filterId)
        ? prev[filterType].filter(id => id !== filterId)
        : [...prev[filterType], filterId]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      eventTypes: [],
      levels: []
    });
    setSearchTerm("");
  };

  const getBadgeClass = (category) => {
    const categoryMap = {
      "programming": style.badgeProgramming,
      "frontend": style.badgeProgramming,
      "backend": style.badgeProgramming,
      "python": style.badgeProgramming,
      "dsa": style.badgeDsa,
      "architecture": style.badgeArchitecture,
      "design patterns": style.badgeArchitecture,
      "design": style.badgeDesign,
      "ux/ui": style.badgeDesign,
      "ai/ml": style.badgeAi
    };
    
    return categoryMap[category.toLowerCase()] || style.badgeProgramming;
  };

  if (loading) {
    return (
      <div className={`${style.eventsListingContainer} ${themeClass}`}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border-primary)',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${style.eventsListingContainer} ${themeClass}`}>
      {/* Header Section */}
      <div className={style.eventsHeader}>
        <div className={style.headerContent}>
          <h1 className={style.eventsTitle}>Tech Events</h1>
          <p className={style.eventsSubtitle}>
            Discover and join the best tech events, workshops, and conferences
          </p>
          <div className={style.eventsStats}>
            <div className={style.statItem}>
              <span className={style.statNumber}>{events.length}</span>
              <span className={style.statLabel}>Total Events</span>
            </div>
            <div className={style.statItem}>
              <span className={style.statNumber}>{filteredEvents.length}</span>
              <span className={style.statLabel}>Available</span>
            </div>
            <div className={style.statItem}>
              <span className={style.statNumber}>15+</span>
              <span className={style.statLabel}>Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={style.eventsContent}>
        {/* Sidebar Filters */}
        <div className={style.sidebar}>
          {/* Search */}
          <div className={style.searchSection}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={style.searchInput}
              />
              <div className={style.searchIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div className={style.filterSection}>
            <h3 className={style.filterTitle}>
              <svg className={style.filterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              Categories
            </h3>
            <div className={style.filterOptions}>
              {filterOptions.categories.map((option) => (
                <div
                  key={option.id}
                  className={style.filterOption}
                  onClick={() => handleFilterChange('categories', option.id)}
                >
                  <div className={`${style.filterCheckbox} ${
                    selectedFilters.categories.includes(option.id) ? style.checked : ''
                  }`}>
                    {selectedFilters.categories.includes(option.id) && '✓'}
                  </div>
                  <span className={style.filterLabel}>{option.label}</span>
                  <span className={style.filterCount}>{option.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Type Filter */}
          <div className={style.filterSection}>
            <h3 className={style.filterTitle}>
              <svg className={style.filterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Event Type
            </h3>
            <div className={style.filterOptions}>
              {filterOptions.eventTypes.map((option) => (
                <div
                  key={option.id}
                  className={style.filterOption}
                  onClick={() => handleFilterChange('eventTypes', option.id)}
                >
                  <div className={`${style.filterCheckbox} ${
                    selectedFilters.eventTypes.includes(option.id) ? style.checked : ''
                  }`}>
                    {selectedFilters.eventTypes.includes(option.id) && '✓'}
                  </div>
                  <span className={style.filterLabel}>{option.label}</span>
                  <span className={style.filterCount}>{option.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className={style.filterSection}>
            <h3 className={style.filterTitle}>
              <svg className={style.filterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2,17 12,22 22,17"></polyline>
                <polyline points="2,12 12,17 22,12"></polyline>
              </svg>
              Level
            </h3>
            <div className={style.filterOptions}>
              {filterOptions.levels.map((option) => (
                <div
                  key={option.id}
                  className={style.filterOption}
                  onClick={() => handleFilterChange('levels', option.id)}
                >
                  <div className={`${style.filterCheckbox} ${
                    selectedFilters.levels.includes(option.id) ? style.checked : ''
                  }`}>
                    {selectedFilters.levels.includes(option.id) && '✓'}
                  </div>
                  <span className={style.filterLabel}>{option.label}</span>
                  <span className={style.filterCount}>{option.count}</span>
                </div>
              ))}
            </div>
          </div>

          <button className={style.clearFilters} onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>

        {/* Main Content Area */}
        <div className={style.mainContent}>
          {/* Content Header */}
          <div className={style.contentHeader}>
            <span className={style.resultsCount}>
              {filteredEvents.length} events found
            </span>
            <div className={style.sortControls}>
              <span className={style.sortLabel}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={style.sortSelect}
              >
                <option value="date">Date</option>
                <option value="popularity">Popularity</option>
                <option value="title">Title</option>
              </select>
              <div className={style.viewToggle}>
                <button
                  className={`${style.viewButton} ${viewMode === 'grid' ? style.active : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button
                  className={`${style.viewButton} ${viewMode === 'list' ? style.active : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Events Grid/List */}
          {filteredEvents.length === 0 ? (
            <div className={style.noEvents}>
              <svg className={style.noEventsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <h3 className={style.noEventsTitle}>No events found</h3>
              <p className={style.noEventsText}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? style.eventsGrid : style.eventsGridList}>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={viewMode === 'grid' ? style.eventCard : style.eventCardList}
                  onClick={() => {/* Handle click */}}
                >
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className={viewMode === 'grid' ? style.eventImage : style.eventImageList}
                  />
                  <div className={viewMode === 'grid' ? style.eventCardContent : style.eventContentList}>
                    {viewMode === 'list' && (
                      <div className={style.eventHeaderList}>
                        <div>
                          <div className={style.eventBadges}>
                            {event.categories.map((category, idx) => (
                              <span key={idx} className={`${style.eventBadge} ${getBadgeClass(category)}`}>
                                {category}
                              </span>
                            ))}
                          </div>
                          <h3 className={style.eventTitle}>{event.title}</h3>
                        </div>
                        <div className={style.eventActionsCompact}>
                          <Link
                            to={`/events/${event.id}`}
                            className={`${style.primaryButton} ${style.compactButton}`}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {viewMode === 'grid' && (
                      <div className={style.eventBadges}>
                        {event.categories.map((category, idx) => (
                          <span key={idx} className={`${style.eventBadge} ${getBadgeClass(category)}`}>
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {viewMode === 'grid' && (
                      <h3 className={style.eventTitle}>{event.title}</h3>
                    )}
                    
                    <div className={style.eventMeta}>
                      <div className={style.metaItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{event.date}</span>
                      </div>
                      <div className={style.metaItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <div className={style.metaItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="m23 21-2-2-2 2"></path>
                        </svg>
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    
                    <p className={style.eventDescription}>{event.description}</p>
                    
                    {viewMode === 'grid' && (
                      <div className={style.eventActions}>
                        <Link
                          to={`/events/${event.id}`}
                          className={style.primaryButton}
                        >
                          View Details
                        </Link>
                        <button className={style.secondaryButton}>
                          {event.price === "Free" ? "Register Free" : `Register ${event.price}`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {showLoadMore && filteredEvents.length > 0 && (
            <div className={style.loadMore}>
              <button className={style.loadMoreButton}>
                Load More Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsListing;