import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { 
    MessageSquare, ChevronDown,
    BookOpen, Code2, Map, LayoutDashboard, FileText, 
    Calendar, Video, Image, Database, Menu, X
} from 'lucide-react';
import { cn } from '@core/utils/cn';
import { PATHS } from '../../../routes/paths';
import AxeCodeLogo from '../AxeCodeLogo';
import { PermissionGate } from '../Auth/PermissionGate';
import { ROLE_TYPES } from '@core/constants/RoleConstants';

// Sub-components
import { SearchTerminal } from './header-parts/SearchTerminal';
import { UserMenu } from './header-parts/UserMenu';
import { GuestActions } from './header-parts/GuestActions';
import { NotificationBell } from '@presentation/feature/notification/components/NotificationBell';

/**
 * HeaderNavDropdown: A dropdown menu for header navigation categories.
*/
const HeaderNavDropdown = ({ label, links, isOpen, onToggle, onClose, comingSoon }) => {
    const ref = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Check if any child is active
    const hasActiveChild = !comingSoon && links.some(l => location.pathname === l.path);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={onToggle}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all duration-200 cursor-pointer",
                    isOpen || hasActiveChild
                        ? "text-accent-primary bg-accent-primary/5" 
                        : "text-text-muted hover:text-text-primary hover:bg-surface-sunken/50"
                )}
            >
                {label}
                <ChevronDown 
                    size={12} 
                    className={cn("transition-transform duration-300", isOpen && "rotate-180")} 
                />
            </button>

            {/* Dropdown Panel */}
            <div className={cn(
                "absolute top-full left-0 mt-2 min-w-[220px] rounded-xl border border-border-subtle overflow-hidden",
                "bg-surface/95 backdrop-blur-xl shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)]",
                "transition-all duration-200 origin-top-left",
                isOpen 
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            )}>
                {comingSoon ? (
                    <div className="px-6 py-8 flex flex-col items-center gap-2 text-center bg-gradient-to-b from-accent-primary/5 to-transparent">
                        <Database size={24} className="text-accent-primary opacity-50 mb-2 animate-pulse" />
                        <p className="text-sm font-bold text-text-primary tracking-tight">Coming Soon</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-relaxed">Inshaa Allah</p>
                    </div>
                ) : (
                    <div className="py-2">
                        {links.map(({ icon: Icon, label: linkLabel, path }) => {
                            const isActive = location.pathname === path;
                            return (
                                <Link 
                                    key={path} 
                                    to={path} 
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 text-sm no-underline transition-colors duration-150",
                                        isActive 
                                            ? "text-accent-primary bg-accent-primary/5" 
                                            : "text-text-muted hover:text-text-primary hover:bg-surface-sunken/60"
                                    )}
                                >
                                    <Icon size={16} className={isActive ? "text-accent-primary" : ""} />
                                    <span className="font-medium">{linkLabel}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * HeaderNavLink: A single top-level nav link without dropdown.
*/
const HeaderNavLink = ({ icon: Icon, label, path }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link
            to={path}
            className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all duration-200 no-underline",
                isActive 
                    ? "text-accent-primary bg-accent-primary/5"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-sunken/50"
            )}
        >
            <Icon size={14} />
            {label}
        </Link>
    );
};

// ─── Nav Data ───
const NAV_LEARNING = [
    { icon: BookOpen, label: 'Courses', path: PATHS.COURSES },
    { icon: Code2, label: 'Problems', path: PATHS.PROBLEMS },
    { icon: Map, label: 'Roadmaps', path: PATHS.ROADMAPS },
];

const NAV_COMMUNITY = [
    { icon: LayoutDashboard, label: 'Feed', path: PATHS.FEED },
    { icon: FileText, label: 'Articles', path: PATHS.ARTICLES },
    { icon: Calendar, label: 'Events', path: PATHS.EVENTS },
];

const NAV_WORKSPACES = [];


export const Header = () => {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // Auth state
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // Determine if we are in Focus Mode (e.g., CMS or Problem Details workspace)
    const isFocusMode = location.pathname.startsWith(PATHS.CONTENT_MANAGEMENT) || location.pathname.includes('/problems/');

    const toggleDropdown = useCallback((name) => {
        setOpenDropdown(prev => prev === name ? null : name);
    }, []);

    const closeAll = useCallback(() => {
        setOpenDropdown(null);
        setMobileOpen(false);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        closeAll();
    }, [location.pathname]);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-500",
            "bg-surface/90 backdrop-blur-2xl text-text-primary shadow-ring"
        )}>
            <div className="max-w-[1440px] mx-auto w-full h-full flex items-center px-4 md:px-8 justify-between">
                {/* Left Section: Logo */}
                <div className="flex items-center gap-4">
                    <Link to={isAuthenticated ? PATHS.COURSES : PATHS.DASHBOARD} className="no-underline">
                        <AxeCodeLogo 
                            size="text-lg"
                        />
                    </Link>

                    {/* Desktop Navigation — Category Headlines with Dropdowns */}
                    {isAuthenticated && !isFocusMode && (
                        <nav className="hidden lg:flex items-center gap-1 ml-4">
                            <HeaderNavDropdown 
                                label="Learning" 
                                links={NAV_LEARNING}
                                isOpen={openDropdown === 'learning'} 
                                onToggle={() => toggleDropdown('learning')}
                                onClose={() => setOpenDropdown(null)}
                            />
                            <HeaderNavDropdown 
                                label="Community" 
                                links={NAV_COMMUNITY}
                                isOpen={openDropdown === 'community'} 
                                onToggle={() => toggleDropdown('community')}
                                onClose={() => setOpenDropdown(null)}
                            />
                            <HeaderNavDropdown 
                                label="Workspaces" 
                                links={NAV_WORKSPACES}
                                comingSoon={true}
                                isOpen={openDropdown === 'workspaces'} 
                                onToggle={() => toggleDropdown('workspaces')}
                                onClose={() => setOpenDropdown(null)}
                            />

                            {/* CMS — Publisher Only */}
                            <PermissionGate allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                                <HeaderNavLink icon={Database} label="CMS" path={PATHS.CONTENT_MANAGEMENT} />
                            </PermissionGate>
                        </nav>
                    )}
                </div>

                {/* Center: Search (Desktop) */}
                {isAuthenticated && !isFocusMode && (
                    <div className="hidden md:block">
                        <SearchTerminal />
                    </div>
                )}

                {/* Right Section: Actions */}
                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <>
                            {/* Messages */}
                            {/* <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-xl transition-all group hidden md:flex">
                                <MessageSquare size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-primary rounded-full border-2 border-background glow-pulse" />
                            </button> */}

                            {/* Notifications */}
                            <div className="hidden md:block">
                                <NotificationBell />
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-border-subtle mx-1 hidden md:block" />
                        </>
                    )}

                    {/* Auth / Profile Area */}
                    {isAuthenticated ? (
                        <UserMenu user={user} />
                    ) : (
                        <GuestActions />
                    )}

                    {/* Mobile Hamburger (Authenticated Only) */}
                    {isAuthenticated && !isFocusMode && (
                        <button 
                            onClick={() => setMobileOpen(!mobileOpen)} 
                            className="lg:hidden p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    )}
                </div>

                {/* Mobile Slide-Down Panel */}
                {isAuthenticated && !isFocusMode && (
                    <div className={cn(
                        "fixed top-16 left-0 right-0 bg-surface/98 backdrop-blur-2xl border-b border-border-subtle",
                        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden lg:hidden z-40",
                        mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
                    )}>
                        <div className="p-5 flex flex-col gap-1 overflow-y-auto max-h-[70vh]">
                            {/* Learning */}
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50 px-3 pt-2 pb-1">Learning</div>
                            {NAV_LEARNING.map(({ icon: Icon, label, path }) => (
                                <Link key={path} to={path} onClick={closeAll} className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg no-underline transition-colors",
                                    location.pathname === path 
                                        ? "text-accent-primary bg-accent-primary/5"
                                        : "text-text-muted hover:text-text-primary hover:bg-surface-sunken"
                                )}>
                                    <Icon size={16} /> {label}
                                </Link>
                            ))}

                            <div className="h-px bg-border-subtle/40 my-2" />

                            {/* Community */}
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50 px-3 pt-2 pb-1">Community</div>
                            {NAV_COMMUNITY.map(({ icon: Icon, label, path }) => (
                                <Link key={path} to={path} onClick={closeAll} className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg no-underline transition-colors",
                                    location.pathname === path 
                                        ? "text-accent-primary bg-accent-primary/5"
                                        : "text-text-muted hover:text-text-primary hover:bg-surface-sunken"
                                )}>
                                    <Icon size={16} /> {label}
                                </Link>
                            ))}

                            <div className="h-px bg-border-subtle/40 my-2" />

                            {/* Workspaces */}
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50 px-3 pt-2 pb-1">Workspaces</div>
                            <div className="px-3 py-4 flex flex-col gap-1 bg-accent-primary/5 rounded-xl border border-accent-primary/10">
                                <p className="text-sm font-bold text-accent-primary tracking-tight">Coming Soon</p>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-relaxed">Inshaa Allah</p>
                            </div>

                            {/* CMS — Publisher Only (Mobile) */}
                            <PermissionGate allowedRoles={[ROLE_TYPES.PUBLISHER]}>
                                <div className="h-px bg-border-subtle/40 my-2" />
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50 px-3 pt-2 pb-1">Management</div>
                            <Link to={PATHS.CONTENT_MANAGEMENT} onClick={closeAll} className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg no-underline transition-colors",
                                location.pathname.startsWith(PATHS.CONTENT_MANAGEMENT)
                                    ? "text-accent-primary bg-accent-primary/5"
                                    : "text-text-muted hover:text-text-primary hover:bg-surface-sunken"
                            )}>
                                <Database size={16} /> Content Management
                            </Link>
                            </PermissionGate>

                            {/* Mobile: Messages & Search */}
                            <div className="h-px bg-border-subtle/40 my-2" />
                            {/* <Link to={PATHS.MESSAGES} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline">
                                <MessageSquare size={16} /> Messages
                            </Link> */}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
