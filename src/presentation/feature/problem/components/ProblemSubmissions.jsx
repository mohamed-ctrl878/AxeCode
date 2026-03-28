import React from 'react';
import { cn } from '@core/utils/cn';
import { Clock, MemoryStick, CheckCircle2, XCircle, Minus } from 'lucide-react';

/**
 * ProblemSubmissions - Tab 3: Shows user's past submissions for this problem.
 * Pure presentational list.
 *
 * @param {{ submissions: Array, onLoadSubmission: function }} props
 */
export const ProblemSubmissions = ({ submissions = [], onLoadSubmission }) => {
    const verdictStyles = {
        accepted: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2, label: 'Accepted' },
        wrong_answer: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, label: 'Wrong Answer' },
        time_limit_exceeded: { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock, label: 'TLE' },
        memory_limit_exceeded: { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: MemoryStick, label: 'MLE' },
        runtime_error: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, label: 'Runtime Error' },
        compile_error: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, label: 'Compile Error' },
        pending: { color: 'text-text-muted', bg: 'bg-surface-dark', icon: Minus, label: 'Pending' },
    };

    if (submissions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-text-muted p-8">
                No submissions yet. Write your solution and submit!
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 p-4 overflow-y-auto h-full custom-scrollbar">
            {submissions.map((sub, i) => {
                const verdict = verdictStyles[sub.verdict] || verdictStyles.pending;
                const VerdictIcon = verdict.icon;
                return (
                    <div
                        key={sub.id || i}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-sm cursor-pointer group"
                        onClick={() => onLoadSubmission && onLoadSubmission(sub)}
                        title="Click to load this submission's code"
                    >
                        <div className="flex items-center gap-3">
                            <VerdictIcon size={16} className={cn(verdict.color, "group-hover:scale-110 transition-transform")} />
                            <span className={cn("font-bold text-xs uppercase", verdict.color)}>
                                {verdict.label}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-[10px] text-text-muted font-mono">
                            <span className="uppercase">{sub.language}</span>
                            {sub.executionTime != null && <span>{sub.executionTime}ms</span>}
                            {sub.memoryUsed != null && <span>{Math.round(sub.memoryUsed / 1024)}KB</span>}
                            <span>{sub.testCasesPassed}/{sub.totalTestCases}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
