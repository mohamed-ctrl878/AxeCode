import React from 'react';
import { Skeleton } from './Skeleton';

/**
 * CourseCardSkeleton: Mock layout for CourseCard.jsx.
 */
export const CourseCardSkeleton = () => {
    return (
        <div className="bento-card p-5 flex flex-col gap-4">
            <Skeleton variant="rect" className="w-full h-32 rounded-lg" />
            <div className="space-y-3">
                <Skeleton variant="rect" className="h-5 w-3/4" />
                <Skeleton variant="rect" className="h-3 w-1/2" />
            </div>
            <div className="flex justify-between items-center pt-2">
                <Skeleton variant="rect" className="h-4 w-1/4" />
                <Skeleton variant="circle" className="w-8 h-8" />
            </div>
        </div>
    );
};
