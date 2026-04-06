/**
 * RoleConstants: Centralized definitions for User Roles.
 * Maps to Strapi's 'users-permissions' fields.
 */
export const ROLES = {
    // Standard names shown in Strapi UI (from screenshot)
    AUTHENTICATED: 'Authenticated',
    PUBLIC: 'Public',
    PUBLISHER: 'publisher', // 'publishing manager' from screenshot
};



/**
 * ROLE_TYPES: Technical machine-names used by Strapi internally.
 * This is the most reliable way to check permissions.
 */
export const ROLE_TYPES = {
    AUTHENTICATED: 'authenticated', // System default
    PUBLIC: 'public',               // Guest default
    PUBLISHER: 'publisher',
};

/**
 * ACCESS_LEVELS: Grouping roles for simplified check.
 */
export const ACCESS_LEVELS = {
    ADMIN_ONLY: [ROLES.PUBLISHER, ROLE_TYPES.PUBLISHER],
    MANAGEMENT: [ROLES.PUBLISHER, ROLE_TYPES.PUBLISHER],
    USER: [ROLES.AUTHENTICATED, ROLE_TYPES.AUTHENTICATED]
};

