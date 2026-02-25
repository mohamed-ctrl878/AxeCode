import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, MessageCircle } from 'lucide-react';
import { useCommentContent } from '@domain/useCase/useCommentContent';
import { cn } from '@core/utils/cn';

/**
 * A modal for displaying and submitting comments for any content.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Is modal open?
 * @param {Function} props.onClose - Close handler
 * @param {string|number} props.docId - Content ID
 * @param {string} props.contentType - Type of content (e.g. 'blog')
 * @param {string} props.contentTitle - Optional title to display in header
 */
export const CommentModal = ({ 
    isOpen, 
    onClose, 
    docId, 
    contentType, 
    contentTitle = 'Content'
}) => {
    const { comments, loading, error, addComment, fetchComments } = useCommentContent(docId, contentType);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, fetchComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        // Build the basic structural data for strapi nested comment plugin or custom comment API
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
            // Strapi Block serialization
            return body.flatMap(block => block?.children || [])
                       .map(child => child?.text || '')
                       .join('\n');
        }
        return JSON.stringify(body);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-lg shadow-2xl flex flex-col h-[80vh] max-h-[600px] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-subtle shrink-0">
                    <div>
                        <h2 className="text-lg font-bold">Comments</h2>
                        {contentTitle && (
                            <p className="text-sm text-text-secondary truncate max-w-[300px]">
                                on &quot;{contentTitle}&quot;
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-surface-light rounded-full transition-colors text-text-secondary hover:text-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading && (
                        <div className="flex items-center justify-center py-8 text-text-secondary">
                            <Loader2 size={24} className="animate-spin" />
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {!loading && comments && comments.length === 0 && (
                        <div className="text-center py-12 text-text-tertiary flex flex-col items-center">
                            <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mb-4">
                                <MessageCircle size={32} className="text-border" />
                            </div>
                            <p>No comments yet. Be the first to start the discussion!</p>
                        </div>
                    )}

                    {!loading && comments && comments.length > 0 && comments.map((comment, index) => (
                        <div key={comment.id || index} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
                                <span className="text-accent-primary font-bold text-xs">
                                    {comment.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 bg-surface-light rounded-2xl rounded-tl-none p-3 border border-border-subtle">
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="font-semibold text-sm">
                                        {comment.author?.username || 'User'}
                                    </span>
                                    {comment.createdAt && (
                                        <span className="text-xs text-text-tertiary">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-secondary whitespace-pre-wrap">
                                    {renderCommentBody(comment.body || comment.content || comment.message)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border-subtle shrink-0 bg-surface rounded-b-2xl">
                    <form 
                        onSubmit={handleSubmit}
                        className="flex gap-2 items-end"
                    >
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 min-h-[44px] max-h-[120px] bg-surface-light border border-border-subtle rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-accent-primary transition-colors"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim() || isSubmitting}
                            className={cn(
                                "p-3 rounded-xl transition-all flex items-center justify-center h-[44px] w-[44px] shrink-0",
                                commentText.trim() && !isSubmitting
                                    ? "bg-accent-primary text-white hover:bg-accent-primary/90 hover:-translate-y-0.5"
                                    : "bg-surface-light text-text-tertiary cursor-not-allowed border border-border-subtle"
                            )}
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
