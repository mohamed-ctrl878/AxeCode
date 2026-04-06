import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '@core/hooks/useRole';
import { PATHS } from '@presentation/routes/paths';

/**
 * ProtectedRoute: Higher-order component to guard sensitive routes.
 * Redirects unauthorized users to the dashboard or login.
 */
export const ProtectedRoute = ({ 
    children, 
    allowedRoles = [] 
}) => {
    const { hasRole, isAuthenticated } = useRole();
    const location = useLocation();

    // 1. Session check
    if (!isAuthenticated()) {
        return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
    }

    // 2. Permission check
    // If roles provided, verify current user has at least one matching
    if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        console.warn(`[ProtectedRoute] Unauthorized access attempt to ${location.pathname} by role mismatch.`);
        return <Navigate to={PATHS.DASHBOARD} replace />;
    }

    return <>{children}</>;
};
