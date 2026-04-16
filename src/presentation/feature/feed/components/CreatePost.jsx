import React from 'react';
import { useSelector } from 'react-redux';
import { cn } from '@core/utils/cn';
import { Send } from 'lucide-react';

/**
 * CreatePost: UI for initiating new community content.
 * Follows SRP: Handles post creation input.
 */
export const CreatePost = ({ className, onClick }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className={cn(
            "bento-card p-6 flex flex-col gap-4 bg-surface border border-border-subtle rounded-3xl",
            className
        )}>
            <div className="flex items-center gap-3 sm:gap-4 flex-nowrap">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-surface-sunken flex-shrink-0 border border-border-subtle/50 overflow-hidden">
                    {user?.avatar?.url ? (
                        <img 
                            src={user.avatar.url.startsWith('http') 
                                ? user.avatar.url 
                                : `${import.meta.env.VITE_API_BASE_URL || ''}${user.avatar.url}`} 
                            alt={user.username} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-mono text-text-muted">
                            {((user?.username || 'U')[0]).toUpperCase()}
                        </div>
                    )}
                </div>

                <input 
                    type="text" 
                    placeholder="What's in your mind?" 
                    className="flex-1 min-w-0 w-full bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted font-light cursor-pointer text-sm sm:text-base"
                    readOnly
                    onClick={onClick}
                    onFocus={onClick}
                />
                <button 
                    onClick={onClick}
                    className="btn-primary px-4 sm:px-8 flex-shrink-0"
                >
                    <Send size={16} className="sm:hidden" />
                    <span className="hidden sm:inline">Create</span>
                </button>
            </div>
        </div>
    );
};
