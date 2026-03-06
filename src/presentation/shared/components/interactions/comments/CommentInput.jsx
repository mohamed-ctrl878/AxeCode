import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CommentInput - Standardized input form for adding comments.
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback function (commentText)
 * @param {boolean} props.isSubmitting - Loading state from useCase
 * @param {string} props.placeholder - Optional placeholder
 * @param {string} props.className - Optional styles
 */
export const CommentInput = ({ onSubmit, isSubmitting, placeholder = "Share your thoughts...", className }) => {
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || isSubmitting) return;

        const success = await onSubmit({ content: text.trim() });
        if (success) {
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("flex gap-4 items-start", className)}>
            <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center shrink-0 shadow-sm border border-accent-primary/20">
                <span className="text-white font-bold text-sm">Me</span>
            </div>
            <div className="flex-1 flex flex-col gap-3">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[80px] bg-surface-light border border-border-subtle rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:border-accent-primary transition-all focus:ring-2 focus:ring-accent-primary/10"
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
                        disabled={!text.trim() || isSubmitting}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-sm",
                            text.trim() && !isSubmitting
                                ? "bg-accent-primary text-white hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0"
                                : "bg-surface-light text-text-muted cursor-not-allowed border border-border-subtle"
                        )}
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            </div>
        </form>
    );
};
