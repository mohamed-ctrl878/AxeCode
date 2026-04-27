import React, { useState } from 'react';
import { BookOpen, Layers } from 'lucide-react';
import { useFetchAdminCourses } from '@domain/useCase/useFetchAdminCourses';
import { CMSResourceTable } from '../components/CMSResourceTable';
import CMSCourseTypesPage from './CMSCourseTypesPage';
import { cn } from '@core/utils/cn';

/**
 * CMSCoursesPage - Tabbed module for managing Courses and their Classifications.
 */
const CMSCoursesPage = () => {
    const [activeTab, setActiveTab] = useState('archive'); // 'archive' | 'types'

    const { 
        courses, 
        isLoading, 
        fetch: fetchCourses,
        currentPage,
        totalPages,
        totalItems,
        setPage,
        setSearch 
    } = useFetchAdminCourses();

    return (
        <div className="flex flex-col gap-8 w-full animation-fade-in">
            {/* Control Panel - Shared Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-sunken/50 border border-border-subtle rounded-2xl w-fit mx-auto shadow-sm backdrop-blur-md">
                <button 
                    onClick={() => setActiveTab('archive')}
                    className={cn(
                        "flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                        activeTab === 'archive' 
                            ? "bg-near-black text-ivory shadow-lg scale-[1.02]" 
                            : "text-text-muted hover:text-text-primary hover:bg-surface-sunken"
                    )}
                >
                    <BookOpen size={16} />
                    Courses Archive
                </button>
                <button 
                    onClick={() => setActiveTab('types')}
                    className={cn(
                        "flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                        activeTab === 'types' 
                            ? "bg-near-black text-ivory shadow-lg scale-[1.02]" 
                            : "text-text-muted hover:text-text-primary hover:bg-surface-sunken"
                    )}
                >
                    <Layers size={16} />
                    Course Types
                </button>
            </div>

            <div className="animation-fade-in">
                {activeTab === 'archive' ? (
                    <CMSResourceTable
                        sectionName="Courses"
                        items={courses || []}
                        isLoading={isLoading}
                        icon={BookOpen}
                        onRefresh={fetchCourses}
                        serverPagination={true}
                        serverPage={currentPage}
                        serverTotalPages={totalPages}
                        serverTotalItems={totalItems}
                        onPageChange={setPage}
                        onSearchChange={setSearch}
                        addLabel="Compose New Course"
                    />
                ) : (
                    <CMSCourseTypesPage />
                )}
            </div>
        </div>
    );
};

export default CMSCoursesPage;
