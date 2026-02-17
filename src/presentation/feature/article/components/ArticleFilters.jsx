import React from 'react';
import { cn } from '@core/utils/cn';
import { TrendingUp, Compass, UserCheck } from 'lucide-react';

/**
 * ArticleFilters: Side panel for categorizing and filtering formal content.
 * Follows Antigravity minimalist aesthetic with clear active states.
 */
export const ArticleFilters = ({ activeFilter = 'explore', onFilterChange, className }) => {
    const filters = [
        { id: 'top', label: 'Top Rated', icon: TrendingUp },
        { id: 'explore', label: 'Explore', icon: Compass },
        { id: 'related', label: 'Related by me', icon: UserCheck },
    ];

    return (
        <div className={cn(
            "flex flex-col gap-2 p-4 bg-background border border-border-subtle rounded-3xl h-fit sticky top-28",
            className
        )}>
            <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mb-4 px-2">Navigation</h3>
            
            <div className="flex flex-col gap-1">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;
                    
                    return (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange?.(filter.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                isActive 
                                    ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20" 
                                    : "text-text-muted hover:bg-surface hover:text-text-primary border border-transparent"
                            )}
                        >
                            <Icon 
                                size={18} 
                                className={cn(
                                    "transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-accent-primary" : "text-text-muted"
                                )} 
                            />
                            <span className="text-sm font-medium">{filter.label}</span>
                            
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-primary glow-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-border-subtle/50">
                <div className="p-4 rounded-2xl bg-surface-dark border border-border-subtle flex flex-col gap-3">
                    <p className="text-[10px] font-mono text-accent-primary uppercase tracking-widest">Contribute</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                        Share your knowledge with the AxCode community.
                    </p>
                    <button className="w-full bg-white text-black py-2 rounded-xl text-xs font-bold hover:scale-[1.02] transition-transform">
                        Write Article
                    </button>
                </div>
            </div>
        </div>
    );
};
