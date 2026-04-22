import React from 'react';
import { BookOpen } from 'lucide-react';
import { useFetchAdminCourses } from '@domain/useCase/useFetchAdminCourses';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSCoursesPage - Isolated CMS module for managing Courses.
 * Follows SRP: Only fetches and displays course data.
 */
const CMSCoursesPage = () => {
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
        />
    );
};

export default CMSCoursesPage;
