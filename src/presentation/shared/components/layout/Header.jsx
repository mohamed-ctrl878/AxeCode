import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
    Search, Bell, MessageSquare, User, Menu, Command, 
    LogOut, Settings, Moon, Sun, ChevronDown, ShieldCheck 
} from 'lucide-react';
import { logout } from '@infrastructure/store/authSlice';
import { cn } from '@core/utils/cn';
import { useUI } from '../../provider/UIProvider';
import { PATHS } from '../../../routes/paths';

/**
 * Header: Global navigation and action bar.
 * Enhanced with Profile Dropdown & Theme Integration.
 */
export const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { isSidebarOpen, theme, setTheme } = useUI();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Select identity from global auth state
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Determine if we are in Focus Mode (e.g., CMS)
    const isFocusMode = location.pathname.startsWith(PATHS.CONTENT_MANAGEMENT);

    const handleLogout = () => {
        setIsProfileOpen(false);
        dispatch(logout());
        navigate(PATHS.LOGIN);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className={cn(
            "fixed top-0 right-0 h-16 glass border-b border-border-subtle z-40 transition-all duration-500 flex items-center px-4 md:px-6 justify-between",
            !isFocusMode ? [
                "left-0 md:left-20",
                isSidebarOpen && "md:left-64"
            ] : "left-0"
        )}>

            {/* Search Section */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for courses, problems, or events..." 
                        className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2 pl-10 pr-12 text-sm focus:border-accent-primary outline-none transition-all placeholder:text-text-muted/50 focus:bg-surface-dark"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-border-subtle/50 px-1.5 py-0.5 rounded border border-white/5">
                        <Command size={10} className="text-text-muted" />
                        <span className="text-[10px] font-mono text-text-muted">K</span>
                    </div>
                </div>
            </div>

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
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className={cn(
                                "flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all group",
                                isProfileOpen ? "bg-surface-dark ring-1 ring-accent-primary/20" : "hover:bg-surface-dark"
                            )}
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 border border-accent-primary/20 flex items-center justify-center text-accent-primary shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                {user?.avatar?.url ? (
                                   <img 
                                        src={`${import.meta.env.VITE_API_BASE_URL || ''}${user.avatar.url}`} 
                                        alt={user.username} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <User size={18} strokeWidth={2.5} />
                                )}
                                <div className="absolute inset-0 bg-accent-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            <div className="text-left hidden sm:block max-w-[120px]">
                                <p className="text-xs font-bold text-text-primary truncate leading-none mb-1">{user?.username}</p>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck size={10} className="text-accent-primary" />
                                    <span className="text-[9px] text-text-muted uppercase tracking-wider font-medium">Verified</span>
                                </div>
                            </div>

                            <ChevronDown 
                                size={14} 
                                className={cn(
                                    "text-text-muted transition-transform duration-300",
                                    isProfileOpen && "rotate-180"
                                )} 
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute top-[calc(100%+12px)] right-0 w-64 glass-morphism bento-card border border-border-subtle shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300 p-2 transform origin-top-right">
                                {/* User Info Header */}
                                <div className="p-3 mb-1 border-b border-border-subtle/30">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-2">Connected Node</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20">
                                            <User size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-text-primary truncate">{user?.username}</p>
                                            <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Group */}
                                <div className="space-y-1">
                                    <Link 
                                        to={PATHS.PROFILE} 
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all group"
                                    >
                                        <User size={16} className="group-hover:text-accent-primary" />
                                        My Profile
                                    </Link>
                                    
                                    <Link 
                                        to={PATHS.SETTINGS} 
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all group"
                                    >
                                        <Settings size={16} className="group-hover:text-accent-primary" />
                                        System Settings
                                    </Link>

                                    <button 
                                        onClick={toggleTheme}
                                        className="flex items-center justify-between w-full px-3 py-2.5 text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {theme === 'dark' ? (
                                                <Sun size={16} className="group-hover:text-yellow-400" />
                                            ) : (
                                                <Moon size={16} className="group-hover:text-violet-400" />
                                            )}
                                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                        </div>
                                        <div className="relative w-8 h-4 bg-surface-dark rounded-full border border-border-subtle">
                                            <div className={cn(
                                                "absolute top-0.5 w-[10px] h-[10px] rounded-full transition-all duration-300",
                                                theme === 'dark' ? "right-1 bg-yellow-400" : "left-1 bg-violet-400"
                                            )} />
                                        </div>
                                    </button>
                                </div>

                                <div className="mt-2 pt-2 border-t border-border-subtle/30">
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-bold text-red-400/80 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
                                    >
                                        <LogOut size={16} />
                                        Sign Out Session
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
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
                )}
            </div>
        </header>
    );
};
