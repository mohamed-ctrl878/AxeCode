import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * RoadmapCardSkeleton: Mock layout for RoadmapCard.jsx.
 */
export const RoadmapCardSkeleton = ({ className }) => {
    return (
        <div className={cn(
            "group relative bento-card bg-surface-dark border border-border-subtle rounded-2xl overflow-hidden shadow-sm",
            className
        )}>
            {/* Color Accent Bar Mock */}
            <Skeleton variant="rect" className="h-1.5 w-full rounded-none" />

            <div className="p-6 flex flex-col gap-4">
                {/* Header: Icon + Title */}
                <div className="flex items-start gap-3">
                    <Skeleton variant="rect" className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="rect" className="h-5 w-3/4 rounded-md" />
                        <Skeleton variant="rect" className="h-3 w-1/3 rounded-sm" />
                    </div>
                </div>

                {/* Description Preview */}
                <div className="space-y-2">
                    <Skeleton variant="rect" className="h-3 w-full" />
                    <Skeleton variant="rect" className="h-3 w-[90%]" />
                </div>

                {/* Footer: Stats + Tags */}
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40">
                    <Skeleton variant="rect" className="h-3 w-20" />
                    <div className="flex gap-1.5">
                        <Skeleton variant="rect" className="h-4 w-12 rounded-full" />
                        <Skeleton variant="rect" className="h-4 w-12 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};
