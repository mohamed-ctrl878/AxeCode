import React from 'react';
import { cn } from '@core/utils/cn';
import { MessageCircle, Heart, Share2, MoreHorizontal, Clock } from 'lucide-react';

/**
 * FeedItem: Individual content card in the feed.
 * Displays data mapped from BlogEntity.
 */
export const FeedItem = ({ blog, className }) => {
    // Basic fallback for empty blog object
    if (!blog) return null;

    return (
        <div className={cn(
            "bento-card p-6 flex flex-col gap-6 bg-surface-dark border border-border-subtle rounded-3xl",
            className
        )}>
            {/* Header: Author & Meta */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-border-subtle overflow-hidden border border-border-subtle">
                        {blog.author?.avatar?.url ? (
                            <img src={blog.author.avatar.url} alt={blog.author.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-text-muted">BP</div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold">{blog.author?.username || 'Architect'}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono uppercase tracking-widest">
                            <span>{blog.createdAt || 'Just now'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {blog.readingTime}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="text-text-muted hover:text-text-primary transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold leading-tight hover:text-accent-primary transition-colors cursor-pointer">
                    {blog.title || 'Untitled Knowledge Drop'}
                </h2>
                
                <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
                    {/* Simplified block rendering for now */}
                    {Array.isArray(blog.description) 
                        ? blog.description[0]?.children?.[0]?.text 
                        : blog.description || 'Exploring the depths of clean architecture and futuristic design systems...'}
                </p>

                {blog.image?.url && (
                    <div className="rounded-2xl overflow-hidden border border-border-subtle aspect-video">
                        <img src={blog.image.url} alt="Feature" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            {/* Interaction Footer */}
            <div className="flex items-center gap-6 pt-2 border-t border-border-subtle/50">
                <button className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors group">
                    <Heart size={18} className="group-hover:fill-accent-primary/20" />
                    <span className="text-xs font-mono">1.2k</span>
                </button>
                <button className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-xs font-mono">84</span>
                </button>
                <button className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors ml-auto">
                    <Share2 size={18} />
                    <span className="text-xs font-mono">Share</span>
                </button>
            </div>
        </div>
    );
};
