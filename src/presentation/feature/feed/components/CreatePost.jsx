import React from 'react';
import { cn } from '@core/utils/cn';
import { Send } from 'lucide-react';

/**
 * CreatePost: UI for initiating new community content.
 * Follows SRP: Handles post creation input.
 */
export const CreatePost = ({ className, onClick }) => {
    return (
        <div className={cn(
            "bento-card p-6 flex flex-col gap-4 bg-surface-dark border border-border-subtle rounded-3xl",
            className
        )}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-border-subtle flex-shrink-0" />
                <input 
                    type="text" 
                    placeholder="What's in your mind?" 
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted font-light"
                />
                <button 
                    onClick={onClick}
                    className="bg-white text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                >
                    <Send size={16} />
                    <span>Create</span>
                </button>
            </div>
        </div>
    );
};
