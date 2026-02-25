import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Generic CommentButton exposing entry-point for a comments module modal/drawer
 */
export const CommentButton = ({ docId, contentType, initialComments = 0, onClick }) => {
    // We could connect standard modal/drawer triggers here via shared context later
    const handleCommentClick = (e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
        else console.log(`Trigger comment module for ${contentType} ${docId}`);
    };

    return (
        <button 
            onClick={handleCommentClick}
            className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors"
            title="Leave a comment"
        >
            <MessageCircle size={18} />
            <span className="text-xs font-mono">{initialComments}</span>
        </button>
    );
};
