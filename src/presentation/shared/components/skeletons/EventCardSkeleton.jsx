import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * EventCardSkeleton: Mock layout for EventCard.jsx.
 */
export const EventCardSkeleton = ({ className }) => {
    return (
        <div className={cn(
            "bento-card overflow-hidden bg-card border border-border-subtle rounded-3xl group flex flex-col h-full",
            className
        )}>
            {/* Cover Visual */}
            <Skeleton variant="rect" className="h-48 w-full rounded-none" />

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                <div className="space-y-3">
                    <Skeleton variant="rect" className="h-6 w-full rounded-md" />
                    <Skeleton variant="rect" className="h-6 w-[60%] rounded-md" />
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        <Skeleton variant="rect" className="h-3 w-20 rounded-sm" />
                        <Skeleton variant="rect" className="h-3 w-24 rounded-sm" />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50 mt-auto">
                    <div className="flex flex-col gap-2">
                        <Skeleton variant="rect" className="h-3 w-16" />
                        <Skeleton variant="rect" className="h-4 w-12" />
                    </div>
                    <Skeleton variant="rect" className="h-10 w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
};
