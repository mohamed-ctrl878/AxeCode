import React from 'react';
import { Search, Command } from 'lucide-react';

/**
 * SearchTerminal: Extracted search bar component for the Header.
 * Handles the visual representation of the global search input.
 */
export const SearchTerminal = () => {
    return (
        <div className="flex-1 max-w-xl">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search for courses, problems, or events..." 
                    className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2 pl-10 pr-12 text-sm focus:border-accent-primary outline-none transition-all placeholder:text-text-muted/50 focus:bg-surface-dark"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-border-subtle/50 px-1.5 py-0.5 rounded border border-white/5">
                    <Command size={10} className="text-text-muted" />
                    <span className="text-[10px] font-mono text-text-muted">K</span>
                </div>
            </div>
        </div>
    );
};
