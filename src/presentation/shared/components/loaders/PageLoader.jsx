import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * PageLoader: Reusable full-screen loading state for asynchronous module 
 * fetching and data hydration.
 * Updated to use a circular spinner per user request.
 */
export const PageLoader = ({ className }) => (
    <div className={cn(
        "col-span-1 md:col-span-12 flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full animate-in fade-in duration-700",
        className
    )}>
        {/* Circular Ring Loader */}
        <div className="relative flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-accent-primary animate-spin opacity-80" strokeWidth={1.5} />
            <div className="absolute inset-0 w-12  rounded-full" />
        </div>
    </div>
);

export default PageLoader;
