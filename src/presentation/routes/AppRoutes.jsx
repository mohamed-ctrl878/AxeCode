import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from './paths';
import { ProtectedRoute } from '@presentation/shared/components/Auth/ProtectedRoute';
import { GuestRoute } from '@presentation/shared/components/Auth/GuestRoute';
import { ROLE_TYPES } from '@core/constants/RoleConstants';

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
const LearnCoursePage = lazy(() => import('../feature/course/routes/LearnCoursePage'));
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
const EnrolledContentPage = lazy(() => import('../feature/user/routes/EnrolledContentPage'));
const RegisterPage = lazy(() => import('../feature/auth/register/routes/RegisterPage'));
const LoginPage = lazy(() => import('../feature/auth/login/routes/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../feature/auth/forgot-password/routes/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../feature/auth/reset-password/routes/ResetPasswordPage'));
const GithubCallbackPage = lazy(() => import('../feature/auth/login/routes/GithubCallbackPage'));
const CMSRoadmapsPage = lazy(() => import('../feature/cms/routes/CMSRoadmapsPage'));
const FlowSandboxPage = lazy(() => import('../feature/misc/FlowSandboxPage'));
const ProfilePage = lazy(() => import('../feature/profile/routes/ProfilePage'));


const LandingPage = lazy(() => import('../feature/landing/routes/LandingPage'));

/**
 * AuthAwareHome: Renders the appropriate root page based on authentication state.
 * - Guest:         LandingPage (marketing/demo)
 * - Authenticated: Redirects to /courses
 */
const AuthAwareHome = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return isAuthenticated ? <Navigate to={PATHS.COURSES} replace /> : <LandingPage />;
};

/**
 * AppRoutes: Centralized router.
 * Follows SRP: Only handles route-to-component mapping.
 * 
 * Access Control Strategy:
 * - Public routes: /, /login, /register, /forgot-password, /reset-password, /coming-soon
 * - Protected routes: All internal app routes (courses, feed, articles, etc.)
 * - Publisher routes: CMS management routes
 */
import ComingSoonPage from '../shared/pages/ComingSoonPage';

export const AppRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>
                {/* ═══ Public Routes (No Auth Required) ═══ */}
                <Route path={PATHS.DASHBOARD} element={<AuthAwareHome />} />
                <Route path={PATHS.COMING_SOON} element={<ComingSoonPage />} />
                
                {/* Auth */}
                <Route path={PATHS.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path={PATHS.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path={PATHS.FORGOT_PASSWORD} element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
                <Route path={PATHS.RESET_PASSWORD} element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
                <Route path={PATHS.GITHUB_CALLBACK} element={<GuestRoute><GithubCallbackPage /></GuestRoute>} />
                
                {/* ═══ Protected Routes (Authenticated Users Only) ═══ */}

                {/* Learning */}
                <Route path={PATHS.COURSES} element={
                    <ProtectedRoute><CoursePage /></ProtectedRoute>
                } />

                {/* Learning (Protected) */}
                <Route path={PATHS.COURSE_CREATE} element={
                    <ProtectedRoute><CreateCoursePage /></ProtectedRoute>
                } />
                <Route path={PATHS.COURSE_LEARN} element={
                    <ProtectedRoute><LearnCoursePage /></ProtectedRoute>
                } />
                <Route path={`${PATHS.COURSES}/:documentId`} element={
                    <ProtectedRoute><CourseDetailsPage /></ProtectedRoute>
                } />
                
                <Route path={PATHS.PROBLEMS} element={
                    <ProtectedRoute><ProblemPage /></ProtectedRoute>
                } />
                <Route path={PATHS.PROBLEM_CREATE} element={
                    <ProtectedRoute><CreateProblemPage /></ProtectedRoute>
                } />
                <Route path={`${PATHS.PROBLEMS}/:id`} element={
                    <ProtectedRoute><ProblemPreviewPage /></ProtectedRoute>
                } />

                <Route path={PATHS.ROADMAPS} element={
                    <ProtectedRoute><RoadmapsPage /></ProtectedRoute>
                } />
                <Route path={PATHS.ROADMAP_DETAILS} element={
                    <ProtectedRoute><RoadmapDetailsPage /></ProtectedRoute>
                } />

                {/* ═══ CMS Management (Nested Routing) ═══ */}
                <Route 
                    path={PATHS.CONTENT_MANAGEMENT} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <CMSLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Default redirect: /cms → /cms/courses */}
                    <Route index element={<Navigate to="courses" replace />} />

                    {/* Module listing pages */}
                    <Route path="courses" element={<CMSCoursesPage />} />
                    <Route path="events" element={<CMSEventsPage />} />
                    <Route path="problems" element={<CMSProblemsPage />} />
                    <Route path="roadmaps" element={<CMSRoadmapsPage />} />
                    <Route path="articles" element={<PlaceholderPage title="Articles Management" />} />
                    <Route path="media" element={<PlaceholderPage title="Media Management" />} />
                </Route>

                {/* CMS Deep Management Routes (outside layout — full-page views) */}
                <Route 
                    path={`${PATHS.CONTENT_MANAGEMENT}/courses/:id/:topic`} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <CourseManagementPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path={`${PATHS.CONTENT_MANAGEMENT}/courses/:courseId/weeks/:weekId/add-lesson`} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <AddLessonPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path={`${PATHS.CONTENT_MANAGEMENT}/courses/:courseId/weeks/:weekId/lessons/:lessonId/edit`} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <EditLessonPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path={`${PATHS.CONTENT_MANAGEMENT}/events/:id/:topic`} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <EventManagementPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path={`${PATHS.CONTENT_MANAGEMENT}/problems/:id/:topic`} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <ProblemManagementPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path={`${PATHS.CONTENT_MANAGEMENT}/roadmaps/create`} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <FlowSandboxPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path={`${PATHS.CONTENT_MANAGEMENT}/roadmaps/:id/edit`} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <FlowSandboxPage />
                        </ProtectedRoute>
                    } 
                />

                {/* Community */}
                <Route path={PATHS.FEED} element={
                    <ProtectedRoute><FeedPage /></ProtectedRoute>
                } />
                <Route path={PATHS.ARTICLES} element={
                    <ProtectedRoute><ArticlePage /></ProtectedRoute>
                } />
                <Route path={PATHS.ARTICLE_DETAILS} element={
                    <ProtectedRoute><ArticleDetailsPage /></ProtectedRoute>
                } />
                <Route path={`${PATHS.ARTICLES}/write`} element={
                    <ProtectedRoute><WriteArticlePage /></ProtectedRoute>
                } />
                <Route path={PATHS.EVENTS} element={
                    <ProtectedRoute><EventPage /></ProtectedRoute>
                } />
                <Route path={PATHS.EVENT_CREATE} element={
                    <ProtectedRoute><CreateEventPage /></ProtectedRoute>
                } />
                <Route path={`${PATHS.EVENTS}/:id`} element={
                    <ProtectedRoute><EventDetailsPage /></ProtectedRoute>
                } />

                {/* Resources */}
                <Route path={PATHS.MEDIA} element={
                    <ProtectedRoute><PlaceholderPage title="Media Assets" /></ProtectedRoute>
                } />
                <Route path={PATHS.LIVE} element={
                    <ProtectedRoute><PlaceholderPage title="Live Streams" /></ProtectedRoute>
                } />

                {/* Social */}
                <Route path={PATHS.MESSAGES} element={
                    <ProtectedRoute><PlaceholderPage title="Communication Hub" /></ProtectedRoute>
                } />

                {/* User */}
                <Route path={PATHS.PROFILE} element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />

                <Route path={PATHS.SETTINGS} element={
                    <ProtectedRoute><PlaceholderPage title="Account Settings" /></ProtectedRoute>
                } />
                <Route 
                    path={`${PATHS.ENROLLED_CONTENT}/:type?`} 
                    element={
                        <ProtectedRoute>
                            <EnrolledContentPage />
                        </ProtectedRoute>
                    } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
            </Routes>
        </Suspense>
    );
};
