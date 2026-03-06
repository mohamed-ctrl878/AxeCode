import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@core/utils/cn';

/**
 * RoadmapDetailsSkeleton: Mock layout for RoadmapDetailsPage/Viewer.
 */
export const RoadmapDetailsSkeleton = () => {
    return (
        <div className="md:col-span-12 w-full h-[calc(100vh-120px)] flex flex-col gap-6 animate-fade-in">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <Skeleton variant="rect" className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton variant="rect" className="h-6 w-48 rounded-md" />
                        <Skeleton variant="rect" className="h-3 w-32 rounded-sm" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Skeleton variant="rect" className="h-10 w-24 rounded-full" />
                    <Skeleton variant="rect" className="h-10 w-10 rounded-full" />
                </div>
            </div>

            {/* Main Flow Canvas Skeleton */}
            <div className="flex-1 bento-card bg-surface-dark border border-border-subtle overflow-hidden relative">
                {/* Mock Flow Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{ 
                    backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                }} />
                
                {/* Mock Nodes */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Skeleton variant="rect" className="absolute top-[20%] left-[45%] w-32 h-16 rounded-xl" />
                        <Skeleton variant="rect" className="absolute top-[40%] left-[30%] w-32 h-16 rounded-xl" />
                        <Skeleton variant="rect" className="absolute top-[40%] left-[60%] w-32 h-16 rounded-xl" />
                        <Skeleton variant="rect" className="absolute top-[65%] left-[45%] w-32 h-16 rounded-xl" />
                        
                        {/* Mock Connections/Edges */}
                        <div className="absolute top-[30%] left-[47%] w-[2px] h-[10%] bg-border-subtle/30" />
                        <div className="absolute top-[35%] left-[35%] w-[12%] h-[5%] border-t-2 border-l-2 border-border-subtle/30 rounded-tl-xl" />
                        <div className="absolute top-[35%] left-[53%] w-[12%] h-[5%] border-t-2 border-r-2 border-border-subtle/30 rounded-tr-xl" />
                    </div>
                </div>

                {/* Controls Skeleton */}
                <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                    <Skeleton variant="rect" className="w-10 h-32 rounded-full" />
                </div>
            </div>
        </div>
    );
};
