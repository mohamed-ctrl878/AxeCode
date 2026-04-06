import React from 'react';
import { useRole } from '@core/hooks/useRole';

/**
 * PermissionGate: Declarative access control component.
 * Filters children based on required roles.
 */
export const PermissionGate = ({ 
    children, 
    allowedRoles = [], 
    fallback = null, 
    invert = false 
}) => {
    const { hasRole, isAuthenticated } = useRole();
    
    // Logic: If user has ANY of the allowed roles, permit access.
    // Empty allowedRoles permits all authenticated users by default.
    const isAllowed = allowedRoles.length === 0 
        ? isAuthenticated() 
        : hasRole(allowedRoles);

    // Support 'Invert' logic (e.g. show this ONLY to guests)
    const accessGranted = invert ? !isAllowed : isAllowed;

    if (!accessGranted) return fallback;

    return <>{children}</>;
};
