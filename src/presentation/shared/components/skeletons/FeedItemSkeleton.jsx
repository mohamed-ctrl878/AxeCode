import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * FeedItemSkeleton: Mock layout for FeedItem.jsx during loading.
 */
export const FeedItemSkeleton = ({ className }) => {
    return (
        <div className={cn(
            "bento-card p-6 flex flex-col gap-6 rounded-3xl max-w-3xl mx-auto w-full",
            className
        )}>
            {/* Header: Author & Meta */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Skeleton variant="circle" className="w-10 h-10" />
                    <div className="flex flex-col gap-2">
                        <Skeleton variant="rect" className="h-4 w-24" />
                        <Skeleton variant="rect" className="h-3 w-32" />
                    </div>
                </div>
                <Skeleton variant="rect" className="w-6 h-6 rounded-md" />
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Skeleton variant="rect" className="h-4 w-full" />
                    <Skeleton variant="rect" className="h-4 w-[90%]" />
                    <Skeleton variant="rect" className="h-4 w-[40%]" />
                </div>
                <Skeleton variant="rect" className="w-full h-48 rounded-2xl" />
            </div>

            {/* Interactions Footer */}
            <div className="flex items-center gap-6 pt-2">
                <Skeleton variant="rect" className="h-6 w-16 rounded-full" />
                <Skeleton variant="rect" className="h-6 w-16 rounded-full" />
                <Skeleton variant="rect" className="h-6 w-16 rounded-full" />
            </div>
        </div>
    );
};
