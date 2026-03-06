import React from 'react';
import { Loader2, MessageCircle, ChevronDown } from 'lucide-react';
import { CommentItem } from './CommentItem';

/**
 * CommentList - Renders a collection of CommentItems with states.
 * @param {Object} props
 * @param {Array} props.comments
 * @param {boolean} props.loading
 * @param {boolean} props.hasMore
 * @param {Function} props.onLoadMore
 * @param {string} props.className
 */
export const CommentList = ({ comments, loading, hasMore, onLoadMore, className }) => {
    return (
        <div className={className}>
            {comments.length === 0 && !loading && (
                <div className="text-center py-12 text-text-muted flex flex-col items-center animate-fade-in">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-border-subtle shadow-sm">
                        <MessageCircle size={32} className="text-text-muted/30" />
                    </div>
                    <p className="font-medium">No comments yet.</p>
                    <p className="text-sm">Be the first to share your perspective!</p>
                </div>
            )}

            <div className="flex flex-col gap-6">
                {comments.map((comment, index) => (
                    <CommentItem key={comment.id || index} comment={comment} index={index} />
                ))}
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-center pt-8 mt-4 border-t border-border-subtle/50">
                {loading ? (
                    <div className="flex flex-col items-center gap-2 text-accent-primary">
                        <Loader2 size={24} className="animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
                    </div>
                ) : hasMore ? (
                    <button
                        onClick={onLoadMore}
                        className="group flex flex-col items-center gap-2 text-text-muted hover:text-accent-primary transition-all pb-4"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">Load More</span>
                        <div className="w-10 h-10 rounded-full bg-surface border border-border-subtle flex items-center justify-center group-hover:border-accent-primary group-hover:shadow-lg transition-all">
                            <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                        </div>
                    </button>
                ) : comments.length > 0 && (
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
                        You've reached the end of comments
                    </div>
                )}
            </div>
        </div>
    );
};
