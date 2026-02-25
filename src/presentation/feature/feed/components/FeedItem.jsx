import React, { useState } from 'react';
import { cn } from '@core/utils/cn';
import { MoreHorizontal, Clock } from 'lucide-react';
import { InteractionBar } from '@presentation/shared/components/interactions/InteractionBar';
import { ReportAction } from '@presentation/shared/components/interactions/ReportAction';

/**
 * FeedItem: Individual content card in the feed.
 * Displays data mapped from BlogEntity.
 */
export const FeedItem = ({ blog, className }) => {
    const [showOptions, setShowOptions] = useState(false);

    if (!blog) return null;

    /**
     * Extracts plain text preview from Strapi block content.
     * @param {object|array|string} description
     * @returns {string}
     */
    const getDescriptionPreview = (description) => {
        if (typeof description === 'string') return description;
        if (Array.isArray(description)) {
            return description
                .flatMap(block => block?.children || [])
                .map(child => child?.text || '')
                .join(' ')
                .slice(0, 200);
        }
        return '';
    };

    /**
     * Formats a Date/string to a human-friendly relative or short date.
     * @param {Date|string|null} date
     * @returns {string}
     */
    const formatDate = (date) => {
        if (!date) return 'Just now';
        const d = date instanceof Date ? date : new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

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
                            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-text-muted">
                                {(blog.author?.username || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold">{blog.author?.username || 'Architect'}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono uppercase tracking-widest">
                            <span>{formatDate(blog.createdAt)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {blog.readingTime}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowOptions(!showOptions);
                        }}
                        className="text-text-muted hover:text-text-primary transition-colors"
                        title="More options"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    {showOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface-light border border-border-subtle rounded-xl shadow-xl overflow-hidden z-10">
                            <ReportAction 
                                docId={blog.documentId || blog.id} 
                                contentType="blog" 
                                onReportSuccess={() => setShowOptions(false)} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold leading-tight hover:text-accent-primary transition-colors cursor-pointer">
                    {blog.title || 'Untitled Knowledge Drop'}
                </h2>
                
                <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
                    {getDescriptionPreview(blog.description) || 'Exploring the depths of clean architecture and futuristic design systems...'}
                </p>

                {blog.image?.url && (
                    <div className="rounded-2xl overflow-hidden border border-border-subtle aspect-video">
                        <img src={blog.image.url} alt="Feature" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            {/* Interaction Footer */}
            <InteractionBar 
                docId={blog.documentId || blog.id} 
                contentType="blog" 
                initialLikes={blog.likesCount || blog.displayEngagement || 0}
                initialComments={blog.commentsCount || 0}
                initialIsLiked={blog.isLiked || false}
                contentTitle={blog.title}
            />
        </div>
    );
};
