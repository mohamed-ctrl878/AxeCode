import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    FileText, 
    BookOpen, 
    Code2, 
    Calendar, 
    Image,
    Map,
    Flag,
    PenTool,
    ShieldAlert,
    Bell,
    MessageSquare,
    Tag,
    HelpCircle,
    BookMarked,
    Layers,
    Box,
    LayoutDashboard,
    Wallet,
    Users
} from 'lucide-react';
import { CMSSidebar } from '../components/CMSSidebar';
import { CMSActionBar } from '../components/CMSActionBar';
import { CMSMobileNav } from '../components/CMSMobileNav';
import { PATHS } from '@presentation/routes/paths';

/**
 * CMS Section definitions.
 * Single source of truth for sidebar rendering.
 * Grouped by category for better organization.
 */
const CMS_SECTIONS = [
    { name: 'Dashboard', icon: LayoutDashboard },
    // Content Management
    { name: 'Courses', icon: BookOpen },
    { name: 'Problems', icon: Code2 },
    { name: 'Roadmaps', icon: Map },
    { name: 'Events', icon: Calendar },
    // Moderation & Governance
    { name: 'Accounts', icon: Users },
    { name: 'Reports', icon: ShieldAlert },
    { name: 'Admin-Alerts', icon: Bell },
    // Configuration
    { name: 'Course-Types', icon: Layers },
    { name: 'Problem-Types', icon: Box },
    { name: 'Global-Tags', icon: Tag },
    { name: 'Report-Reasons', icon: Flag },
    { name: 'FAQs', icon: HelpCircle },
    { name: 'Help-Centers', icon: BookMarked },
    { name: 'Media', icon: Image },
];

/**
 * CMSLayout - Shared shell for all CMS module pages.
 * Renders the ActionBar + Sidebar and delegates content to <Outlet />.
 * Follows SRP: Only handles layout concerns and active-section derivation.
 */
const CMSLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Derive the active section from the current URL pathname
    const pathSegments = location.pathname.replace(PATHS.CONTENT_MANAGEMENT, '').split('/').filter(Boolean);
    const sectionSlug = pathSegments[0] || 'dashboard';
    const activeSection = sectionSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');

    // Build sections array without counts (each module page owns its own data)
    const sections = CMS_SECTIONS.map(s => ({
        ...s,
        count: '—'
    }));

    return (
        <div className="md:col-span-12 w-full animation-fade-in flex flex-col min-h-[calc(100vh-20rem)] mt-8 md:mt-0">
            {/* Removed CMSActionBar as global Header is now active */}

            <CMSMobileNav sections={sections} activeSection={activeSection} />

            <div className="flex-1 flex gap-0 border border-border-subtle rounded-3xl glass mx-4 mb-4 md:mx-0 md:mb-0 relative">
                <CMSSidebar
                    sections={sections}
                    activeSection={activeSection}
                />

                <div className="flex-1 min-w-0 p-4 md:p-8 bg-surface-dark/30 rounded-3xl lg:rounded-l-none lg:rounded-r-3xl overflow-y-auto scrollbar-hide">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CMSLayout;
