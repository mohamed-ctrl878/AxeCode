import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * EventDetailsSkeleton: Layout placeholder for EventDetailsPage.jsx.
 */
export const EventDetailsSkeleton = () => {
    return (
        <div className="md:col-span-12 max-w-6xl mx-auto w-full flex flex-col gap-8 pb-24 px-4 sm:px-6 lg:px-8">
            {/* Hero Skeleton */}
            <Skeleton variant="rect" className="w-full h-[400px] rounded-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-8 flex flex-col gap-12">
                    <div className="bento-card p-6 md:p-10 bg-surface border border-border-subtle rounded-3xl space-y-6">
                        <Skeleton variant="rect" className="h-8 w-1/3" />
                        <div className="space-y-3">
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" className="w-2/3" />
                        </div>
                    </div>
                    
                    <Skeleton variant="rect" className="h-[300px] w-full rounded-3xl" />
                    <Skeleton variant="rect" className="h-[200px] w-full rounded-3xl" />
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-4">
                    <div className="bento-card p-6 bg-surface border border-border-subtle rounded-3xl space-y-6">
                        <Skeleton variant="rect" className="h-6 w-1/2" />
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
                                <div className="space-y-2 w-full">
                                    <Skeleton variant="rect" className="h-4 w-1/2" />
                                    <Skeleton variant="rect" className="h-3 w-1/3" />
                                </div>
                            </div>
                            <Skeleton variant="rect" className="h-10 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
