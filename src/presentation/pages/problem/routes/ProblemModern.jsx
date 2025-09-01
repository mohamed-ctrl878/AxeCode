import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faGripVertical } from "@fortawesome/free-solid-svg-icons";
// import { CodeEditor } from "@presentation/shared/components/editor/CodeEditor";
// import { Loader } from "@presentation/shared/components/ui/loader/Loader";
import style from "@presentation/styles/pages/problem-modern.module.css";
import Loader from "@presentation/shared/components/ui/loader/Loader";
import CodeEditor from "@presentation/shared/components/editor/CodeEditor";

const ProblemModern = ({ theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState("description");
  const [testCaseMode, setTestCaseMode] = useState("test");
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [executionResults, setExecutionResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [error, setError] = useState("");

  // Resizing state
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);

  // Refs for resizing
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const codePanelRef = useRef(null);
  const testCasesPanelRef = useRef(null);
  const verticalResizerRef = useRef(null);
  const horizontalResizerRef = useRef(null);

  // Mock problem data
  const mockProblem = {
    id: id || "1",
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    topics: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Microsoft"],
    acceptanceRate: 48.5,
    submissions: 1250000,
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expected: [0, 1],
        output: null,
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expected: [1, 2],
        output: null,
      },
      {
        input: { nums: [3, 3], target: 6 },
        expected: [0, 1],
        output: null,
      },
    ],
  };

  // Get default code based on language
  const getDefaultCode = (lang) => {
    const templates = {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        
`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
    };
    return templates[lang] || templates.javascript;
  };

  // Initialize code when language changes
  useEffect(() => {
    setCode(getDefaultCode(language));
  }, [language]);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData(mockProblem);
        setError("");
      } catch (err) {
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // Handle code execution
  const handleRunCode = useCallback(async () => {
    setIsSubmitting(true);
    setSubmissionStatus("Running...");

    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResults = data.testCases.map((testCase, index) => ({
        ...testCase,
        output: index === 0 ? [0, 1] : index === 1 ? [1, 2] : [0, 1],
        status: "passed",
        executionTime: Math.random() * 100 + 50,
        memory: Math.random() * 20 + 10,
      }));

      setExecutionResults(mockResults);
      setSubmissionStatus("Accepted");
    } catch (err) {
      setSubmissionStatus("Runtime Error");
    } finally {
      setIsSubmitting(false);
    }
  }, [data]);

  // Handle code submission
  const handleSubmitCode = useCallback(async () => {
    setIsSubmitting(true);
    setSubmissionStatus("Submitting...");

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setSubmissionStatus("Accepted");
    } catch (err) {
      setSubmissionStatus("Wrong Answer");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Helper functions
  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: style.easy,
      Medium: style.medium,
      Hard: style.hard,
    };
    return colors[difficulty] || style.easy;
  };

  const getStatusColor = (status) => {
    const colors = {
      passed: style.passed,
      failed: style.failed,
      error: style.error,
    };
    return colors[status] || style.passed;
  };

  // Vertical resizing logic
  const handleVerticalMouseDown = useCallback((e) => {
    setIsDraggingVertical(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleVerticalMouseMove = useCallback(
    (e) => {
      if (!isDraggingVertical) return;

      const container = leftPanelRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;

      // Limit the width between 300px and 70% of container
      const minWidth = 300;
      const maxWidth = containerWidth * 0.7;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));

      if (leftPanelRef.current) {
        leftPanelRef.current.style.width = `${clampedWidth}px`;
      }
    },
    [isDraggingVertical]
  );

  const handleVerticalMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Horizontal resizing logic
  const handleHorizontalMouseDown = useCallback((e) => {
    setIsDraggingHorizontal(true);
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleHorizontalMouseMove = useCallback(
    (e) => {
      if (!isDraggingHorizontal) return;

      const rightContainer = rightPanelRef.current;
      if (!rightContainer) return;

      const containerRect = rightContainer.getBoundingClientRect();
      const newCodeHeight = e.clientY - containerRect.top;
      const containerHeight = containerRect.height;

      // Limit the height between 200px and 80% of container
      const minHeight = 200;
      const maxHeight = containerHeight * 0.8;
      const clampedHeight = Math.max(
        minHeight,
        Math.min(maxHeight, newCodeHeight)
      );

      if (codePanelRef.current) {
        codePanelRef.current.style.height = `${clampedHeight}px`;
      }
    },
    [isDraggingHorizontal]
  );

  const handleHorizontalMouseUp = useCallback(() => {
    setIsDraggingHorizontal(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Event listeners for resizing
  useEffect(() => {
    if (isDraggingVertical) {
      document.addEventListener("mousemove", handleVerticalMouseMove);
      document.addEventListener("mouseup", handleVerticalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleVerticalMouseMove);
        document.removeEventListener("mouseup", handleVerticalMouseUp);
      };
    }
  }, [isDraggingVertical, handleVerticalMouseMove, handleVerticalMouseUp]);

  useEffect(() => {
    if (isDraggingHorizontal) {
      document.addEventListener("mousemove", handleHorizontalMouseMove);
      document.addEventListener("mouseup", handleHorizontalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleHorizontalMouseMove);
        document.removeEventListener("mouseup", handleHorizontalMouseUp);
      };
    }
  }, [
    isDraggingHorizontal,
    handleHorizontalMouseMove,
    handleHorizontalMouseUp,
  ]);

  if (loading) {
    return (
      <div
        className={`${style.loadingContainer} ${
          theme === "dark" ? style.darkTheme : style.lightTheme
        }`}
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${style.errorContainer} ${
          theme === "dark" ? style.darkTheme : style.lightTheme
        }`}
      >
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`${style.problemContainer} ${
        theme === "dark" ? style.darkTheme : style.lightTheme
      }`}
    >
      {/* Header */}
      <header className={style.problemHeader}>
        <div className={style.headerLeft}>
          <button className={style.backButton} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className={style.problemTitle}>{data.title}</h1>
          <span
            className={`${style.difficultyBadge} ${getDifficultyColor(
              data.difficulty
            )}`}
          >
            {data.difficulty}
          </span>
        </div>
        <div className={style.headerRight}>
          <button
            className={`${style.headerButton} ${style.runButton}`}
            onClick={handleRunCode}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Running..." : "Run"}
          </button>
          <button
            className={`${style.headerButton} ${style.submitButton}`}
            onClick={handleSubmitCode}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </header>

      {/* Main content with 3-panel layout */}
      <main className={style.problemMain}>
        {/* Left Panel - Problem Description */}
        <section ref={leftPanelRef} className={style.leftPanel}>
          <div className={style.panelHeader}>
            <div className={style.tabContainer}>
              <button
                className={`${style.tab} ${
                  activeTab === "description" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`${style.tab} ${
                  activeTab === "solution" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("solution")}
              >
                Solution
              </button>
              <button
                className={`${style.tab} ${
                  activeTab === "discussion" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("discussion")}
              >
                Discussion
              </button>
            </div>
          </div>

          <div className={style.panelContent}>
            {activeTab === "description" && (
              <div className={style.descriptionContent}>
                <div className={style.descriptionText}>
                  {data.description.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>

                <div className={style.problemStats}>
                  <h3>Problem Stats</h3>
                  <div className={style.statsGrid}>
                    <div className={style.statItem}>
                      <span className={style.statLabel}>Acceptance Rate</span>
                      <span className={style.statValue}>
                        {data.acceptanceRate}%
                      </span>
                    </div>
                    <div className={style.statItem}>
                      <span className={style.statLabel}>Submissions</span>
                      <span className={style.statValue}>
                        {data.submissions.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className={style.topicsSection}>
                    <h4>Related Topics</h4>
                    <div className={style.topicsList}>
                      {data.topics.map((topic, index) => (
                        <span key={index} className={style.topicTag}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={style.companiesSection}>
                    <h4>Companies</h4>
                    <div className={style.companiesList}>
                      {data.companies.map((company, index) => (
                        <span key={index} className={style.companyTag}>
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "solution" && (
              <div className={style.solutionContent}>
                <h3>Solution</h3>
                <p>Solution content will be displayed here...</p>
              </div>
            )}

            {activeTab === "discussion" && (
              <div className={style.discussionContent}>
                <h3>Discussion</h3>
                <p>Discussion content will be displayed here...</p>
              </div>
            )}
          </div>
        </section>

        {/* Vertical Resizer */}
        <div
          ref={verticalResizerRef}
          className={`${style.verticalResizer} ${
            isDraggingVertical ? style.dragging : ""
          }`}
          onMouseDown={handleVerticalMouseDown}
        >
          <FontAwesomeIcon icon={faGripLines} />
        </div>

        {/* Right Panel - Code Editor and Test Cases */}
        <section ref={rightPanelRef} className={style.rightPanel}>
          {/* Top Right - Code Editor */}
          <section ref={codePanelRef} className={style.codePanel}>
            <div className={style.codeHeader}>
              <div className={style.languageSelector}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={style.languageSelect}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div className={style.codeControls}>
                <span className={style.fontSizeDisplay}>
                  Font: {fontSize}px
                </span>
                <button
                  className={style.fontSizeButton}
                  onClick={() => setFontSize((prev) => Math.max(10, prev - 1))}
                >
                  A-
                </button>
                <button
                  className={style.fontSizeButton}
                  onClick={() => setFontSize((prev) => Math.min(20, prev + 1))}
                >
                  A+
                </button>
              </div>
            </div>

            <div className={style.codeEditorContainer}>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                fontSize={fontSize}
                theme={theme}
              />
            </div>
          </section>

          {/* Horizontal Resizer */}
          <div
            ref={horizontalResizerRef}
            className={`${style.horizontalResizer} ${
              isDraggingHorizontal ? style.dragging : ""
            }`}
            onMouseDown={handleHorizontalMouseDown}
          >
            <FontAwesomeIcon icon={faGripVertical} />
          </div>

          {/* Bottom Right - Test Cases & Results */}
          <section ref={testCasesPanelRef} className={style.testCasesPanel}>
            <div className={style.testCasesHeader}>
              <div className={style.tabContainer}>
                <button
                  className={`${style.tab} ${
                    testCaseMode === "test" ? style.activeTab : ""
                  }`}
                  onClick={() => setTestCaseMode("test")}
                >
                  Test Cases
                </button>
                <button
                  className={`${style.tab} ${
                    testCaseMode === "result" ? style.activeTab : ""
                  }`}
                  onClick={() => setTestCaseMode("result")}
                >
                  Results
                </button>
              </div>
            </div>

            <div className={style.testCasesContent}>
              {testCaseMode === "test" && (
                <div className={style.testCasesList}>
                  {data.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className={`${style.testCaseItem} ${
                        selectedTestCase === index ? style.selectedTestCase : ""
                      }`}
                      onClick={() => setSelectedTestCase(index)}
                    >
                      <div className={style.testCaseHeader}>
                        <span className={style.testCaseNumber}>
                          Test Case {index + 1}
                        </span>
                      </div>
                      <div className={style.testCaseDetails}>
                        <div className={style.testCaseInput}>
                          <strong>Input:</strong>
                          <pre>{JSON.stringify(testCase.input, null, 2)}</pre>
                        </div>
                        <div className={style.testCaseExpected}>
                          <strong>Expected:</strong>
                          <pre>
                            {JSON.stringify(testCase.expected, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {testCaseMode === "result" && (
                <div className={style.resultsContent}>
                  {executionResults.length > 0 ? (
                    <div className={style.resultsList}>
                      {executionResults.map((result, index) => (
                        <div key={index} className={style.resultItem}>
                          <div className={style.resultHeader}>
                            <span className={style.resultNumber}>
                              Test Case {index + 1}
                            </span>
                            <span
                              className={`${
                                style.resultStatus
                              } ${getStatusColor(result.status)}`}
                            >
                              {result.status}
                            </span>
                          </div>
                          <div className={style.resultDetails}>
                            <div className={style.resultInput}>
                              <strong>Input:</strong>
                              <pre>{JSON.stringify(result.input, null, 2)}</pre>
                            </div>
                            <div className={style.resultOutput}>
                              <strong>Output:</strong>
                              <pre>
                                {JSON.stringify(result.output, null, 2)}
                              </pre>
                            </div>
                            <div className={style.resultExpected}>
                              <strong>Expected:</strong>
                              <pre>
                                {JSON.stringify(result.expected, null, 2)}
                              </pre>
                            </div>
                            <div className={style.executionStats}>
                              <span className={style.executionStat}>
                                Time: {result.executionTime?.toFixed(2)}ms
                              </span>
                              <span className={style.executionStat}>
                                Memory: {result.memory?.toFixed(2)}MB
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={style.emptyState}>
                      <h3>No Results Yet</h3>
                      <p>Run your code to see the execution results here.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default ProblemModern;
