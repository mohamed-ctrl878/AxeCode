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
const CreateCoursePage = lazy(() => import('../feature/course/routes/CreateCoursePage'));
const CourseDetailsPage = lazy(() => import('../feature/course/routes/CourseDetailsPage'));
const ProblemPage = lazy(() => import('../feature/problem/routes/ProblemPage'));
const ProblemPreviewPage = lazy(() => import('../feature/problem/routes/ProblemPreviewPage'));
const FeedPage = lazy(() => import('../feature/feed/routes/FeedPage'));
const ArticlePage = lazy(() => import('../feature/article/routes/ArticlePage'));
const ArticleDetailsPage = lazy(() => import('../feature/article/routes/ArticleDetailsPage'));
const WriteArticlePage = lazy(() => import('../feature/article/routes/WriteArticlePage'));
const EventPage = lazy(() => import('../feature/event/routes/EventPage'));
const CreateEventPage = lazy(() => import('../feature/event/routes/CreateEventPage'));
const EventDetailsPage = lazy(() => import('../feature/event/routes/EventDetailsPage'));

// CMS Layout + Module Pages (Nested Routing)
const CMSLayout = lazy(() => import('../feature/cms/layout/CMSLayout'));
const CMSCoursesPage = lazy(() => import('../feature/cms/routes/CMSCoursesPage'));
const CMSEventsPage = lazy(() => import('../feature/cms/routes/CMSEventsPage'));
const CMSProblemsPage = lazy(() => import('../feature/cms/routes/CMSProblemsPage'));

// CMS Management Pages (Deep routes)
const CourseManagementPage = lazy(() => import('../feature/cms/routes/CourseManagementPage'));
const EventManagementPage = lazy(() => import('../feature/cms/routes/EventManagementPage'));
const ProblemManagementPage = lazy(() => import('../feature/cms/routes/ProblemManagementPage'));
const CreateProblemPage = lazy(() => import('../feature/cms/routes/CreateProblemPage'));
const AddLessonPage = lazy(() => import('../feature/cms/routes/AddLessonPage'));
const EditLessonPage = lazy(() => import('../feature/cms/routes/EditLessonPage'));

const RoadmapsPage = lazy(() => import('../feature/roadmap/routes/RoadmapsPage'));
const RoadmapDetailsPage = lazy(() => import('../feature/roadmap/routes/RoadmapDetailsPage'));
const RegisterPage = lazy(() => import('../feature/auth/register/routes/RegisterPage'));
const LoginPage = lazy(() => import('../feature/auth/login/routes/LoginPage'));
const FlowSandboxPage = lazy(() => import('../feature/misc/FlowSandboxPage'));

/**
 * AppRoutes: Centralized router.
 * Follows SRP: Only handles route-to-component mapping.
 */
export const AppRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path={PATHS.DASHBOARD} element={<PlaceholderPage title="Dashboard Feed" />} />
                
                {/* Auth */}
                <Route path={PATHS.REGISTER} element={<RegisterPage />} />
                <Route path={PATHS.LOGIN} element={<LoginPage />} />
                
                {/* Learning */}
                <Route path={PATHS.COURSES} element={<CoursePage />} />
                <Route path={PATHS.COURSE_CREATE} element={<CreateCoursePage />} />
                <Route path={`${PATHS.COURSES}/:documentId`} element={<CourseDetailsPage />} />
                
                <Route path={PATHS.PROBLEMS} element={<ProblemPage />} />
                <Route path={PATHS.PROBLEM_CREATE} element={<CreateProblemPage />} />
                <Route path={`${PATHS.PROBLEMS}/:id`} element={<ProblemPreviewPage />} />

                <Route path={PATHS.ROADMAPS} element={<RoadmapsPage />} />
                <Route path={PATHS.ROADMAP_DETAILS} element={<RoadmapDetailsPage />} />

                {/* ═══ CMS Management (Nested Routing) ═══ */}
                <Route path={PATHS.CONTENT_MANAGEMENT} element={<CMSLayout />}>
                    {/* Default redirect: /cms → /cms/courses */}
                    <Route index element={<Navigate to="courses" replace />} />

                    {/* Module listing pages */}
                    <Route path="courses" element={<CMSCoursesPage />} />
                    <Route path="events" element={<CMSEventsPage />} />
                    <Route path="problems" element={<CMSProblemsPage />} />
                    <Route path="articles" element={<PlaceholderPage title="Articles Management" />} />
                    <Route path="media" element={<PlaceholderPage title="Media Management" />} />
                </Route>

                {/* CMS Deep Management Routes (outside layout — full-page views) */}
                <Route path={`${PATHS.CONTENT_MANAGEMENT}/courses/:id/:topic`} element={<CourseManagementPage />} />
                <Route path={`${PATHS.CONTENT_MANAGEMENT}/courses/:courseId/weeks/:weekId/add-lesson`} element={<AddLessonPage />} />
                <Route path={`${PATHS.CONTENT_MANAGEMENT}/courses/:courseId/weeks/:weekId/lessons/:lessonId/edit`} element={<EditLessonPage />} />
                <Route path={`${PATHS.CONTENT_MANAGEMENT}/events/:id/:topic`} element={<EventManagementPage />} />
                <Route path={`${PATHS.CONTENT_MANAGEMENT}/problems/:id/:topic`} element={<ProblemManagementPage />} />

                {/* Community */}
                <Route path={PATHS.FEED} element={<FeedPage />} />
                <Route path={PATHS.ARTICLES} element={<ArticlePage />} />
                <Route path={PATHS.ARTICLE_DETAILS} element={<ArticleDetailsPage />} />
                <Route path={`${PATHS.ARTICLES}/write`} element={<WriteArticlePage />} />
                <Route path={PATHS.EVENTS} element={<EventPage />} />
                <Route path={PATHS.EVENT_CREATE} element={<CreateEventPage />} />
                <Route path={`${PATHS.EVENTS}/:id`} element={<EventDetailsPage />} />

                {/* Resources */}
                <Route path={PATHS.MEDIA} element={<PlaceholderPage title="Media Assets" />} />
                <Route path={PATHS.LIVE} element={<PlaceholderPage title="Live Streams" />} />

                {/* Social */}
                <Route path={PATHS.MESSAGES} element={<PlaceholderPage title="Communication Hub" />} />

                {/* User */}
                <Route path={PATHS.PROFILE} element={<PlaceholderPage title="User Profile" />} />
                <Route path={PATHS.SETTINGS} element={<PlaceholderPage title="Account Settings" />} />

                {/* Testing & Sandbox */}
                <Route path="/flow-sandbox" element={<FlowSandboxPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
            </Routes>
        </Suspense>
    );
};
