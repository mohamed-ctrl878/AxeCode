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
const CourseDetailsPage = lazy(() => import('../feature/course/routes/CourseDetailsPage'));
const ProblemPage = lazy(() => import('../feature/problem/routes/ProblemPage'));
const FeedPage = lazy(() => import('../feature/feed/routes/FeedPage'));
const ArticlePage = lazy(() => import('../feature/article/routes/ArticlePage'));
const EventPage = lazy(() => import('../feature/event/routes/EventPage'));
const CMSPage = lazy(() => import('../feature/cms/routes/CMSPage'));
const RegisterPage = lazy(() => import('../feature/auth/register/routes/RegisterPage'));
const LoginPage = lazy(() => import('../feature/auth/login/routes/LoginPage'));

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
                
                {/* Auth */}
                <Route path={PATHS.REGISTER} element={<RegisterPage />} />
                <Route path={PATHS.LOGIN} element={<LoginPage />} />
                
                {/* Learning */}
                <Route path={PATHS.COURSES} element={<CoursePage />} />
                <Route path={`${PATHS.COURSES}/:documentId`} element={<CourseDetailsPage />} />
                <Route path={PATHS.PROBLEMS} element={<ProblemPage />} />


                <Route path={PATHS.ROADMAPS} element={<PlaceholderPage title="Learning Paths" />} />

                {/* Management */}
                <Route path={PATHS.CONTENT_MANAGEMENT} element={<CMSPage />} />

                {/* Community */}
                <Route path={PATHS.FEED} element={<FeedPage />} />
                <Route path={PATHS.ARTICLES} element={<ArticlePage />} />
                <Route path={PATHS.EVENTS} element={<EventPage />} />

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
