import React, { useState } from 'react';
import { Play, Send, Flag, ChevronDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserMenu } from '../../../shared/components/layout/header/UserMenu';
import { cn } from '@core/utils/cn';

/**
 * ProblemWorkspaceHeader - Clean top bar for the problem workspace.
 * Left: Problem title (clickable dropdown). Center: Run + Submit + Report. 
 * Pure presentational — receives handlers via props.
 *
 * @param {{ title: string, problems: Array, onRun: Function, onSubmit: Function, onReport: Function, onProblemSelect: Function, isRunning: boolean, isSubmitting: boolean }} props
 */
export const ProblemWorkspaceHeader = ({
    title,
    problems = [],
    onRun,
    onSubmit,
    onReport,
    onProblemSelect,
    isRunning = false,
    isSubmitting = false
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);

    return (
        <div className="w-full h-14 bg-surface border-b border-border-subtle flex items-center justify-between px-4 shrink-0 z-50">
            {/* Left: Back Button + Problem Title Dropdown */}
            <div className="relative flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-surface-light rounded-lg transition-colors text-text-muted hover:text-text-primary"
                    title="Go Back"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 text-sm font-bold text-text-primary hover:text-accent-primary transition-colors"
                    >
                        <span className="truncate max-w-[200px]">{title || 'Select Problem'}</span>
                    <ChevronDown size={14} className={cn(
                        "transition-transform",
                        dropdownOpen && "rotate-180"
                    )} />
                </button>

                {dropdownOpen && problems.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-surface border border-border-subtle rounded-xl shadow-2xl z-50 animate-slide-up">
                        {problems.map((p, i) => (
                            <button
                                key={p.documentId || i}
                                onClick={() => {
                                    onProblemSelect?.(p.documentId);
                                    setDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-surface-light border-b border-border-subtle/50 last:border-b-0 transition-colors flex items-center justify-between"
                            >
                                <span className="text-text-primary truncate">{p.title}</span>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                    p.difficulty === 'easy' && "text-green-400 bg-green-400/10",
                                    p.difficulty === 'medium' && "text-amber-400 bg-amber-400/10",
                                    p.difficulty === 'hard' && "text-red-400 bg-red-400/10"
                                )}>{p.difficulty}</span>
                            </button>
                        ))}
                    </div>
                    )}
                </div>
            </div>

            {/* Center: Run + Submit + Report */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onRun}
                    disabled={isRunning}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        "bg-surface-dark border border-border-subtle text-text-primary hover:border-accent-primary hover:text-accent-primary",
                        isRunning && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Play size={12} fill="currentColor" />
                    {isRunning ? 'Running...' : 'Run'}
                </button>

                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        "bg-accent-primary text-background hover:bg-accent-hover shadow-[0_0_12px_rgba(52,211,153,0.2)]",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Send size={12} />
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>

                <button
                    onClick={onReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-text-muted hover:text-amber-400 hover:bg-amber-400/10 border border-transparent hover:border-amber-400/20 transition-all"
                >
                    <Flag size={12} />
                    Report
                </button>
            </div>

            {/* Right: User Profile Dropdown */}
            <div className="flex items-center justify-end w-[200px]">
                <UserMenu user={user} />
            </div>
        </div>
    );
};
