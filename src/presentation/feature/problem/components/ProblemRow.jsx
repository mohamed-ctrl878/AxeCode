import React from 'react';
import { Play, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * ProblemRow: Elegant table row for coding challenges.
 * Represents CardProblemEntity with status indicators.
 */
export const ProblemRow = ({ problem }) => {
    const { title, difficulty, status } = problem;

    const getDifficultyStyles = (diff) => {
        switch (diff) {
            case 'Hard': return "text-red-500 bg-red-500/10 border-red-500/20";
            case 'Medium': return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            default: return "text-accent-primary bg-accent-primary/10 border-accent-primary/20";
        }
    };

    const getStatusIcon = (st) => {
        switch (st) {
            case 'Solved': return <CheckCircle2 size={18} className="text-accent-primary" />;
            case 'Attempted': return <AlertCircle size={18} className="text-amber-500" />;
            default: return <Circle size={18} className="text-text-muted/30" />;
        }
    };

    return (
        <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
                <div className="shrink-0">
                    {getStatusIcon(status)}
                </div>
                <div className="flex flex-col">
                    <h4 className="font-bold text-sm text-text-primary group-hover:text-accent-primary transition-colors">
                        {title}
                    </h4>
                    <span className="text-[10px] text-text-muted font-mono tracking-widest mt-1">
                        AXE-CHALLENGE-2026
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase border",
                    getDifficultyStyles(difficulty)
                )}>
                    {difficulty}
                </span>

                <button className="w-10 h-10 rounded-xl bg-surface-dark border border-white/5 flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all active:scale-90">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                </button>
            </div>
        </div>
    );
};
