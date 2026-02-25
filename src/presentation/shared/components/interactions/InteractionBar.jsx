import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { LikeButton } from './LikeButton';
import { CommentButton } from './CommentButton';
import { CommentModal } from './CommentModal';

/**
 * InteractionBar is a composite of the Like, Comment, and Share logic
 * Expected to be placed at the bottom footprint of a card/item.
 */
export const InteractionBar = ({ 
    docId, 
    contentType, 
    initialLikes = 0, 
    initialComments = 0, 
    initialIsLiked = false,
    contentTitle = '',
    className = "" 
}) => {
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const handleShare = (e) => {
        e.stopPropagation();
        // Typically copies link to clipboard or opens device share UI
        const url = window.location.href; 
        navigator.clipboard.writeText(`${url}#${contentType}-${docId}`)
            .then(() => alert('Link copied to clipboard'))
            .catch(console.error);
    };

    return (
        <>
            <div className={`flex items-center gap-6 pt-2 border-t border-border-subtle/50 ${className}`}>
                <LikeButton 
                    docId={docId} 
                    contentType={contentType} 
                    initialLikes={initialLikes} 
                    initialIsLiked={initialIsLiked} 
                />
                <CommentButton 
                    docId={docId} 
                    contentType={contentType} 
                    initialComments={initialComments} 
                    onClick={() => setIsCommentModalOpen(true)}
                />
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors ml-auto group"
                    title="Share this content"
                >
                    <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono">Share</span>
                </button>
            </div>
            
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                docId={docId}
                contentType={contentType}
                contentTitle={contentTitle}
            />
        </>
    );
};
