import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';

/**
 * GuestActions: Displayed when the user is not authenticated.
 * Provides Login and Register buttons.
 */
export const GuestActions = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-2">
            <button 
                onClick={() => navigate(PATHS.LOGIN)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
            >
                Login
            </button>
            <button 
                onClick={() => navigate(PATHS.REGISTER)}
                className="px-5 py-2 rounded-xl btn-primary text-xs tracking-widest"
            >
                Register
            </button>
        </div>
    );
};
