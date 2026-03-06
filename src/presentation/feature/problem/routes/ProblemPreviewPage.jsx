import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchProblem } from '@domain/useCase/useFetchProblem';
import { useRunCode } from '@domain/useCase/useRunCode';
import { useSubmitCode } from '@domain/useCase/useSubmitCode';
import { Loader2, AlertCircle } from 'lucide-react';

// Composed sub-components (SRP)
import { ProblemWorkspaceHeader } from '../components/ProblemWorkspaceHeader';
import { ProblemDescription } from '../components/ProblemDescription';
import { ProblemComments } from '../components/ProblemComments';
import { ProblemSubmissions } from '../components/ProblemSubmissions';
import { ProblemEditor } from '../components/ProblemEditor';
import { ProblemTestCases } from '../components/ProblemTestCases';
import { ProblemResult } from '../components/ProblemResult';

/**
 * ProblemPreviewPage - Full-screen LeetCode-style workspace.
 * Orchestrates state and composes sub-components.
 * Layout: Custom Header + 2-column resizable grid.
 * Col 1 (Left): 3 tabs (Description | Comments | Submissions)
 * Col 2 (Right): Editor (top) + 2 tabs (TestCases | Result) (bottom)
 */
const ProblemPreviewPage = () => {
    const { id } = useParams();
    const { fetchProblem, problem, loading, error } = useFetchProblem();

    // --- Domain UseCases ---
    const { runCode, result: runResult, running: isRunning, error: runError } = useRunCode();
    const { submitCode, result: submitResult, submitting: isSubmitting, error: submitError } = useSubmitCode();

    // --- Local UI State ---
    const [leftTab, setLeftTab] = useState('description');
    const [rightTab, setRightTab] = useState('testcases');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [activeTestCase, setActiveTestCase] = useState(0);
    const [displayResult, setDisplayResult] = useState(null);

    // Resizable column width (percentage for left column)
    const [leftWidth, setLeftWidth] = useState(45);
    const [isDragging, setIsDragging] = useState(false);

    // Fetch problem on mount
    useEffect(() => {
        if (id) fetchProblem(id);
    }, [id, fetchProblem]);

    // Load starter code from first template when problem loads
    useEffect(() => {
        if (problem?.codeTemplates?.length > 0) {
            const template = problem.codeTemplates.find(t => t.language === language)
                || problem.codeTemplates[0];
            if (template) {
                setCode(template.starterCode || '');
                setLanguage(template.language || 'javascript');
            }
        }
    }, [problem]);

    // Sync UseCase results to display state
    useEffect(() => {
        if (runResult) setDisplayResult(runResult);
    }, [runResult]);

    useEffect(() => {
        if (submitResult) setDisplayResult(submitResult);
    }, [submitResult]);

    // --- Resizable Drag Handlers ---
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth >= 25 && newWidth <= 75) {
                setLeftWidth(newWidth);
            }
        };

        const handleMouseUp = () => setIsDragging(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // --- Action Handlers (Delegating to Domain UseCases) ---
    const handleRun = async () => {
        setRightTab('result');
        setDisplayResult(null);
        await runCode({ problemId: problem.uid, code, language });
    };

    const handleSubmit = async () => {
        setRightTab('result');
        setDisplayResult(null);
        await submitCode({ problemId: problem.uid, code, language });
    };

    const handleReport = () => {
        // TODO: Report modal
        alert('Report feature coming soon.');
    };

    const handleLike = () => {
        // TODO: Integrate with like API
    };

    // --- Loading / Error States ---
    if (loading) {
        return (
            <div className="fixed inset-0  flex items-center justify-center bg-background z-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin text-accent-primary" />
                    <span className="text-xs text-text-muted font-mono uppercase tracking-widest">Loading Problem...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                <div className="flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle size={20} />
                    <span>{error?.message || 'Failed to load problem'}</span>
                </div>
            </div>
        );
    }

    if (!problem) return null;

    // --- Tab Configs ---
    const leftTabs = [
        { id: 'description', label: 'Description' },
        { id: 'comments', label: 'Comments' },
        { id: 'submissions', label: 'Submissions' },
    ];

    const rightTabs = [
        { id: 'testcases', label: 'Test Cases' },
        { id: 'result', label: 'Result' },
    ];

    return (
        <div className="fixed inset-0 flex flex-col bg-background z-40">
            {/* Workspace Header */}
            <ProblemWorkspaceHeader
                title={problem.title}
                problems={[]}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onReport={handleReport}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
            />

            {/* Main Workspace Grid */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Tabs */}
                <div
                    className="flex flex-col border-r border-border-subtle overflow-hidden"
                    style={{ width: `${leftWidth}%` }}
                >
                    {/* Tab Bar */}
                    <div className="flex items-center gap-0 border-b border-border-subtle bg-surface shrink-0">
                        {leftTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setLeftTab(tab.id)}
                                className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                                    leftTab === tab.id
                                        ? 'text-accent-primary border-accent-primary bg-accent-primary/5'
                                        : 'text-text-muted border-transparent hover:text-text-primary hover:bg-white/5'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden">
                        {leftTab === 'description' && (
                            <ProblemDescription problem={problem} onLike={handleLike} />
                        )}
                        {leftTab === 'comments' && (
                            <ProblemComments problemId={problem.uid} />
                        )}
                        {leftTab === 'submissions' && (
                            <ProblemSubmissions submissions={[]} />
                        )}
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`w-1 cursor-col-resize hover:bg-accent-primary/50 transition-colors shrink-0 ${
                        isDragging ? 'bg-accent-primary' : 'bg-border-subtle'
                    }`}
                />

                {/* Right Column: Editor + Bottom Tabs */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Top: Code Editor (60%) */}
                    <div className="flex-[3] overflow-hidden p-2">
                        <ProblemEditor
                            codeTemplates={problem.codeTemplates}
                            code={code}
                            language={language}
                            onCodeChange={setCode}
                            onLanguageChange={setLanguage}
                        />
                    </div>

                    {/* Bottom: Test Cases / Result Tabs (40%) */}
                    <div className="flex-[2] flex flex-col border-t border-border-subtle overflow-hidden">
                        {/* Tab Bar */}
                        <div className="flex items-center gap-0 border-b border-border-subtle bg-surface shrink-0">
                            {rightTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setRightTab(tab.id)}
                                    className={`px-4 py-2 text-xs font-bold transition-all border-b-2 ${
                                        rightTab === tab.id
                                            ? 'text-accent-primary border-accent-primary bg-accent-primary/5'
                                            : 'text-text-muted border-transparent hover:text-text-primary hover:bg-white/5'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-hidden">
                            {rightTab === 'testcases' && (
                                <ProblemTestCases
                                    testCases={problem.testCases}
                                    activeCase={activeTestCase}
                                    onSelectCase={setActiveTestCase}
                                />
                            )}
                            {rightTab === 'result' && (
                                <ProblemResult result={displayResult} isLoading={isRunning || isSubmitting} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPreviewPage;
