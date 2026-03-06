import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * ArticleDetailsSkeleton: Mock layout for ArticleDetailsPage.jsx.
 */
export const ArticleDetailsSkeleton = () => {
    return (
        <div className="md:col-span-12 max-w-4xl mx-auto w-full flex flex-col gap-10 pb-24 px-4 sm:px-6">
            {/* Hero Section Skeleton */}
            <div className="flex flex-col gap-6">
                <Skeleton variant="rect" className="h-4 w-32 rounded-full" />
                <Skeleton variant="rect" className="h-12 w-full rounded-xl" />
                <Skeleton variant="rect" className="h-12 w-3/4 rounded-xl" />
                
                <div className="flex items-center gap-4 py-4">
                    <Skeleton variant="circle" className="w-12 h-12" />
                    <div className="space-y-2">
                        <Skeleton variant="rect" className="h-4 w-32" />
                        <Skeleton variant="rect" className="h-3 w-24" />
                    </div>
                </div>
            </div>

            {/* Main Image */}
            <Skeleton variant="rect" className="w-full h-[450px] rounded-3xl" />

            {/* Content Body */}
            <div className="space-y-6">
                <Skeleton variant="rect" className="h-4 w-full" />
                <Skeleton variant="rect" className="h-4 w-full" />
                <Skeleton variant="rect" className="h-4 w-[90%]" />
                <Skeleton variant="rect" className="h-4 w-full" />
                <Skeleton variant="rect" className="h-4 w-[85%]" />
                
                <div className="py-8">
                    <Skeleton variant="rect" className="h-64 w-full rounded-2xl" />
                </div>

                <Skeleton variant="rect" className="h-4 w-full" />
                <Skeleton variant="rect" className="h-4 w-[70%]" />
            </div>

            {/* Footer Interactions */}
            <div className="flex items-center gap-8 pt-10 border-t border-border-subtle/50">
                <Skeleton variant="rect" className="h-8 w-24 rounded-full" />
                <Skeleton variant="rect" className="h-8 w-16 rounded-full" />
            </div>
        </div>
    );
};
