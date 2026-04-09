import React from 'react';
import { Calendar, Clock, Star, MessageSquare } from 'lucide-react';

/**
 * ArticleHero - Displays article header: tags, title, author, and interaction badges.
 * Pure presentational component — receives ArticleEntity data via props.
 *
 * @param {{ article: import('@domain/entity/ArticleEntity').ArticleEntity, onCommentClick?: Function }} props
 */
export const ArticleHero = ({ article, onCommentClick }) => {
    if (!article) return null;

    return (
        <div className="bento-card p-8 md:p-12 flex flex-col gap-8">
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2">
                {article.tags?.map(tag => (
                    <span
                        key={typeof tag === 'object' ? tag.name : tag}
                        className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-xs font-mono font-bold"
                    >
                        #{typeof tag === 'object' ? tag.name : tag}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif font-medium leading-tight">
                {article.title}
            </h1>

            {/* Author & Interaction Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-border-subtle">
                {/* Author */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-dark overflow-hidden flex items-center justify-center border border-border-subtle">
                        {article.author?.avatar?.url ? (
                            <img src={article.author.avatar.url} alt="author" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-lg text-text-muted">
                                {article.author?.username?.[0]?.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">@{article.author?.username || 'Unknown Author'}</span>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} /> {article.createdAt?.toLocaleDateString() || 'Recently'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> {Math.max(1, Math.ceil(article.summary?.length / 200) || 3)} min read
                            </span>
                        </div>
                    </div>
                </div>

                {/* Interaction Badges */}
                <div className="flex items-center gap-3 text-sm font-bold text-text-muted">
                    <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border-subtle">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span>{article.rating?.average?.toFixed(1) || '0.0'}</span>
                        <span className="text-[10px] font-mono text-text-muted/60">
                            ({article.rating?.total || article.rating?.count || 0})
                        </span>
                    </div>
                    <button 
                        onClick={onCommentClick}
                        className="flex items-center gap-1 bg-surface px-3 py-1.5 rounded-lg border border-border-subtle hover:text-accent-primary hover:border-accent-primary/50 transition-colors"
                    >
                        <MessageSquare size={14} /> {article.commentsCount || 0}
                    </button>
                </div>
            </div>
        </div>
    );
};
