/**
 * PATHS: Centralized route definitions.
 * Follows the Domain structure of Axe Code.
 */
export const PATHS = {
    DASHBOARD: '/',

    // Learning
    COURSES: '/courses',
    COURSE_CREATE: '/cms/courses/create',
    COURSE_DETAILS: '/courses/:id',
    COURSE_LEARN: '/courses/:courseId/learn/lesson/:lessonId',
    PROBLEMS: '/problems',
    PROBLEM_CREATE: '/cms/problems/create',
    PROBLEM_DETAILS: '/problems/:id',
    ROADMAPS: '/roadmaps',
    ROADMAP_DETAILS: '/roadmaps/:id',

    // Community
    FEED: '/feed',
    ARTICLES: '/articles',
    ARTICLE_DETAILS: '/articles/:id',
    EVENTS: '/events',
    EVENT_CREATE: '/cms/events/create',
    EVENT_DETAILS: '/events/:id',

    // Resources
    MEDIA: '/media',
    LIVE: '/live',

    // Social
    MESSAGES: '/messages',

    // Management
    CONTENT_MANAGEMENT: '/cms',

    // User
    PROFILE: '/profile',
    SETTINGS: '/settings',
    ENROLLED_CONTENT: '/my-content',
    ENROLLED_COURSES: '/my-content/courses',
    ENROLLED_EVENTS: '/my-content/events',
    ENROLLED_LIVES: '/my-content/live',

    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    GITHUB_CALLBACK: '/auth/github/callback',
    COMING_SOON: '/coming-soon',

    // Guest Navigation
    WHATS_NEW: '/coming-soon',
    CAREER: '/coming-soon',
};
