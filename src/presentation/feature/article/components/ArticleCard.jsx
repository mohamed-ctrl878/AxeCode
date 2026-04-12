import React from 'react';
import { cn } from '@core/utils/cn';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Star } from 'lucide-react';
import { StarRating } from '@presentation/shared/components/StarRating';
import { PATHS } from '@presentation/routes/paths';

/**
 * ArticleCard: Formal content component with background-matching aesthetics.
 * Features a publisher header, content preview, and interaction stats.
 */
export const ArticleCard = ({ article, className }) => {
    const navigate = useNavigate();
    
    if (!article) return null;

    /**
     * Formats a Date/string to a short human-readable date.
     * @param {Date|string|null} date
     * @returns {string}
     */
    const formatDate = (date) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <Link to={PATHS.ARTICLE_DETAILS.replace(':id', article?.documentId || article?.uid)} className={cn(
            "relative flex flex-col gap-5 p-6 bg-background border border-border-subtle rounded-3xl",
            "transition-all duration-500 hover:border-accent-primary/30",
            "shadow-whisper",
            className
        )}>
            {/* Header: Publisher Info (Top-Left) */}
            <div 
                className="flex items-center gap-3 w-fit cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                    if (article.author?.username) {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(PATHS.PROFILE.replace(':username', article.author.username));
                    }
                }}
            >
                <div className="w-9 h-9 rounded-full bg-surface border border-border-subtle overflow-hidden">
                    {article.author?.avatar?.url ? (
                        <img src={article.author.avatar.url} alt={article.author.username} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-text-muted bg-surface-dark">
                            {(article.author?.username || 'AX').substring(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary leading-none hover:text-accent-primary transition-colors">
                        {article.author?.username || 'Core Architect'}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono mt-1 uppercase tracking-tighter">
                        {formatDate(article.createdAt)}
                    </span>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-serif font-medium leading-tight line-clamp-2 hover:text-accent-primary transition-colors cursor-pointer">
                {article.title || 'Modular Systems in Modern Engineering'}
            </h3>

            {/* Content Preview with Fade-out */}
            <div className="relative overflow-hidden max-h-48">
                <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                    {article.summary || article.content || 'Detailed technical analysis of modern software architectures...'}
                </div>
                
                {/* Fade-out Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* Interaction Stats Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle/50">
                <div className="flex items-center gap-1.5">
                    <StarRating value={article.rating?.average || 0} size="sm" />
                    {article.rating?.count > 0 && (
                        <span className="text-[10px] font-mono text-text-muted">({article.rating.count})</span>
                    )}
                </div>
                <span className="flex items-center gap-1 text-xs text-text-muted font-mono">
                    <MessageSquare size={12} /> {article.commentsCount || 0}
                </span>
            </div>
        </Link>
    );
};

