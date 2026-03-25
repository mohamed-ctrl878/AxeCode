import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    FileText, 
    BookOpen, 
    Code2, 
    Calendar, 
    Image
} from 'lucide-react';
import { CMSSidebar } from '../components/CMSSidebar';
import { CMSActionBar } from '../components/CMSActionBar';
import { CMSResourceTable } from '../components/CMSResourceTable';
import { useFetchAdminCourses } from '@domain/useCase/useFetchAdminCourses';
import { useFetchAdminEvents } from '@domain/useCase/useFetchAdminEvents';

/**
 * CMSPage: Orchestrates the modular management interface.
 * Follows SRP: Delegates UI logic to child components.
 */
export const CMSPage = () => {
    const navigate = useNavigate();
    const { section } = useParams();
    
    const { courses, isLoading: isCoursesLoading, fetch: fetchCourses } = useFetchAdminCourses();
    const { events, isLoading: isEventsLoading, fetch: fetchEvents } = useFetchAdminEvents();
    
    // Normalize URL param (e.g. 'courses' => 'Courses')
    const activeSection = section ? section.charAt(0).toUpperCase() + section.slice(1) : 'Courses';

    const sections = [
        { name: 'Courses', icon: BookOpen, count: courses?.length || 0 },
        { name: 'Articles', icon: FileText, count: 0 },
        { name: 'Problems', icon: Code2, count: 0 },
        { name: 'Events', icon: Calendar, count: events?.length || 0 },
        { name: 'Media', icon: Image, count: 0 }
    ];

    const currentSection = sections.find(s => s.name === activeSection);

    let items = [];
    let isLoading = false;
    let refreshFn = () => {};
    
    if (activeSection === 'Courses') {
        items = courses || [];
        isLoading = isCoursesLoading;
        refreshFn = fetchCourses;
    } else if (activeSection === 'Events') {
        items = events || [];
        isLoading = isEventsLoading;
        refreshFn = fetchEvents;
    } else {
        items = []; 
    }

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col h-[calc(100vh-4rem)]">
            <CMSActionBar onExit={() => navigate(-1)} />

            <div className="flex-1 flex gap-0 border border-white/5 rounded-3xl overflow-hidden glass h-full">
                <CMSSidebar
                    sections={sections}
                    activeSection={activeSection}
                />

                <div className="flex-1 p-8 overflow-y-auto bg-surface-dark/30 scrollbar-hide">
                    <CMSResourceTable
                        sectionName={activeSection}
                        items={items}
                        isLoading={isLoading}
                        icon={currentSection?.icon || BookOpen}
                        onRefresh={refreshFn}
                    />
                </div>
            </div>
        </div>
    );
};

export default CMSPage;
