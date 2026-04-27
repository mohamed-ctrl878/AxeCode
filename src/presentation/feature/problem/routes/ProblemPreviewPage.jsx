import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchProblem } from '@domain/useCase/useFetchProblem';
import { useRunCode } from '@domain/useCase/useRunCode';
import { useSubmitCode } from '@domain/useCase/useSubmitCode';
import { useFetchProblemSubmissions } from '@domain/useCase/useFetchProblemSubmissions';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from '@core/utils/cn';

// Composed sub-components (SRP)
import { ProblemWorkspaceHeader } from '../components/ProblemWorkspaceHeader';
import { ProblemDescription } from '../components/ProblemDescription';
import { ProblemComments } from '../components/ProblemComments';
import { ProblemSubmissions } from '../components/ProblemSubmissions';
import { useConfirm } from '@presentation/shared/provider/ConfirmationProvider';
import { ProblemEditor } from '../components/ProblemEditor';
import { ProblemTestCases } from '../components/ProblemTestCases';
import { ProblemResult } from '../components/ProblemResult';
import { ReportingDialog } from '@presentation/shared/components/interactions/ReportingDialog';

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
    const { confirm } = useConfirm();

    // --- Domain UseCases ---
    const { runCode, result: runResult, running: isRunning, error: runError } = useRunCode();
    const { submitCode, result: submitResult, submitting: isSubmitting, error: submitError } = useSubmitCode();
    const { fetchSubmissions, submissions, loadingSubmissions } = useFetchProblemSubmissions();

    // --- Local UI State ---
    const [leftTab, setLeftTab] = useState('description');
    const [rightTab, setRightTab] = useState('testcases');
    
    // Editor code and state
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    
    // Editor UI tabs
    const [editorTab, setEditorTab] = useState('solution'); // 'solution' | 'submission_view'
    const [viewedSubmission, setViewedSubmission] = useState(null);

    const [activeTestCase, setActiveTestCase] = useState(0);
    const [displayResult, setDisplayResult] = useState(null);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

    // Resizable column width (percentage for left column)
    const [leftWidth, setLeftWidth] = useState(45);
    const [isDragging, setIsDragging] = useState(false);

    // Fetch problem on mount
    useEffect(() => {
        if (id) fetchProblem(id);
    }, [id, fetchProblem]);

    // Load starter code from local storage or templates when problem/language loads
    useEffect(() => {
        if (!problem?.uid) return;
        
        const localKey = `axe_code_${problem.uid}_${language}`;
        const savedCode = localStorage.getItem(localKey);
        
        if (savedCode) {
            setCode(savedCode);
        } else if (problem?.codeTemplates?.length > 0) {
            const template = problem.codeTemplates.find(t => t.language === language)
                || problem.codeTemplates[0];
            if (template) {
                setCode(template.starterCode || '');
                // setLanguage(template.language || 'javascript'); // Language is already defined, keep it or let template override if not matching
            }
        }
    }, [problem?.uid, language, problem?.codeTemplates]);

    // Auto-save code to local storage when it changes
    useEffect(() => {
        if (!problem?.uid || !code) return;
        
        const localKey = `axe_code_${problem.uid}_${language}`;
        localStorage.setItem(localKey, code);
    }, [code, language, problem?.uid]);

    // Sync UseCase results to display state
    useEffect(() => {
        if (runResult) setDisplayResult(runResult);
    }, [runResult]);

    useEffect(() => {
        if (submitResult) {
            setDisplayResult(submitResult);
            // Re-fetch submissions when a new submission completes
            if (problem?.uid) fetchSubmissions(problem.uid);
        }
    }, [submitResult, problem?.uid, fetchSubmissions]);

    // Fetch submissions when problem loads or tab opens
    useEffect(() => {
        if (problem?.uid && leftTab === 'submissions') {
            fetchSubmissions(problem.uid);
        }
    }, [problem?.uid, leftTab, fetchSubmissions]);

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
        setIsReportDialogOpen(true);
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
                                        : 'text-text-muted border-transparent hover:text-text-primary hover:bg-surface-light'
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
                            <div className="relative h-full">
                                {loadingSubmissions && (
                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm">
                                        <Loader2 size={24} className="animate-spin text-accent-primary" />
                                    </div>
                                )}
                                <ProblemSubmissions 
                                    submissions={submissions} 
                                    onLoadSubmission={(sub) => {
                                        if (sub.code) {
                                            setViewedSubmission(sub);
                                            setEditorTab('submission_view');
                                        }
                                    }}
                                />
                            </div>
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
                    <div className="flex-[3] flex flex-col overflow-hidden bg-surface">
                        {/* Editor Tabs bar */}
                        <div className="flex bg-surface-dark border-b border-border-subtle shrink-0">
                            <button 
                                onClick={() => setEditorTab('solution')}
                                className={cn("px-4 py-2 text-xs font-bold transition-all border-b-2", editorTab === 'solution' ? "text-accent-primary border-accent-primary bg-accent-primary/5" : "text-text-muted border-transparent hover:bg-surface-light")}
                            >
                                Solution
                            </button>
                            {viewedSubmission && (
                                <div className={cn("flex items-center gap-2 pl-4 pr-2 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer group", editorTab === 'submission_view' ? "text-accent-primary border-accent-primary bg-accent-primary/5" : "text-text-muted border-transparent hover:bg-surface-light")} onClick={() => setEditorTab('submission_view')}>
                                    <span>Submission #{viewedSubmission.id}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setViewedSubmission(null); setEditorTab('solution'); }}
                                        className="p-1 rounded opacity-50 hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                                        title="Close submission view"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Editor Content Area */}
                        <div className="flex-1 overflow-hidden p-2">
                            {editorTab === 'solution' ? (
                                <ProblemEditor
                                    codeTemplates={problem.codeTemplates}
                                    code={code}
                                    language={language}
                                    onCodeChange={setCode}
                                    onLanguageChange={setLanguage}
                                    onResetCode={async () => {
                                        const ok = await confirm({
                                            title: 'Reset Original State',
                                            message: 'Are you sure you want to restore the starting manuscript template? This will permanently expunge your current session progress.',
                                            confirmLabel: 'Reset Code',
                                            type: 'warning'
                                        });

                                        if (ok) {
                                            const template = problem.codeTemplates?.find(t => t.language === language) || problem.codeTemplates?.[0];
                                            if (template) {
                                                setCode(template.starterCode);
                                                localStorage.removeItem(`axe_code_${problem?.uid}_${language}`);
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <ProblemEditor
                                    codeTemplates={[]}
                                    code={viewedSubmission?.code}
                                    language={viewedSubmission?.language}
                                    isReadOnly={true}
                                />
                            )}
                        </div>
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
                                            : 'text-text-muted border-transparent hover:text-text-primary hover:bg-surface-light'
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
            
            <ReportingDialog
                isOpen={isReportDialogOpen}
                onClose={() => setIsReportDialogOpen(false)}
                docId={problem.uid}
                contentType="problem"
            />
        </div>
    );
};

export default ProblemPreviewPage;
