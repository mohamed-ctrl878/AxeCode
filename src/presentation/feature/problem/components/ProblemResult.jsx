import React from 'react';
import { cn } from '@core/utils/cn';
import { CheckCircle2, XCircle, Clock, Loader2, FileText } from 'lucide-react';

const renderJudgeOutput = (output) => {
    if (!output) return null;

    if (typeof output === 'string') {
        return <div className="text-sm font-mono text-text-primary whitespace-pre-wrap p-3 bg-[#1e1e2e] rounded-lg border border-border-subtle">{output}</div>;
    }

    if (output.error) {
        return (
            <div className="text-red-400 font-mono text-xs whitespace-pre-wrap p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                {output.error}
            </div>
        );
    }

    if (Array.isArray(output.results)) {
        return (
            <div className="flex flex-col gap-3">
                {output.results.map((res, i) => {
                    const isPass = res.verdict === 'accepted';
                    return (
                        <div key={i} className="flex flex-col gap-2 p-3 bg-surface border border-white/5 rounded-lg">
                            <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-1">
                                <span className={cn(
                                    "text-xs font-bold uppercase",
                                    isPass ? "text-green-400" : "text-red-400"
                                )}>
                                    Test Case {i + 1}: {res.verdict?.replace(/_/g, ' ')}
                                </span>
                                <div className="flex items-center gap-4 text-[10px] text-text-muted">
                                    <span className="flex items-center gap-1"><Clock size={10} /> {res.time}ms</span>
                                    <span>{res.memory >= 1024 ? `${(res.memory / 1024).toFixed(1)}MB` : `${res.memory}KB`}</span>
                                </div>
                            </div>

                            {/* Show Error Trace */}
                            {res.error && (
                                <div className="p-2 bg-red-500/5 rounded text-red-300 font-mono text-[10px] whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                                    {res.error}
                                </div>
                            )}

                            {/* Actual Return Value (Result) */}
                            {res.actualOutput !== undefined && res.actualOutput !== null && (
                                <div className="space-y-1 mt-1">
                                    <div className="text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1">Result:</div>
                                    <div className={cn(
                                        "p-2 bg-[#1e1e2e] rounded text-xs font-mono border",
                                        isPass ? "border-green-500/20 text-green-300" : "border-red-500/20 text-red-300"
                                    )}>
                                        {JSON.stringify(res.actualOutput)}
                                    </div>
                                </div>
                            )}

                            {/* Standard Output Logs (User Prints) */}
                            {res.userStdout && typeof res.userStdout === 'string' && res.userStdout.trim() !== '' && (
                                <div className="space-y-1 mt-1">
                                    <div className="text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1"><FileText size={10} /> Stdout:</div>
                                    <div className="p-2 bg-text-primary/5 rounded text-[10px] text-text-muted font-mono whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar">
                                        {res.userStdout}
                                    </div>
                                </div>
                            )}

                            {/* Expected Output */}
                            {res.expectedOutput !== undefined && res.expectedOutput !== null && (
                                <div className="space-y-1 mt-1">
                                    <div className="text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1">Expected:</div>
                                    <div className="p-2 bg-white/5 rounded text-xs font-mono border border-white/5 text-text-muted">
                                        {JSON.stringify(res.expectedOutput)}
                                    </div>
                                </div>
                            )}

                            {/* Fallback for legacy stdout if userStdout is missing */}
                            {!res.userStdout && res.stdout && typeof res.stdout === 'string' && res.stdout.trim() !== '' && !res.stdout.includes('AXECODE') && (
                                <div className="space-y-1 mt-1">
                                    <div className="text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1"><FileText size={10} /> Stdout:</div>
                                    <div className="p-2 bg-text-primary/5 rounded text-[10px] text-text-muted font-mono whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar">
                                        {res.stdout}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Fallback for unknown object shapes
    return (
        <div className="p-3 bg-[#1e1e2e] rounded-lg text-sm font-mono text-text-primary border border-border-subtle whitespace-pre-wrap">
            {JSON.stringify(output, null, 2)}
        </div>
    );
};

/**
 * ProblemResult - Displays run/submit execution results.
 * Tab under the editor panel.
 *
 * @param {{ result: object|null, isLoading: boolean }} props
 */
export const ProblemResult = ({ result = null, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full gap-3">
                <Loader2 size={20} className="animate-spin text-accent-primary" />
                <span className="text-sm text-text-muted font-mono">Executing...</span>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-text-muted p-6">
                Click Run or Submit to see results here.
            </div>
        );
    }

    const isAccepted = result.verdict === 'accepted';
    const isError = ['wrong_answer', 'runtime_error', 'compile_error'].includes(result.verdict);

    return (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full custom-scrollbar">
            {/* Verdict Banner */}
            <div className={cn(
                "flex items-center gap-3 p-4 rounded-xl border",
                isAccepted && "bg-green-400/10 border-green-400/20",
                isError && "bg-red-400/10 border-red-400/20",
                !isAccepted && !isError && "bg-amber-400/10 border-amber-400/20"
            )}>
                {isAccepted ? (
                    <CheckCircle2 size={24} className="text-green-400" />
                ) : (
                    <XCircle size={24} className={isError ? "text-red-400" : "text-amber-400"} />
                )}
                <div>
                    <div className={cn(
                        "text-sm font-bold uppercase",
                        isAccepted ? "text-green-400" : isError ? "text-red-400" : "text-amber-400"
                    )}>
                        {result.verdict?.replace(/_/g, ' ')}
                    </div>
                    {result.testCasesPassed != null && (
                        <div className="text-[10px] text-text-muted font-mono mt-1">
                            {result.testCasesPassed}/{result.totalTestCases} test cases passed
                        </div>
                    )}
                </div>
            </div>

            {/* Performance Stats */}
            <div className="flex items-center gap-6">
                {result.executionTime != null && (
                    <div className="flex items-center gap-2 text-xs">
                        <Clock size={14} className="text-text-muted" />
                        <span className="text-text-muted">Runtime:</span>
                        <span className="font-bold text-text-primary">{result.executionTime}ms</span>
                    </div>
                )}
                {result.memoryUsed != null && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-text-muted">Memory:</span>
                        <span className="font-bold text-text-primary">
                            {result.memoryUsed >= 1024 
                                ? `${(result.memoryUsed / 1024).toFixed(1)}MB` 
                                : `${result.memoryUsed}KB`}
                        </span>
                    </div>
                )}
            </div>

            {/* Judge Output / Error */}
            {result.judgeOutput && (
                <div className="space-y-2 mt-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted pl-1">Execution Details</label>
                    <div className="w-full">
                        {renderJudgeOutput(result.judgeOutput)}
                    </div>
                </div>
            )}
        </div>
    );
};
