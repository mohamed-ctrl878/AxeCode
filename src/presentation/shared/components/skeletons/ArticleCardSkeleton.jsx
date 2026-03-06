import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * ArticleCardSkeleton: Mock layout for ArticleCard.jsx.
 */
export const ArticleCardSkeleton = ({ className }) => {
    return (
        <div className={cn(
            "relative flex flex-col gap-5 p-6 bg-background border border-border-subtle rounded-3xl",
            "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]",
            className
        )}>
            {/* Header: Publisher Info */}
            <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-9 h-9" />
                <div className="flex flex-col gap-2">
                    <Skeleton variant="rect" className="h-3 w-24" />
                    <Skeleton variant="rect" className="h-2 w-16" />
                </div>
            </div>

            {/* Title */}
            <Skeleton variant="rect" className="h-6 w-full rounded-md" />
            <Skeleton variant="rect" className="h-6 w-[80%] rounded-md" />

            {/* Content Preview */}
            <div className="space-y-2">
                <Skeleton variant="rect" className="h-3 w-full" />
                <Skeleton variant="rect" className="h-3 w-full" />
                <Skeleton variant="rect" className="h-3 w-[60%]" />
            </div>

            {/* Interaction Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle/50">
                <Skeleton variant="rect" className="h-4 w-20 rounded-full" />
                <Skeleton variant="rect" className="h-4 w-10 rounded-full" />
            </div>
        </div>
    );
};
