import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// Components

// Styles
import style from "@presentation/styles/pages/practice.module.css";
import PracticenActivitesInfo from "../components/PracticenActivitesInfo";

const Practice = React.memo(({ theme }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [problem, setProblem] = useState(null);
  const [slider, setSlider] = useState({});
  const [error, setErr] = useState(null);
  const [errorProblem, setErrProblem] = useState(null);
  const [loaderCrs, setLoaderCrs] = useState(false);
  const [loaderPrb, setLoaderPrb] = useState(false);
  const [hover, setHover] = useState(
    theme === "bakground-dark-theme"
      ? "active-hover-dark"
      : "active-hover-light"
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const GET_COURSE =
    "http://localhost:1338/api/courses?populate=*&pagination[pageSize]=999&sort=createdAt:desc";
  const GET_PROBLEM_TYPE =
    "http://localhost:1338/api/problem-types?populate=*&pagination[pageSize]=999&sort=createdAt:desc";

  // Mock data for demonstration
  const mockProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "easy",
      status: "solved",
      category: "arrays",
      submissions: 1250,
      acceptanceRate: 85,
      description: "Find two numbers that add up to a target value",
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "easy",
      status: "unsolved",
      category: "stacks",
      submissions: 980,
      acceptanceRate: 78,
      description: "Check if parentheses are valid",
    },
    {
      id: 3,
      title: "Merge Two Sorted Lists",
      difficulty: "medium",
      status: "solved",
      category: "linked-lists",
      submissions: 750,
      acceptanceRate: 72,
      description: "Merge two sorted linked lists",
    },
    {
      id: 4,
      title: "Binary Tree Inorder Traversal",
      difficulty: "medium",
      status: "unsolved",
      category: "trees",
      submissions: 620,
      acceptanceRate: 68,
      description: "Traverse binary tree in inorder",
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "hard",
      status: "unsolved",
      category: "strings",
      submissions: 450,
      acceptanceRate: 45,
      description: "Find the longest palindromic substring",
    },
    {
      id: 6,
      title: "Container With Most Water",
      difficulty: "medium",
      status: "solved",
      category: "arrays",
      submissions: 890,
      acceptanceRate: 65,
      description: "Find container with maximum water",
    },
  ];

  const difficulties = ["all", "easy", "medium", "hard"];
  const statuses = ["all", "solved", "unsolved"];
  const categories = [
    "all",
    "arrays",
    "strings",
    "linked-lists",
    "trees",
    "stacks",
    "queues",
    "graphs",
    "dynamic-programming",
  ];

  useEffect(() => {
    setHover(
      theme === "bakground-dark-theme"
        ? "active-hover-dark"
        : "active-hover-light"
    );
  }, [theme]);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoaderCrs(true);
      const cacheName = "course-cache";

      try {
        const response = await fetch(GET_COURSE);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        data.timestamp = new Date().toISOString();
        setData(data);
      } catch (error) {
        setErr(error.message);
      } finally {
        setLoaderCrs(false);
      }
    };

    fetchCourseData();
  }, [GET_COURSE]);

  useEffect(() => {
    const fetchProblemData = async () => {
      setLoaderPrb(true);
      try {
        const response = await fetch(GET_PROBLEM_TYPE, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        data.timestamp = new Date().toISOString();
        setProblem(data.data);
      } catch (error) {
        setErrProblem(error.message);
      } finally {
        setLoaderPrb(false);
      }
    };

    fetchProblemData();
  }, [GET_PROBLEM_TYPE]);

  // Filter problems based on search and filters
  const filteredProblems = useMemo(() => {
    return mockProblems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        problem.difficulty === selectedDifficulty;
      const matchesStatus =
        selectedStatus === "all" || problem.status === selectedStatus;
      const matchesCategory =
        selectedCategory === "all" || problem.category === selectedCategory;

      return (
        matchesSearch && matchesDifficulty && matchesStatus && matchesCategory
      );
    });
  }, [searchTerm, selectedDifficulty, selectedStatus, selectedCategory]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return style.difficultyEasy;
      case "medium":
        return style.difficultyMedium;
      case "hard":
        return style.difficultyHard;
      default:
        return style.difficultyEasy;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "solved":
        return style.statusSolved;
      case "unsolved":
        return style.statusUnsolved;
      default:
        return style.statusUnsolved;
    }
  };

  const mapingData =
    data &&
    data.data &&
    data.data
      .map((e) => {
        let tpc = e.topic || "globle";
        tpc = tpc.replace(/\s+/g, "");
        if (e.special === "practices") {
          return (
            <Link
              key={e.id}
              to={`/courses/${e.documentId}/0`}
              className={`${style.courseCard} ${hover} ${theme}`}
            >
              <img
                src={e.picture && `http://localhost:1338${e.picture.url}`}
                alt={e.tittle}
                className={style.courseImage}
              />
              <div>
                <h3 className={style.courseTitle}>{e.tittle}</h3>
                <p className={style.courseDescription}>
                  Practice problems and exercises to improve your skills
                </p>
              </div>
            </Link>
          );
        }
        return null;
      })
      .filter(Boolean);

  return (
    <div className={`${style.practiceContainer}`}>
      <PracticenActivitesInfo style={style}></PracticenActivitesInfo>

      <div className={style.practiceContent}>
        {/* Header Section */}
        <div className={style.practiceHeader}>
          <h1 className={style.practiceTitle}>Practice Problems</h1>
          <p className={style.practiceSubtitle}>
            Sharpen your coding skills with our curated collection of
            programming challenges
          </p>
        </div>

        {/* Filters Section */}
        <div className={`card ${style.filtersSection}`}>
          <div className={style.filtersHeader}>
            <svg
              className={style.filtersIcon}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className={style.filtersTitle}>Filter Problems</h2>
          </div>

          <div className={style.filtersGrid}>
            <div className={style.searchContainer}>
              <svg
                className={style.searchIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`input ${style.searchInput}`}
              />
            </div>

            <div className={style.filterGroup}>
              <label className={style.filterLabel}>Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={style.filterSelect}
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.filterGroup}>
              <label className={style.filterLabel}>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={style.filterSelect}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.filterGroup}>
              <label className={style.filterLabel}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={style.filterSelect}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        {mapingData && mapingData.length > 0 && (
          <div className={style.coursesSection}>
            <h2 className={style.coursesTitle}>Practice Courses</h2>
            <div className={style.coursesGrid}>{mapingData}</div>
          </div>
        )}

        {/* Problems Table Section */}
        <div className={`card ${style.problemsSection}`}>
          <div className={style.problemsHeader}>
            <h2 className={style.problemsTitle}>Problems</h2>
            <div className={style.problemsStats}>
              <span className={style.statItem}>
                {filteredProblems.length} Problems
              </span>
              <span className={style.statItem}>
                {filteredProblems.filter((p) => p.status === "solved").length}{" "}
                Solved
              </span>
              <span className={style.statItem}>
                {filteredProblems.filter((p) => p.status === "unsolved").length}{" "}
                Unsolved
              </span>
            </div>
          </div>

          {loaderPrb ? (
            <div className={style.loadingContainer}>
              <div className={style.loadingSpinner}></div>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className={style.emptyState}>
              <div className={style.emptyIcon}>🔍</div>
              <h3 className={style.emptyTitle}>No problems found</h3>
              <p className={style.emptyDescription}>
                Try adjusting your filters or search terms to find more
                problems.
              </p>
            </div>
          ) : (
            <div className={style.tableContainer}>
              <table className={` ${style.problemsTable}`}>
                <thead className={style.tableHeader}>
                  <tr className={"first-bg"}>
                    <th className={"prm-border"}>Problem</th>
                    <th className={"prm-border"}>Difficulty</th>
                    <th className={"prm-border"}>Category</th>
                    <th className={"prm-border"}>Status</th>
                    <th className={"prm-border"}>Submissions</th>
                    <th className={"prm-border"}>Acceptance Rate</th>
                    <th className={"prm-border"}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem) => (
                    <tr key={problem.id} className={`sec-bg ${style.tableRow}`}>
                      <td className={`prm-border  ${style.tableCell}`}>
                        <div>
                          <div className={style.problemTitle}>
                            {problem.title}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                            }}
                          >
                            {problem.description}
                          </div>
                        </div>
                      </td>
                      <td className={`prm-border ${style.tableCell}`}>
                        <span
                          className={`${
                            style.difficultyBadge
                          } ${getDifficultyColor(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className={`prm-border ${style.tableCell}`}>
                        {problem.category
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </td>
                      <td className={`prm-border ${style.tableCell}`}>
                        <span
                          className={`${style.statusBadge} ${getStatusColor(
                            problem.status
                          )}`}
                        >
                          {problem.status}
                        </span>
                      </td>
                      <td className={`prm-border ${style.tableCell}`}>
                        {problem.submissions.toLocaleString()}
                      </td>
                      <td className={`prm-border ${style.tableCell}`}>
                        {problem.acceptanceRate}%
                      </td>
                      <td className={`prm-border ${style.tableCell}`}>
                        <button
                          className={style.actionButton}
                          onClick={() => navigate(`/problem/${problem.id}`)}
                        >
                          {problem.status === "solved" ? "Review" : "Solve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Practice;
