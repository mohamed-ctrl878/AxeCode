import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    FileText, 
    BookOpen, 
    Code2, 
    Calendar, 
    Image,
    Map
} from 'lucide-react';
import { CMSSidebar } from '../components/CMSSidebar';
import { CMSActionBar } from '../components/CMSActionBar';
import { PATHS } from '@presentation/routes/paths';

/**
 * CMS Section definitions.
 * Single source of truth for sidebar rendering.
 */
const CMS_SECTIONS = [
    { name: 'Courses', icon: BookOpen },
    { name: 'Articles', icon: FileText },
    { name: 'Problems', icon: Code2 },
    { name: 'Roadmaps', icon: Map },
    { name: 'Events', icon: Calendar },
    { name: 'Media', icon: Image }
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
    const sectionSlug = pathSegments[0] || 'courses';
    const activeSection = sectionSlug.charAt(0).toUpperCase() + sectionSlug.slice(1);

    // Build sections array without counts (each module page owns its own data)
    const sections = CMS_SECTIONS.map(s => ({
        ...s,
        count: '—'
    }));

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col h-[calc(100vh-4rem)]">
            <CMSActionBar onExit={() => navigate(-1)} />

            <div className="flex-1 flex gap-0 border border-white/5 rounded-3xl overflow-hidden glass h-full">
                <CMSSidebar
                    sections={sections}
                    activeSection={activeSection}
                />

                <div className="flex-1 p-8 overflow-y-auto bg-surface-dark/30 scrollbar-hide">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CMSLayout;
