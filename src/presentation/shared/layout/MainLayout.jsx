import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFetchMe } from '@domain/useCase/useFetchMe';
import { useLocation } from 'react-router-dom';
import { cn } from '@core/utils/cn';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { useUI } from '../provider/UIProvider';
import { PATHS } from '../../routes/paths';

/**
 * MainLayout: Implements the Bento Grid and core structural boundaries.
 * Follows OCP: Can be extended with different header/footer configurations.
 */
export const MainLayout = ({ children, className }) => {
    const { isSidebarOpen } = useUI();
    const location = useLocation();
    const { fetchMe } = useFetchMe();
    
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authLoading = useSelector(state => state.authUi.loading);

    // Session Recovery Orchestration
    useEffect(() => {
        if (isAuthenticated) {
            fetchMe();
        }
    }, []); // Run once on boot

    // Determine if we are in Focus Mode (e.g., CMS)
    const isFocusMode = location.pathname.startsWith(PATHS.CONTENT_MANAGEMENT);

    return (
        <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">
            {/* Global Main Loader UI */}
            {authLoading && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bento-card glass-morphism border-accent-primary/20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-accent-primary animate-spin" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-accent-primary font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                                Restoring Session
                            </span>
                            <span className="text-text-muted text-[10px] font-medium uppercase tracking-widest opacity-60">
                                Verifying Security Identity
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {!isFocusMode && <Sidebar />}
            <Header />
            
            <main className={cn(
                "transition-all duration-500 ease-in-out px-4 pb-4 md:px-8 md:pb-8 grid gap-4 md:gap-6",
                "grid-cols-1 md:grid-cols-12",
                "pt-24", // Header is now always visible, so constant top padding
                !isFocusMode ? [
                    "ml-0 md:ml-20",
                    isSidebarOpen && "md:ml-64"
                ] : [
                    "ml-0"
                ],
                className
            )}>

                {/* Base grid orchestration - pages will populate the slots */}
                {children}
            </main>
        </div>
    );
};



