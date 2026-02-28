import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useLikeContent } from '@domain/useCase/useLikeContent';

/**
 * Generic LikeButton connecting to the likes toggle API
 */
export const LikeButton = ({ docId, contentType, initialLikes = 0, initialIsLiked = false }) => {
    const { toggleLike, isLiking, likeError } = useLikeContent();
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (isLiking) return;

        // Optimistic UI update
        const previousIsLiked = isLiked;
        const previousLikesCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? Math.max(0, Number(prev) - 1) : Number(prev) + 1);

        try {
            const result = await toggleLike(docId, contentType);
            // Revert or adjust based on server state if the returned dataset supports it
            if (result && result.count !== undefined) {
                 setLikesCount(result.count);
                 setIsLiked(result.liked);
            }
        } catch (error) {
            // Revert optimistic update on error
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);
        }
    };

    return (
        <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 transition-colors group ${
                isLiked ? 'text-accent-primary' : 'text-text-muted hover:text-accent-primary'
            }`}
            title="Like this content"
        >
            <Heart size={18} className={isLiked ? 'fill-accent-primary' : 'group-hover:fill-accent-primary/20'} />
            <span className="text-xs font-mono">{likesCount}</span>
        </button>
    );
};
