import React from 'react';
import { 
    BookOpen, 
    Code2, 
    Map, 
    MessageSquare, 
    LayoutDashboard, 
    FileText, 
    Calendar, 
    Video, 
    Image,
    ChevronLeft,
    ChevronRight,
    Search,
    UserCircle,
    Settings,
    LogOut,
    Database
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { useUI } from '@presentation/shared/provider/UIProvider';
import { cn } from '@core/utils/cn';

const NavItem = ({ icon: Icon, label, path, collapsed }) => {
    const location = useLocation();
    const active = location.pathname === path;

    return (
        <Link to={path} className={cn(
            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group no-underline",
            active ? "bg-accent-primary/10 text-accent-primary" : "text-text-muted hover:bg-surface-dark hover:text-text-primary",
            collapsed && "justify-center"
        )}>
            <Icon size={20} className={cn(
                "shrink-0 transition-transform group-hover:scale-110",
                active && "glow-pulse"
            )} />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </Link>
    );
};


const NavCategory = ({ label, collapsed }) => (
    <div className={cn(
        "px-3 mt-6 mb-2 text-[10px] uppercase tracking-widest text-text-muted/50 font-bold",
        collapsed && "text-center"
    )}>
        {collapsed ? "•••" : label}
    </div>
);

export const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useUI();

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen glass border-r border-border-subtle transition-all duration-500 z-50 flex flex-col",
            "transform -translate-x-full md:translate-x-0",
            isSidebarOpen ? "w-64 translate-x-0" : "w-20 md:translate-x-0"
        )}>

            {/* Header / Brand */}
            <div className="p-6 flex items-center justify-between">
                {isSidebarOpen && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
                            <Code2 size={20} className="text-background" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">AXE CODE</span>
                    </div>
                )}
                {!isSidebarOpen && (
                    <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center mx-auto">
                        <Code2 size={20} className="text-background" />
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button 
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border-subtle bg-surface-dark flex items-center justify-center text-text-muted hover:text-accent-primary transition-colors cursor-pointer"
            >
                {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
                <NavCategory label="Learning" collapsed={!isSidebarOpen} />
                <NavItem icon={BookOpen} label="Courses" path={PATHS.COURSES} collapsed={!isSidebarOpen} />
                <NavItem icon={Code2} label="Problems" path={PATHS.PROBLEMS} collapsed={!isSidebarOpen} />
                <NavItem icon={Map} label="Roadmaps" path={PATHS.ROADMAPS} collapsed={!isSidebarOpen} />

                <NavCategory label="Community" collapsed={!isSidebarOpen} />
                <NavItem icon={LayoutDashboard} label="Feed" path={PATHS.FEED} collapsed={!isSidebarOpen} />
                <NavItem icon={FileText} label="Articles" path={PATHS.ARTICLES} collapsed={!isSidebarOpen} />
                <NavItem icon={Calendar} label="Events" path={PATHS.EVENTS} collapsed={!isSidebarOpen} />

                <NavCategory label="Resources" collapsed={!isSidebarOpen} />
                <NavItem icon={Image} label="Media Library" path={PATHS.MEDIA} collapsed={!isSidebarOpen} />
                <NavItem icon={Video} label="Live Streams" path={PATHS.LIVE} collapsed={!isSidebarOpen} />
                
                <NavCategory label="Management" collapsed={!isSidebarOpen} />
                <NavItem icon={Database} label="Content Management" path={PATHS.CONTENT_MANAGEMENT} collapsed={!isSidebarOpen} />

                <NavCategory label="Social" collapsed={!isSidebarOpen} />
                <NavItem icon={MessageSquare} label="Messages" path={PATHS.MESSAGES} collapsed={!isSidebarOpen} />
            </div>

            {/* Footer / User Profile */}
            <div className="p-3 border-t border-border-subtle">
                <NavItem icon={UserCircle} label="Profile" path={PATHS.PROFILE} collapsed={!isSidebarOpen} />
                <NavItem icon={Settings} label="Settings" path={PATHS.SETTINGS} collapsed={!isSidebarOpen} />
                <NavItem icon={LogOut} label="Logout" path={PATHS.DASHBOARD} collapsed={!isSidebarOpen} />
            </div>

        </aside>
    );
};
