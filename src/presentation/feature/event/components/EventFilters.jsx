import React from 'react';
import { cn } from '@core/utils/cn';
import { Layers, Monitor, Map, Cpu } from 'lucide-react';

/**
 * EventFilters: Sidebar navigation for event categorization.
 */
export const EventFilters = ({ activeFilter = 'all', onFilterChange, className }) => {
    const filters = [
        { id: 'all', label: 'All Events', icon: Layers },
        { id: 'webinar', label: 'Webinars', icon: Monitor },
        { id: 'workshop', label: 'Workshops', icon: Cpu },
        { id: 'physical', label: 'Physical', icon: Map },
    ];

    return (
        <div className={cn(
            "flex flex-col gap-2 p-4 bg-background border border-border-subtle rounded-3xl h-fit sticky top-28",
            className
        )}>
            <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mb-4 px-2">Refine Events</h3>
            
            <div className="flex flex-col gap-1">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;
                    
                    return (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange?.(filter.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group text-left",
                                isActive 
                                    ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20" 
                                    : "text-text-muted hover:bg-surface hover:text-text-primary border border-transparent"
                            )}
                        >
                            <Icon size={18} className={cn(isActive ? "text-accent-primary" : "text-text-muted")} />
                            <span className="text-sm font-medium">{filter.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-border-subtle/50 px-2 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-text-muted uppercase">My Schedule</span>
                    <button className="text-xs text-accent-primary hover:underline text-left mt-1">View Registered Events</button>
                </div>
            </div>
        </div>
    );
};
