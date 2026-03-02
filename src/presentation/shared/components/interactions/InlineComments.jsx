import React, { useState, useEffect } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { useCommentContent } from '@domain/useCase/useCommentContent';
import { cn } from '@core/utils/cn';

/**
 * An inline component for displaying and submitting comments for any content.
 * Shares the exact same logic as CommentModal but renders seamlessly in the page flow.
 * 
 * @param {Object} props
 * @param {string|number} props.docId - Content ID
 * @param {string} props.contentType - Type of content (e.g. 'article')
 */
export const InlineComments = ({ docId, contentType }) => {
    const { comments, loading, error, addComment, fetchComments } = useCommentContent(docId, contentType);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (docId) {
            fetchComments();
        }
    }, [docId, fetchComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const success = await addComment({ content: commentText.trim() });
        if (success) {
            setCommentText('');
        }
        setIsSubmitting(false);
    };

    const renderCommentBody = (body) => {
        if (!body) return '';
        if (typeof body === 'string') return body;
        if (Array.isArray(body)) {
            return body.flatMap(block => block?.children || [])
                       .map(child => child?.text || '')
                       .join('\n');
        }
        return JSON.stringify(body);
    };

    return (
        <div className="bento-card overflow-hidden flex flex-col bg-surface shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-border-subtle bg-surface-dark/50">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                    <MessageCircle className="text-accent-primary" size={20} />
                    Comments ({comments?.length || 0})
                </h3>
            </div>

            {/* Input Area (Top) */}
            <div className="p-6 border-b border-border-subtle bg-surface">
                <form onSubmit={handleSubmit} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-white font-bold text-sm">Me</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Share your thoughts on this article..."
                            className="w-full min-h-[80px] bg-surface-light border border-border-subtle rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:border-accent-primary transition-colors focus:ring-2 focus:ring-accent-primary/20"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isSubmitting}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-sm",
                                    commentText.trim() && !isSubmitting
                                        ? "bg-accent-primary text-white hover:bg-accent-hover hover:-translate-y-0.5"
                                        : "bg-surface-light text-text-muted cursor-not-allowed border border-border-subtle"
                                )}
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="p-6 flex flex-col gap-6 bg-surface-light/30">
                {loading && (
                    <div className="flex items-center justify-center py-8 text-text-muted">
                        <Loader2 size={24} className="animate-spin" />
                    </div>
                )}
                
                {error && (
                    <div className="bg-status-error/10 text-status-error border border-status-error/20 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {!loading && comments && comments.length === 0 && (
                    <div className="text-center py-12 text-text-muted flex flex-col items-center">
                        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-border-subtle shadow-sm">
                            <MessageCircle size={32} className="text-text-muted/50" />
                        </div>
                        <p className="font-medium">No comments yet.</p>
                        <p className="text-sm">Be the first to share your perspective!</p>
                    </div>
                )}

                {!loading && comments && comments.length > 0 && comments.map((comment, index) => (
                    <div key={comment.id || index} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="w-10 h-10 rounded-full bg-surface-dark border border-border-subtle flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                            {comment.author?.avatar?.url ? (
                                <img src={comment.author.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-text-primary font-bold text-sm">
                                    {comment.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 bg-surface rounded-2xl p-4 border border-border-subtle shadow-sm hover:border-accent-primary/30 transition-colors">
                            <div className="flex items-baseline justify-between mb-2">
                                <span className="font-bold text-sm">
                                    {comment.author?.username || 'User'}
                                </span>
                                {comment.createdAt && (
                                    <span className="text-xs font-mono text-text-muted">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                                {renderCommentBody(comment.body || comment.content || comment.message)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
