import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * CourseDetailsSkeleton: Mock layout for CourseDetailsPage.jsx.
 */
export const CourseDetailsSkeleton = () => {
    return (
        <div className="md:col-span-12 max-w-7xl mx-auto w-full flex flex-col gap-8 pb-24 px-4 sm:px-6 lg:px-8">
            {/* Header / Hero Skeleton */}
            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="flex-1 space-y-6 w-full">
                    <Skeleton variant="rect" className="h-4 w-24 rounded-full" />
                    <Skeleton variant="rect" className="h-12 w-full rounded-xl" />
                    <Skeleton variant="rect" className="h-12 w-2/3 rounded-xl" />
                    <div className="flex items-center gap-6 pt-4">
                        <Skeleton variant="rect" className="h-5 w-32" />
                        <Skeleton variant="rect" className="h-5 w-32" />
                    </div>
                </div>
                <Skeleton variant="rect" className="w-full lg:w-[450px] aspect-video rounded-3xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <div className="bento-card p-8 space-y-6">
                        <Skeleton variant="rect" className="h-8 w-1/3" />
                        <div className="space-y-4">
                            <Skeleton variant="rect" className="h-4 w-full" />
                            <Skeleton variant="rect" className="h-4 w-full" />
                            <Skeleton variant="rect" className="h-4 w-[80%]" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Skeleton variant="rect" className="h-8 w-48" />
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} variant="rect" className="h-16 w-full rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bento-card p-6 space-y-6">
                        <Skeleton variant="rect" className="h-6 w-1/2" />
                        <Skeleton variant="rect" className="h-12 w-full rounded-xl" />
                        <div className="space-y-4 pt-4">
                            <Skeleton variant="rect" className="h-4 w-full" />
                            <Skeleton variant="rect" className="h-4 w-full" />
                            <Skeleton variant="rect" className="h-4 w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
