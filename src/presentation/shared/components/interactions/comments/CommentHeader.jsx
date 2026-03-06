import React from 'react';
import { MessageCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CommentHeader - Displays comment count and sort filters.
 * @param {Object} props
 * @param {number} props.total - Total comment count
 * @param {string} props.sortOrder - 'desc' | 'asc'
 * @param {Function} props.onSortChange - Callback for sort toggle
 * @param {string} props.className - Optional styles
 */
export const CommentHeader = ({ total, sortOrder, onSortChange, className }) => {
    return (
        <div className={cn("flex flex-col sm:flex-row justify-between items-center gap-4", className)}>
            <h3 className="flex items-center gap-2 text-lg font-bold">
                <MessageCircle className="text-accent-primary" size={20} />
                Comments <span className="text-text-muted font-mono text-sm">({total})</span>
            </h3>

            <div className="flex bg-surface rounded-xl p-1 border border-border-subtle shadow-inner">
                <button
                    onClick={() => onSortChange('desc')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        sortOrder === 'desc' 
                            ? "bg-accent-primary text-white shadow-sm" 
                            : "text-text-muted hover:text-text-primary"
                    )}
                >
                    <ArrowDown size={14} /> Latest
                </button>
                <button
                    onClick={() => onSortChange('asc')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        sortOrder === 'asc' 
                            ? "bg-accent-primary text-white shadow-sm" 
                            : "text-text-muted hover:text-text-primary"
                    )}
                >
                    <ArrowUp size={14} /> Oldest
                </button>
            </div>
        </div>
    );
};
