import React from 'react';
import { cn } from '@core/utils/cn';

/**
 * ArticleCard: Formal content component with background-matching aesthetics.
 * Features a publisher header and a bottom-faded content preview.
 */
export const ArticleCard = ({ article, className }) => {
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
        <div className={cn(
            "relative flex flex-col gap-5 p-6 bg-background border border-border-subtle rounded-3xl",
            "transition-all duration-500 hover:border-accent-primary/30",
            "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]",
            className
        )}>
            {/* Header: Publisher Info (Top-Left) */}
            <div className="flex items-center gap-3">
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
                    <span className="text-sm font-semibold text-text-primary leading-none">
                        {article.author?.username || 'Core Architect'}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono mt-1 uppercase tracking-tighter">
                        {formatDate(article.createdAt)}
                    </span>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold leading-tight line-clamp-2 hover:text-accent-primary transition-colors cursor-pointer">
                {article.title || 'Modular Systems in Modern Engineering'}
            </h3>

            {/* Content Preview with Fade-out */}
            <div className="relative overflow-hidden max-h-48">
                <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                    {article.summary || article.content || 'Detailed technical analysis of modern software architectures, focusing on the integration of clean principles and the Antigravity design system to achieve maximum scalability and maintainable codebases for high-frequency platforms...'}
                </div>
                
                {/* Fade-out Overlay (Simulates "There is something else but there is fog") */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* Optional: Visual Indicator for 'more' within the shadow */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-border-subtle/30 rounded-full blur-[1px]" />
        </div>
    );
};
