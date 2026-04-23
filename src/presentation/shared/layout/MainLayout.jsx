import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFetchMe } from '@domain/useCase/useFetchMe';
import { useLocation } from 'react-router-dom';
import { cn } from '@core/utils/cn';
import { Header } from '../components/layout/Header';
import { GuestHeader } from '../components/layout/GuestHeader';
import { PATHS } from '../../routes/paths';

import { GlobalFooter } from './GlobalFooter';
import AxeCodeLogo from '../components/AxeCodeLogo';

/**
 * MainLayout: Implements the Bento Grid and core structural boundaries.
 * 
 * Access Control:
 * - Unauthenticated: Header with login/register actions
 * - Authenticated: Full Header experience
 */
export const MainLayout = ({ children, className }) => {
    const location = useLocation();
    const { fetchMe } = useFetchMe();
    
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authLoading = useSelector(state => state.authUi.loading);

    // Session Recovery Orchestration
    useEffect(() => {
        if (isAuthenticated) {
            fetchMe();
        }
    }, [isAuthenticated, fetchMe]);

    // Determine if we are in Focus Mode (e.g., CMS or Problem Details workspace)
    const isFocusMode = location.pathname.startsWith(PATHS.CONTENT_MANAGEMENT) || location.pathname.includes('/problems/');

    // Optional: Hide header for specific full-page views (like auth pages if desired, but Header handles guest state nicely)
    const isAuthPage = location.pathname === PATHS.LOGIN || location.pathname === PATHS.REGISTER;

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col">
            {/* Global Main Loader UI */}
            {authLoading && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-12 relative">
                        <AxeCodeLogo size="text-5xl" className="animate-pulse opacity-80" />
                        
                        <div className="flex flex-col items-center gap-5">
                            <div className="h-[2px] w-24 bg-accent-primary opacity-20 rounded-full" />
                            <span className="text-accent-primary text-[11px] font-sans font-bold uppercase tracking-[0.4em] opacity-60">
                                Restoring Scholar's Repository
                            </span>
                        </div>

                        {/* Background Aura - Scholarly Parchment Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -z-10" />
                    </div>
                </div>
            )}

            {/* Layout Orchestration */}
            {!isAuthenticated && !isAuthPage && <GuestHeader />}
            {isAuthenticated && !isFocusMode && !isAuthPage && <Header />}
            
            <main className={cn(
                "transition-all duration-500 ease-in-out px-4 pb-4 md:px-8 md:pb-8 grid gap-4 md:gap-6 flex-grow min-h-[calc(100vh-250px)]",
                "grid-cols-1 md:grid-cols-12 w-full max-w-[1440px] mx-auto",
                !isFocusMode ? [
                    !isAuthPage ? "pt-24" : "pt-4", // Header padding if header is visible
                ] : [
                    "p-0 my-0 w-full min-h-screen mx-auto", // Full width, natural height for focus mode, explicit mx-auto to preserve centering
                ],
                className
            )}>
                {/* Base grid orchestration - pages will populate the slots */}
                {children}
            </main>

            {!isFocusMode && !isAuthPage && (
                <div className="transition-all duration-500 w-full">
                    <GlobalFooter />
                </div>
            )}
        </div>
    );
};
