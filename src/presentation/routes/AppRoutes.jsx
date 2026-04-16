import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from './paths';
import { ProtectedRoute } from '@presentation/shared/components/auth/ProtectedRoute';
import { GuestRoute } from '@presentation/shared/components/auth/GuestRoute';
import { ROLE_TYPES } from '@core/constants/RoleConstants';
import ComingSoonPage from '../shared/pages/ComingSoonPage';
import AxeCodeLogo from '../shared/components/AxeCodeLogo';
import { PageLoader } from '../shared/components/loaders/PageLoader';

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

const CoursePage = lazy(() => import('@presentation/feature/course/routes/CoursePage'));
const CreateCoursePage = lazy(() => import('@presentation/feature/course/routes/CreateCoursePage'));
const CourseDetailsPage = lazy(() => import('@presentation/feature/course/routes/CourseDetailsPage'));
const LearnCoursePage = lazy(() => import('@presentation/feature/course/routes/LearnCoursePage'));
const ProblemPage = lazy(() => import('@presentation/feature/problem/routes/ProblemPage'));
const ProblemPreviewPage = lazy(() => import('@presentation/feature/problem/routes/ProblemPreviewPage'));
const FeedPage = lazy(() => import('@presentation/feature/feed/routes/FeedPage'));
const ArticlePage = lazy(() => import('@presentation/feature/article/routes/ArticlePage'));
const ArticleDetailsPage = lazy(() => import('@presentation/feature/article/routes/ArticleDetailsPage'));
const WriteArticlePage = lazy(() => import('@presentation/feature/article/routes/WriteArticlePage'));
const EventPage = lazy(() => import('@presentation/feature/event/routes/EventPage'));
const CreateEventPage = lazy(() => import('@presentation/feature/event/routes/CreateEventPage'));
const EventDetailsPage = lazy(() => import('@presentation/feature/event/routes/EventDetailsPage'));

// CMS Layout + Module Pages (Nested Routing)
const CMSLayout = lazy(() => import('@presentation/feature/cms/layout/CMSLayout'));
const CMSCoursesPage = lazy(() => import('@presentation/feature/cms/routes/CMSCoursesPage'));
const CMSEventsPage = lazy(() => import('@presentation/feature/cms/routes/CMSEventsPage'));
const CMSProblemsPage = lazy(() => import('@presentation/feature/cms/routes/CMSProblemsPage'));

// CMS Management Pages (Deep routes)
const CourseManagementPage = lazy(() => import('@presentation/feature/cms/routes/CourseManagementPage'));
const EventManagementPage = lazy(() => import('@presentation/feature/cms/routes/EventManagementPage'));
const ProblemManagementPage = lazy(() => import('@presentation/feature/cms/routes/ProblemManagementPage'));
const CreateProblemPage = lazy(() => import('@presentation/feature/cms/routes/CreateProblemPage'));
const AddLessonPage = lazy(() => import('@presentation/feature/cms/routes/AddLessonPage'));
const EditLessonPage = lazy(() => import('@presentation/feature/cms/routes/EditLessonPage'));
const CMSReportTypesPage = lazy(() => import('@presentation/feature/cms/routes/CMSReportTypesPage'));
const ReportTypeManagementPage = lazy(() => import('@presentation/feature/cms/routes/ReportTypeManagementPage'));

const RoadmapsPage = lazy(() => import('@presentation/feature/roadmap/routes/RoadmapsPage'));
const RoadmapDetailsPage = lazy(() => import('@presentation/feature/roadmap/routes/RoadmapDetailsPage'));
const EnrolledContentPage = lazy(() => import('@presentation/feature/user/routes/EnrolledContentPage'));
const RegisterPage = lazy(() => import('@presentation/feature/auth/register/routes/RegisterPage'));
const LoginPage = lazy(() => import('@presentation/feature/auth/login/routes/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@presentation/feature/auth/forgot-password/routes/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@presentation/feature/auth/reset-password/routes/ResetPasswordPage'));
const GithubCallbackPage = lazy(() => import('@presentation/feature/auth/login/routes/GithubCallbackPage'));
const CMSRoadmapsPage = lazy(() => import('@presentation/feature/cms/routes/CMSRoadmapsPage'));
const FlowSandboxPage = lazy(() => import('@presentation/feature/misc/FlowSandboxPage'));
const ProfilePage = lazy(() => import('@presentation/feature/profile/routes/ProfilePage'));
const SettingsPage = lazy(() => import('@presentation/feature/user/routes/SettingsPage'));
const LegalPage = lazy(() => import('@presentation/feature/static/routes/LegalPage'));
const DocumentationPage = lazy(() => import('@presentation/feature/static/routes/DocumentationPage'));
const LandingPage = lazy(() => import('@presentation/feature/landing/routes/LandingPage'));

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
export const AppRoutes = () => {
    const location = useLocation();
    const { isAuthenticated } = useSelector(state => state.auth || {});
    
    React.useEffect(() => {
        if (location.pathname === PATHS.FEED) {
            console.log('[AppRoutes] Accessing Feed - Auth State:', isAuthenticated);
        }
    }, [location, isAuthenticated]);

    const fallback = <PageLoader />;

    return (
        <Suspense fallback={fallback}>
            <Routes>
                {/* ═══ Public Routes (No Auth Required) ═══ */}
                <Route path={PATHS.DASHBOARD} element={<AuthAwareHome />} />
                <Route path={PATHS.COMING_SOON} element={<ComingSoonPage />} />
                <Route path={PATHS.PRIVACY} element={<LegalPage />} />
                <Route path={PATHS.TERMS} element={<LegalPage />} />
                <Route path={PATHS.DOCUMENTATION} element={<DocumentationPage />} />
                
                {/* Auth */}
                <Route path={PATHS.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path={PATHS.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path={PATHS.FORGOT_PASSWORD} element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
                <Route path={PATHS.RESET_PASSWORD} element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
                <Route path={PATHS.GITHUB_CALLBACK} element={<GuestRoute><GithubCallbackPage /></GuestRoute>} />
                
                {/* ═══ Protected Routes (Authenticated Users Only) ═══ */}
                
                {/* Community (High Priority Precedence) */}
                <Route path={PATHS.FEED} element={
                    <ProtectedRoute><FeedPage /></ProtectedRoute>
                } />
                <Route path={PATHS.FEED_DETAILS} element={
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

                {/* Learning */}
                <Route path={PATHS.COURSES} element={
                    <ProtectedRoute><CoursePage /></ProtectedRoute>
                } />

                {/* Learning (Standard) */}
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
                    <Route index element={<Navigate to="courses" replace />} />
                    <Route path="courses" element={<CMSCoursesPage />} />
                    <Route path="events" element={<CMSEventsPage />} />
                    <Route path="problems" element={<CMSProblemsPage />} />
                    <Route path="roadmaps" element={<CMSRoadmapsPage />} />
                    <Route path="report-reasons" element={<CMSReportTypesPage />} />
                    <Route path="articles" element={<PlaceholderPage title="Articles Management" />} />
                    <Route path="media" element={<PlaceholderPage title="Media Management" />} />
                </Route>

                {/* CMS Deep Management Routes */}
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
                <Route 
                    path={PATHS.REPORT_TYPE_CREATE} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <ReportTypeManagementPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path={PATHS.REPORT_TYPE_EDIT} 
                    element={
                        <ProtectedRoute allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                            <ReportTypeManagementPage />
                        </ProtectedRoute>
                    } 
                />
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
                    <ProtectedRoute><SettingsPage /></ProtectedRoute>
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
