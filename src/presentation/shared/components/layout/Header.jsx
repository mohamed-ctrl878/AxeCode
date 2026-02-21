import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Bell } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useUI } from '../../provider/UIProvider';
import { PATHS } from '../../../routes/paths';

// Sub-components
import { SearchTerminal } from './header/SearchTerminal';
import { UserMenu } from './header/UserMenu';
import { GuestActions } from './header/GuestActions';

/**
 * Header: Global navigation and action bar.
 * Orchestrates smaller domain components for search and user actions.
 */
export const Header = () => {
    const { isSidebarOpen } = useUI();
    const location = useLocation();
    
    // Auth state
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // Determine if we are in Focus Mode (e.g., CMS)
    const isFocusMode = location.pathname.startsWith(PATHS.CONTENT_MANAGEMENT);

    return (
        <header className={cn(
            "fixed top-0 right-0 h-16 glass border-b border-border-subtle z-40 transition-all duration-500 flex items-center px-4 md:px-6 justify-between",
            !isFocusMode ? [
                "left-0 md:left-20",
                isSidebarOpen && "md:left-64"
            ] : "left-0"
        )}>

            {/* Search Section */}
            <SearchTerminal />

            {/* Actions Section */}
            <div className="flex items-center gap-4">
                {/* Messages */}
                <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-dark rounded-xl transition-all group">
                    <MessageSquare size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-primary rounded-full border-2 border-background glow-pulse" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-dark rounded-xl transition-all group">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-border-subtle mx-2" />

                {/* Auth / Profile Area */}
                {isAuthenticated ? (
                    <UserMenu user={user} />
                ) : (
                    <GuestActions />
                )}
            </div>
        </header>
    );
};

export default Header;
