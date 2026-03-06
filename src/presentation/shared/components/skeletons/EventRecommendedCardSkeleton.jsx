import React from 'react';
import { Skeleton } from './Skeleton';

/**
 * EventRecommendedCardSkeleton: Mock layout for EventRecommendedCard.jsx.
 */
export const EventRecommendedCardSkeleton = () => {
    return (
        <div className="bg-surface-elevated p-4 rounded-sm border border-border-subtle flex gap-4 w-full">
            <Skeleton variant="rect" className="w-16 h-16 rounded-sm shrink-0" />
            <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <Skeleton variant="rect" className="h-3 w-12 rounded-full" />
                        <Skeleton variant="rect" className="h-3 w-10" />
                    </div>
                    <Skeleton variant="rect" className="h-4 w-full" />
                    <Skeleton variant="rect" className="h-2 w-20" />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <Skeleton variant="rect" className="h-2 w-16" />
                    <Skeleton variant="rect" className="h-4 w-12" />
                </div>
            </div>
        </div>
    );
};
