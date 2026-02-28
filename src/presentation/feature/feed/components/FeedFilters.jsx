import React from 'react';
import { cn } from '@core/utils/cn';
import { Sparkles, Flame } from 'lucide-react';

/**
 * FeedFilters: Sidebar navigation for feed discovery.
 * Minimalist design with interactive states.
 */
export const FeedFilters = ({ activeFilter = 'recommend', onFilterChange, className }) => {
    const filters = [
        { id: 'recommend', label: 'Recommend', icon: Sparkles },
        { id: 'trend', label: 'Trend', icon: Flame },
    ];

    return (
        <div className={cn(
            "flex flex-col gap-2 p-4 bg-background border border-border-subtle rounded-3xl h-fit",
            className
        )}>
            <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-3 px-2">Feed Discovery</h3>
            
            <div className="flex flex-col gap-1">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;
                    
                    return (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange?.(filter.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group",
                                isActive 
                                    ? "bg-accent-primary/5 text-accent-primary border border-accent-primary/20 shadow-[0_0_15px_rgba(52,211,153,0.05)]" 
                                    : "text-text-muted hover:bg-surface hover:text-text-primary border border-transparent"
                            )}
                        >
                            <Icon 
                                size={16} 
                                className={cn(
                                    "transition-transform group-hover:scale-110",
                                    isActive ? "text-accent-primary" : "text-text-muted"
                                )} 
                            />
                            <span className="text-xs font-medium">{filter.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
