import React from 'react';
import { RichBlocksPreviewer } from '@presentation/shared/components/RichBlocksPreviewer';
import { Heart, Tag } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * ProblemDescription - Tab 1 content for problem details.
 * Displays title, difficulty, topics, description blocks, constraints, and stats.
 * Pure presentational component.
 *
 * @param {{ problem: ProblemEntity, onLike: Function }} props
 */
export const ProblemDescription = ({ problem, onLike }) => {
    if (!problem) return null;

    const difficultyStyles = {
        easy: 'text-green-400 bg-green-400/10 border-green-400/20',
        medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        hard: 'text-red-400 bg-red-400/10 border-red-400/20'
    };

    return (
        <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full custom-scrollbar">
            {/* Title & Difficulty */}
            <div className="flex flex-col gap-3">
                <h1 className="text-xl font-bold text-text-primary">{problem.title}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase border",
                        difficultyStyles[problem.difficulty?.toLowerCase()] || difficultyStyles.easy
                    )}>
                        {problem.difficulty}
                    </span>

                    {problem.submissionStatus && problem.submissionStatus !== 'New' && (
                        <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase border",
                            problem.submissionStatus === 'Solved'
                                ? "text-accent-primary bg-accent-primary/10 border-accent-primary/20"
                                : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                        )}>
                            {problem.submissionStatus}
                        </span>
                    )}
                </div>
            </div>

            {/* Topics / Tags */}
            {(problem.problemTypes?.length > 0 || problem.tags?.length > 0) && (
                <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={12} className="text-text-muted" />
                    {problem.problemTypes?.map(pt => (
                        <span key={pt.id} className="px-2 py-1 text-[10px] font-mono bg-surface-dark border border-border-subtle rounded-md text-text-muted">
                            {pt.name}
                        </span>
                    ))}
                    {problem.tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-1 text-[10px] font-mono bg-surface-dark border border-border-subtle rounded-md text-text-muted">
                            {typeof tag === 'string' ? tag : tag.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Description */}
            {problem.description && (
                <div className="prose-dark">
                    <RichBlocksPreviewer content={problem.description} />
                </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
                <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Constraints</h3>
                    <div className="p-4 bg-surface-dark border border-border-subtle rounded-xl text-sm text-text-secondary font-mono whitespace-pre-wrap">
                        {problem.constraints}
                    </div>
                </div>
            )}

            {/* Examples */}
            {problem.examples?.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Examples</h3>
                    {problem.examples.map((ex, i) => (
                        <div key={i} className="p-4 bg-surface-dark border border-border-subtle rounded-xl space-y-2">
                            <div className="text-[10px] font-bold text-accent-primary uppercase">Example {i + 1}</div>
                            <div className="text-sm font-mono">
                                <span className="text-text-muted">Input: </span>
                                <span className="text-text-primary">{JSON.stringify(ex.input)}</span>
                            </div>
                            <div className="text-sm font-mono">
                                <span className="text-text-muted">Output: </span>
                                <span className="text-text-primary">{JSON.stringify(ex.output || ex.expectedOutput)}</span>
                            </div>
                            {ex.explanation && (
                                <div className="text-sm text-text-muted mt-1">
                                    <span className="font-bold">Explanation: </span>{ex.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Stats & Like */}
            <div className="flex items-center gap-4 pt-4 border-t border-border-subtle">
                <button
                    onClick={onLike}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                        problem.isLiked
                            ? "text-pink-400 bg-pink-400/10 border-pink-400/20"
                            : "text-text-muted bg-surface-dark border-border-subtle hover:text-pink-400 hover:border-pink-400/20"
                    )}
                >
                    <Heart size={14} fill={problem.isLiked ? "currentColor" : "none"} />
                    {problem.likesCount || 0}
                </button>

                <div className="text-[10px] text-text-muted font-mono">
                    <span className="text-text-secondary">{problem.commentsCount || 0}</span> comments
                </div>

                {problem.timeLimit && (
                    <div className="text-[10px] text-text-muted font-mono">
                        Time: <span className="text-text-secondary">{problem.timeLimit}ms</span>
                    </div>
                )}

                {problem.memoryLimit && (
                    <div className="text-[10px] text-text-muted font-mono">
                        Memory: <span className="text-text-secondary">{Math.round(problem.memoryLimit / 1024)}KB</span>
                    </div>
                )}
            </div>
        </div>
    );
};
