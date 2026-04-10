import { useSelector } from 'react-redux';
import { ROLES, ROLE_TYPES, ACCESS_LEVELS } from '../constants/RoleConstants';

/**
 * useRole: Custom hook to access and verify current user roles.
 */
export const useRole = () => {
    const user = useSelector((state) => state.auth.user);
    const authIsAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRole = user?.role || null;
    
    /**
     * @param {string|string[]} roles - Role name or type.
     * @returns {boolean}
     */
    const hasRole = (roles) => {
        if (!userRole) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(userRole.name) || roleArray.includes(userRole.type);
    };

    // Specialized checkers
    const isPublisher = () => hasRole([ROLES.PUBLISHER, ROLE_TYPES.PUBLISHER]);
    const isAdmin = isPublisher; // For now, mapping publisher as Admin
    
    // Rely on Redux's persisted boolean rather than object presence (which delays until fetch resolves)
    const isAuthenticated = () => authIsAuthenticated;

    const canManage = () => hasRole(ACCESS_LEVELS.MANAGEMENT);

    return {
        user,
        role: userRole,
        hasRole,
        isAdmin,
        isPublisher,
        isAuthenticated,
        canManage
    };
};
