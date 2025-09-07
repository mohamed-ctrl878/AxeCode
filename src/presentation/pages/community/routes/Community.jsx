import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faRocket,
  faStar,
  faHeart,
  faComment,
  faShare,
  faBookmark,
  faEllipsisH,
  faSearch,
  faFilter,
  faUsers,
  faLightbulb,
  faTrophy,
  faNewspaper,
  faQuestionCircle,
  faCode,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import style from "@presentation/styles/pages/community.module.css";
import PostArticle from "../components/PostArticle";

const Community = ({ theme }) => {
  const [activeFilter, setActiveFilter] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for posts
  const mockPosts = [
    {
      id: 1,
      author: {
        name: "Ahmed Hassan",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        role: "Senior Developer",
        verified: true,
      },
      content:
        "Just solved a challenging algorithm problem! 🎉 The Two Sum problem with O(n) time complexity. Here's my approach using a hash map...",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
      tags: ["Algorithms", "JavaScript", "Hash Tables"],
      likes: 124,
      comments: 23,
      shares: 8,
      timeAgo: "2 hours ago",
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 2,
      author: {
        name: "Sarah Ahmed",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        role: "Frontend Engineer",
        verified: true,
      },
      content:
        "Excited to share my latest React project! Built a beautiful dashboard with modern UI components and smooth animations. Check out the live demo! 🚀",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      tags: ["React", "UI/UX", "JavaScript"],
      likes: 89,
      comments: 15,
      shares: 12,
      timeAgo: "4 hours ago",
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: 3,
      author: {
        name: "Mohammed Ali",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        role: "Data Scientist",
        verified: false,
      },
      content:
        "Deep dive into machine learning algorithms! Today I explored gradient boosting and its applications in real-world problems. The results are fascinating! 📊",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["Machine Learning", "Python", "Data Science"],
      likes: 156,
      comments: 31,
      shares: 19,
      timeAgo: "6 hours ago",
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 4,
      author: {
        name: "medo",
        avatar:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        role: "Mobile Developer",
        verified: true,
      },
      content:
        "Just published my first Flutter app on the Play Store! 🎉 Months of hard work finally paid off. The app helps students learn programming through interactive challenges.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      tags: ["Flutter", "Mobile", "Education"],
      likes: 203,
      comments: 42,
      shares: 28,
      timeAgo: "8 hours ago",
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 5,
      author: {
        name: "Omar Khalil",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
        role: "DevOps Engineer",
        verified: false,
      },
      content:
        "Successfully migrated our entire infrastructure to Kubernetes! The deployment process is now 10x faster and more reliable. Here's what we learned...",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
      tags: ["Kubernetes", "DevOps", "Cloud"],
      likes: 78,
      comments: 18,
      shares: 9,
      timeAgo: "12 hours ago",
      isLiked: false,
      isBookmarked: true,
    },
  ];

  const filters = [
    { id: "explore", name: "Explore", icon: faRocket, count: null },
    { id: "trending", name: "Trending", icon: faFire, count: null },
    { id: "latest", name: "Latest", icon: faNewspaper, count: null },
    { id: "questions", name: "Questions", icon: faQuestionCircle, count: 15 },
    { id: "tutorials", name: "Tutorials", icon: faGraduationCap, count: 8 },
    { id: "showcase", name: "Showcase", icon: faTrophy, count: 12 },
    { id: "discussions", name: "Discussions", icon: faUsers, count: 23 },
    { id: "resources", name: "Resources", icon: faCode, count: 6 },
  ];
  console.log("run");
  const handleLike = (postId) => {
    // Mock like functionality
    // console.log("Liked post:", postId);
  };

  const handleBookmark = (postId) => {
    // Mock bookmark functionality
    // console.log("Bookmarked post:", postId);
  };

  const handleShare = (postId) => {
    // Mock share functionality
    // console.log("Shared post:", postId);
  };

  return (
    <div className={`${style.communityContainer}`}>
      {/* Background Blobs */}
      <div className={style.backgroundBlobs}>
        <div className={style.blob1}></div>
        <div className={style.blob2}></div>
        <div className={style.blob3}></div>
        <div className={style.blob4}></div>
      </div>

      {/* Sidebar */}
      <aside className={style.sidebar}>
        <div className={style.sidebarHeader}>
          <h2 className={style.sidebarTitle}>Community</h2>
          <p className={style.sidebarSubtitle}>Connect with developers</p>
        </div>

        {/* Search */}
        <div className={style.searchContainer}>
          <div className={style.searchInputWrapper}>
            <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={style.searchInput}
            />
          </div>
        </div>

        {/* Filters */}
        <div className={style.filtersSection}>
          <div className={style.filtersHeader}>
            <FontAwesomeIcon icon={faFilter} className={style.filterIcon} />
            <span className={style.filtersTitle}>Filters</span>
          </div>

          <nav className={style.filtersList}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`${style.filterItem} ${
                  activeFilter === filter.id ? style.activeFilter : ""
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <div className={style.filterContent}>
                  <FontAwesomeIcon
                    icon={filter.icon}
                    className={style.filterIcon}
                  />
                  <span className={style.filterName}>{filter.name}</span>
                </div>
                {filter.count && (
                  <span className={style.filterCount}>{filter.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className={style.statsSection}>
          <h3 className={style.statsTitle}>Community Stats</h3>
          <div className={style.statsGrid}>
            <div className={style.statItem}>
              <div className={style.statValue}>2.4K</div>
              <div className={style.statLabel}>Members</div>
            </div>
            <div className={style.statItem}>
              <div className={style.statValue}>156</div>
              <div className={style.statLabel}>Posts Today</div>
            </div>
            <div className={style.statItem}>
              <div className={style.statValue}>89</div>
              <div className={style.statLabel}>Active Now</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={style.mainContent}>
        {/* Header */}
        <header className={style.contentHeader}>
          <div className={style.headerLeft}>
            <h1 className={style.pageTitle}>
              {filters.find((f) => f.id === activeFilter)?.name || "Explore"}
            </h1>
            <p className={style.pageSubtitle}>
              Discover amazing content from our community
            </p>
          </div>
          <div className={style.headerRight}>
            <button className={style.createPostButton}>
              <FontAwesomeIcon icon={faLightbulb} />
              Create Post
            </button>
          </div>
        </header>

        {/* Posts Grid */}
        <div className={style.postsContainer}>
          {mockPosts.map((post) => (
            <PostArticle post={post} style={style}/>
          ))}
        </div>

        {/* Load More */}
        <div className={style.loadMoreSection}>
          <button className={style.loadMoreButton}>Load More Posts</button>
        </div>
      </main>
    </div>
  );
};

export default Community;
