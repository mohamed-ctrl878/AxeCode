import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ChevronDown, 
    BookOpen, 
    Code2, 
    Map, 
    Calendar, 
    Video, 
    FileText,
    Menu,
    X,
    Sparkles,
    FileCode2,
    Headphones,
    Zap,
    Globe,
    Users,
    Github,
    LayoutDashboard
} from 'lucide-react';
import { cn } from '@core/utils/cn';
import { PATHS } from '@presentation/routes/paths';
import AxeCodeLogo from '../AxeCodeLogo';

/**
 * DropdownMenu: Reusable animated dropdown for the GuestHeader.
 */
const DropdownMenu = ({ label, children, isOpen, onToggle, onClose }) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={onToggle}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isOpen 
                        ? "text-accent-primary bg-accent-primary/5" 
                        : "text-text-muted hover:text-text-primary hover:bg-surface-sunken/50"
                )}
            >
                {label}
                <ChevronDown 
                    size={14} 
                    className={cn(
                        "transition-transform duration-300",
                        isOpen && "rotate-180"
                    )} 
                />
            </button>

            {/* Dropdown Panel */}
            <div className={cn(
                "absolute top-full left-0 mt-2 min-w-[260px] py-2 rounded-xl border border-border-subtle",
                "bg-surface/95 backdrop-blur-xl ",
                "transition-all duration-300 origin-top-left",
                isOpen 
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            )}>
                {children}
            </div>
        </div>
    );
};

/**
 * DropdownItem: A single item inside a DropdownMenu.
 */
const DropdownItem = ({ icon: Icon, label, description, to, onClick, isExternal }) => {
    const content = (
        <div className="flex items-start gap-3 px-4 py-3 hover:bg-surface-sunken/60 transition-colors duration-150 cursor-pointer group">
            <div className="mt-0.5 w-8 h-8 rounded-lg bg-accent-primary/8 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/15 transition-colors">
                <Icon size={16} className="text-accent-primary" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">{label}</span>
                {description && (
                    <span className="text-[12px] text-text-muted leading-snug mt-0.5">{description}</span>
                )}
            </div>
        </div>
    );

    if (isExternal) {
        return (
            <a 
                href={to} 
                target="_blank" 
                rel="noreferrer" 
                className="no-underline block" 
                onClick={onClick}
            >
                {content}
            </a>
        );
    }

    if (to) {
        return <Link to={to} className="no-underline block" onClick={onClick}>{content}</Link>;
    }
    return <div onClick={onClick}>{content}</div>;
};

/**
 * GuestHeader: Marketing-style header for unauthenticated users.
 * Displays nav links with dropdowns, logo, and auth action buttons.
 */
export const GuestHeader = () => {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleDropdown = (name) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    const closeAll = () => {
        setOpenDropdown(null);
        setMobileOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface/90 backdrop-blur-2xl">
            <div className="max-w-[1440px] mx-auto w-full h-full flex items-center px-6 md:px-10 justify-between">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="no-underline">
                        <AxeCodeLogo 
                            size="text-lg"
                        />
                    </Link>
                </div>

                {/* Center: Navigation — Desktop */}
                <nav className="hidden lg:flex items-center gap-1">
                    {/* Platform Dropdown */}
                    <DropdownMenu 
                        label="Platform" 
                        isOpen={openDropdown === 'platform'} 
                        onToggle={() => toggleDropdown('platform')}
                        onClose={() => setOpenDropdown(null)}
                    >
                        <DropdownItem 
                            icon={BookOpen} 
                            label="Courses" 
                            description="Deep-dive manuscripts and learning circuits" 
                            to={`${PATHS.DOCUMENTATION}#Learning`} 
                            onClick={closeAll} 
                        />
                        <DropdownItem 
                            icon={Users} 
                            label="Workspaces" 
                            description="Upcoming collaborative 'Forge' environments" 
                            to={`${PATHS.DOCUMENTATION}#Workspaces`} 
                            onClick={closeAll} 
                        />
                        <DropdownItem 
                            icon={Map} 
                            label="Roadmaps" 
                            description="Career-guided scholarly skill trees" 
                            to={`${PATHS.DOCUMENTATION}#Learning`} 
                            onClick={closeAll} 
                        />
                        <DropdownItem 
                            icon={LayoutDashboard} 
                            label="Community" 
                            description="Sharing the craft in the engineering Agora" 
                            to={`${PATHS.DOCUMENTATION}#Community`} 
                            onClick={closeAll} 
                        />
                        <DropdownItem 
                            icon={Calendar} 
                            label="Events" 
                            description="Professional salons and engineering workshops" 
                            to={`${PATHS.DOCUMENTATION}#Events`} 
                            onClick={closeAll} 
                        />
                    </DropdownMenu>

                    {/* What's New */}
                    <Link 
                        to={`${PATHS.DOCUMENTATION}#Workspaces`} 
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-sunken/50 rounded-lg transition-all duration-200 no-underline"
                        onClick={closeAll}
                    >
                        <Sparkles size={14} className="text-accent-primary" />
                        What's New
                    </Link>

                    {/* Resources Dropdown */}
                    <DropdownMenu 
                        label="Resources" 
                        isOpen={openDropdown === 'resources'} 
                        onToggle={() => toggleDropdown('resources')}
                        onClose={() => setOpenDropdown(null)}
                    >
                        <DropdownItem 
                            icon={FileText} 
                            label="Documentation" 
                            description="The definitive Scholar's Manual" 
                            to={PATHS.DOCUMENTATION} 
                            onClick={closeAll} 
                        />
                        <DropdownItem 
                            icon={Github} 
                            label="Support" 
                            description="Contribution & Backend Repository" 
                            to="https://github.com/mohamed-ctrl878/AxeCode_backend" 
                            isExternal={true}
                            onClick={closeAll} 
                        />
                    </DropdownMenu>
                </nav>

                {/* Right: Auth Actions — Desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    <button 
                        onClick={() => navigate(PATHS.LOGIN)}
                        className="px-5 py-2 text-sm font-semibold text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
                    >
                        Log in
                    </button>
                    <button 
                        onClick={() => navigate(PATHS.REGISTER)}
                        className="px-6 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer"
                    >
                        Get Started
                    </button>
                </div>

                {/* Mobile: Hamburger Toggle */}
                <button 
                    onClick={() => setMobileOpen(!mobileOpen)} 
                    className="lg:hidden p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {/* Mobile: Slide-Down Panel */}
                <div className={cn(
                    "fixed top-16 left-0 right-0 bg-surface/98 backdrop-blur-2xl border-b border-border-subtle  ",
                    "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden lg:hidden",
                    mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="p-6 flex flex-col gap-2 overflow-y-auto max-h-[70vh]">
                        {/* Mobile Nav Sections */}
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50 px-3 pt-2 pb-1">Platform</div>
                        <Link to={`${PATHS.DOCUMENTATION}#Learning`} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5">
                            <BookOpen size={16} className="text-accent-primary" /> Courses
                        </Link>
                        <Link to={`${PATHS.DOCUMENTATION}#Workspaces`} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5">
                            <Users size={16} className="text-accent-primary" /> Workspaces
                        </Link>
                        <Link to={`${PATHS.DOCUMENTATION}#Learning`} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5">
                            <Map size={16} className="text-accent-primary" /> Roadmaps
                        </Link>
                        <Link to={`${PATHS.DOCUMENTATION}#Community`} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5">
                            <LayoutDashboard size={16} className="text-accent-primary" /> Community
                        </Link>
                        <Link to={`${PATHS.DOCUMENTATION}#Events`} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5">
                            <Calendar size={16} className="text-accent-primary" /> Events
                        </Link>

                        <div className="h-px bg-border-subtle/40 my-2" />

                        <Link to={`${PATHS.DOCUMENTATION}#Workspaces`} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5">
                            <Sparkles size={16} className="text-accent-primary" /> What's New
                        </Link>
                        <Link to={PATHS.DOCUMENTATION} onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5">
                            <FileText size={16} className="text-accent-primary" /> Documentation
                        </Link>
                        <a 
                            href="https://github.com/mohamed-ctrl878/AxeCode_backend" 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={closeAll} 
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-lg no-underline border-b border-white/5"
                        >
                            <Github size={16} className="text-accent-primary" /> Support
                        </a>

                        {/* Mobile Auth Buttons */}
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border-subtle/40">
                            <button 
                                onClick={() => { navigate(PATHS.LOGIN); closeAll(); }}
                                className="w-full py-3 text-sm font-semibold text-text-primary bg-surface-sunken rounded-xl hover:bg-surface transition-colors cursor-pointer"
                            >
                                Log in
                            </button>
                            <button 
                                onClick={() => { navigate(PATHS.REGISTER); closeAll(); }}
                                className="w-full py-3 rounded-xl btn-primary text-sm font-semibold cursor-pointer"
                            >
                                Get Started — Free
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
