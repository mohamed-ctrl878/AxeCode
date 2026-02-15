import React, { useState } from 'react';
import { Search, Tag, X, ChevronDown } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * TagSelector: Advanced search with tag filtering.
 * Features a glassmorphic design and interactive tag cloud.
 */
export const TagSelector = ({ onSearch, onTagSelect, selectedTags = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const availableTags = [
        "Dynamic Programming", "Graph", "Greedy", "Binary Search", 
        "Tree", "Array", "String", "Math", "Backtracking", "DFS", "BFS"
    ];

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for a specific challenge..." 
                        className="w-full bg-surface-dark border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all transition-colors",
                        isOpen || selectedTags.length > 0 ? "border-accent-primary text-accent-primary bg-accent-primary/5" : "border-border-subtle text-text-muted hover:text-text-primary hover:bg-white/5"
                    )}
                >
                    <Tag size={16} />
                    <span>Tags {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
                    <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                </button>
            </div>

            {/* Expandable Tags Area */}
            {isOpen && (
                <div className="glass p-4 rounded-2xl border-white/5 animation-slide-down">
                    <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => onTagSelect?.(tag)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                        isSelected 
                                            ? "bg-accent-primary text-black" 
                                            : "bg-surface-dark border border-border-subtle text-text-muted hover:border-accent-primary/50 hover:text-text-primary"
                                    )}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTags.map(tag => (
                        <div key={tag} className="flex items-center gap-1.5 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary px-2.5 py-1 rounded-full text-[10px] font-bold">
                            {tag}
                            <X size={12} className="cursor-pointer hover:text-white" onClick={() => onTagSelect?.(tag)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
