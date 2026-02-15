import React from 'react';
import { cn } from '@core/utils/cn';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { useUI } from '../provider/UIProvider';

/**
 * MainLayout: Implements the Bento Grid and core structural boundaries.
 * Follows OCP: Can be extended with different header/footer configurations.
 */
export const MainLayout = ({ children, className }) => {
    const { isSidebarOpen } = useUI();

    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Sidebar />
            <Header />
            <main className={cn(
                "transition-all duration-500 ease-in-out pt-24 px-4 pb-4 md:px-8 md:pb-8 grid gap-4 md:gap-6",
                "grid-cols-1 md:grid-cols-12",
                "ml-0 md:ml-20",
                isSidebarOpen && "md:ml-64",
                className
            )}>


                {/* Base grid orchestration - pages will populate the slots */}
                {children}
            </main>
        </div>
    );
};


