import React from 'react';
import AxeCodeLogo from '../AxeCodeLogo';

/**
 * PageLoader: Reusable full-screen loading state for asynchronous module 
 * fetching and data hydration.
 */
export const PageLoader = () => (
    <div className="col-span-1 md:col-span-12 flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full animate-in fade-in duration-500">
        <AxeCodeLogo size="text-5xl" className="animate-pulse opacity-50" />
        <div className="flex flex-col items-center gap-3">
            <div className="h-1 w-16 bg-accent-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-full bg-accent-primary rounded-full animate-pulse" />
            </div>
            <span className="text-text-muted text-xs uppercase tracking-widest font-mono">Loading Sector</span>
        </div>
    </div>
);

export default PageLoader;
