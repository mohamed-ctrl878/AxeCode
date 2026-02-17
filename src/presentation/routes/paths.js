/**
 * PATHS: Centralized route definitions.
 * Follows the Domain structure of Axe Code.
 */
export const PATHS = {
    DASHBOARD: '/',

    // Learning
    COURSES: '/courses',
    COURSE_DETAILS: '/courses/:id',
    PROBLEMS: '/problems',
    PROBLEM_DETAILS: '/problems/:id',
    ROADMAPS: '/roadmaps',
    ROADMAP_DETAILS: '/roadmaps/:id',

    // Community
    FEED: '/feed',
    ARTICLES: '/articles',
    ARTICLE_DETAILS: '/articles/:id',
    EVENTS: '/events',
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

    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
};
