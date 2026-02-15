import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from './paths';

// Placeholder/Lazy Loaded Pages for now
// We can use a generic placeholder for initial setup
const PlaceholderPage = ({ title }) => (
    <div className="md:col-span-12 h-screen flex items-center justify-center p-6">
        <div className="text-center bento-card p-12 max-w-2xl w-full">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-text-muted">This module is currently under development according to our system architecture.</p>
        </div>
    </div>
);

const CoursePage = lazy(() => import('../feature/course/routes/CoursePage'));
const ProblemPage = lazy(() => import('../feature/problem/routes/ProblemPage'));

/**
 * AppRoutes: Centralized router.
 * Follows SRP: Only handles route-to-component mapping.
 */
export const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="text-accent-primary p-20 text-center flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
            <span className="font-mono text-xs tracking-widest uppercase">Initializing Core Module...</span>
        </div>}>
            <Routes>
                <Route path={PATHS.DASHBOARD} element={<PlaceholderPage title="Dashboard Feed" />} />
                
                {/* Learning */}
                <Route path={PATHS.COURSES} element={<CoursePage />} />
                <Route path={PATHS.PROBLEMS} element={<ProblemPage />} />


                <Route path={PATHS.ROADMAPS} element={<PlaceholderPage title="Learning Paths" />} />

                {/* Community */}
                <Route path={PATHS.FEED} element={<PlaceholderPage title="Global Feed" />} />
                <Route path={PATHS.ARTICLES} element={<PlaceholderPage title="Knowledge Base" />} />
                <Route path={PATHS.EVENTS} element={<PlaceholderPage title="Upcoming Events" />} />

                {/* Resources */}
                <Route path={PATHS.MEDIA} element={<PlaceholderPage title="Media Assets" />} />
                <Route path={PATHS.LIVE} element={<PlaceholderPage title="Live Streams" />} />

                {/* Social */}
                <Route path={PATHS.MESSAGES} element={<PlaceholderPage title="Communication Hub" />} />

                {/* User */}
                <Route path={PATHS.PROFILE} element={<PlaceholderPage title="User Profile" />} />
                <Route path={PATHS.SETTINGS} element={<PlaceholderPage title="Account Settings" />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
            </Routes>
        </Suspense>
    );
};
