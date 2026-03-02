import React from 'react';
import { StarRating } from '@presentation/shared/components/StarRating';

/**
 * ArticleRatingFooter - Interactive rating section for the article.
 * Pure presentational — receives state and callbacks via props.
 *
 * @param {{ myRating: number, isRating: boolean, onRate: Function }} props
 */
export const ArticleRatingFooter = ({ myRating = 0, isRating = false, onRate }) => {
    return (
        <div className="bento-card p-8 mt-6 bg-surface-dark border border-border-subtle flex flex-col items-center text-center gap-5">
            <div>
                <h3 className="font-bold text-lg mb-1">Rate this article</h3>
                <p className="text-text-muted text-sm">
                    Your feedback helps the community discover quality content.
                </p>
            </div>

            {/* Interactive Stars */}
            <StarRating
                value={myRating}
                interactive={!isRating}
                onChange={onRate}
                size="lg"
            />

            {/* Rating Status */}
            {isRating ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
                    <span className="text-xs text-text-muted font-mono">Submitting...</span>
                </div>
            ) : myRating > 0 ? (
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-bold text-amber-400">
                        You rated this {myRating} / 5
                    </span>
                    <span className="text-[10px] font-mono text-text-muted/50 uppercase tracking-widest">
                        Click the same star to remove your rating
                    </span>
                </div>
            ) : (
                <span className="text-[10px] font-mono text-text-muted/50 uppercase tracking-widest">
                    Click a star to rate
                </span>
            )}
        </div>
    );
};
