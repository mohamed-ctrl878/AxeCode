import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '@core/hooks/useRole';
import { PATHS } from '@presentation/routes/paths';

/**
 * GuestRoute: Higher-order component to guard public routes.
 * Redirects authenticated users to the courses page.
 */
export const GuestRoute = ({ children }) => {
    const { isAuthenticated } = useRole();
    const location = useLocation();

    if (isAuthenticated()) {
        const from = location.state?.from?.pathname || PATHS.COURSES;
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};
