import React, { useState } from 'react';
import { cn } from '@core/utils/cn';
import { MoreHorizontal, Clock } from 'lucide-react';
import { InteractionBar } from '@presentation/shared/components/interactions/InteractionBar';
import { ReportAction } from '@presentation/shared/components/interactions/ReportAction';
import { RichBlocksPreviewer } from '@presentation/shared/components/RichBlocksPreviewer';

/**
 * FeedItem: Individual content card in the feed.
 * Displays data mapped from BlogEntity.
 */
export const FeedItem = ({ blog, className, rank }) => {
    const [showOptions, setShowOptions] = useState(false);
    console.log(blog);

    if (!blog) return null;



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

    // Determine Podium Styles
    let podiumStyles = "border-border-subtle bg-surface-dark";
    let badge = null;

    if (rank === 1) {
        podiumStyles = "border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.15)]";
        badge = <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-background font-bold shadow-lg border-2 border-background">1</div>;
    } else if (rank === 2) {
        podiumStyles = "border-gray-300/50 bg-gray-300/5 shadow-[0_0_20px_rgba(209,213,219,0.1)]";
        badge = <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-background font-bold shadow-lg border-2 border-background">2</div>;
    } else if (rank === 3) {
        podiumStyles = "border-amber-700/50 bg-amber-700/5 shadow-[0_0_15px_rgba(180,83,9,0.1)]";
        badge = <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-800 flex items-center justify-center text-background font-bold shadow-lg border-2 border-background">3</div>;
    }

    return (
        <div className={cn(
            "bento-card p-6 flex flex-col gap-6 rounded-3xl relative transition-all duration-300 max-w-3xl mx-auto w-full",
            podiumStyles,
            className
        )}>
            {badge}
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

                
                {/* Constrained Rich Text Preview */}
                <div className="relative max-h-32 overflow-hidden after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-12 after:bg-gradient-to-t after:from-surface-dark after:to-transparent">
                    {blog.description ? (
                        <RichBlocksPreviewer 
                            content={blog.description} 
                            className="text-text-muted text-sm" 
                        />
                    ) : (
                        <p className="text-text-muted text-sm leading-relaxed">
                            Exploring the depths of clean architecture and futuristic design systems...
                        </p>
                    )}
                </div>

                {blog.image?.url && (
                    <div className="rounded-2xl overflow-hidden border border-border-subtle flex justify-center bg-black">
                        <img 
                            src={blog.image.url} 
                            alt="Feature" 
                            className="w-full max-h-[500px] object-contain" 
                        />
                    </div>
                )}
            </div>

            {/* Interaction Footer */}
            <InteractionBar 
                docId={blog.uid || blog.id} 
                contentType="blog" 
                initialLikes={blog.likesCount ?? blog.displayEngagement ?? 0}
                initialComments={blog.commentsCount ?? 0}
                initialIsLiked={blog.isLiked || false}
                contentTitle={blog.title}
            />
        </div>
    );
};
