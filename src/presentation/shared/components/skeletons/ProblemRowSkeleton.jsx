import React from 'react';
import { Skeleton } from './Skeleton';

/**
 * ProblemRowSkeleton: Mock layout for ProblemRow.jsx during loading.
 */
export const ProblemRowSkeleton = () => {
    return (
        <div className="flex items-center gap-4 px-6 py-4 border-b border-border-subtle/30 animate-pulse">
            <div className="flex-1 space-y-2">
                <Skeleton variant="rect" className="h-5 w-1/3" />
                <Skeleton variant="rect" className="h-3 w-1/4" />
            </div>
            <div className="flex items-center gap-8 pr-12">
                <Skeleton variant="rect" className="h-6 w-16 rounded-full" />
                <Skeleton variant="rect" className="h-9 w-24 rounded-sm" />
            </div>
        </div>
    );
};
