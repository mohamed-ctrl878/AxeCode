import React from 'react';
import { Layers } from 'lucide-react';
import { useFetchAdminCategorizations } from '@domain/useCase/useFetchAdminCategorizations';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSCourseTypesPage: Admin page for managing Course Types.
 */
const CMSCourseTypesPage = () => {
    const { 
        courseTypes, 
        isLoading, 
        reloadCourseTypes, 
        deleteCourseType,
        courseTypesPage,
        courseTypesTotalPages,
        courseTypesTotalItems,
        setCourseTypePage,
        setCourseTypeSearch
    } = useFetchAdminCategorizations();

    // Map DTO to CMSResourceTable format
    const tableItems = courseTypes.map(type => ({
        ...type,
        title: type.title || 'Untitled Track',
        type: 'Course Track',
        createdAt: type.createdAt,
        isActive: true,
        statusLabel: 'Categorization',
        statusStyles: 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30',
        metricValue: type.courseCount || 0
    }));

    return (
        <CMSResourceTable 
            sectionName="Course-Types" 
            items={tableItems} 
            columns={{ status: 'Taxonomy', metric: 'Courses' }}
            isLoading={isLoading} 
            icon={Layers} 
            onRefresh={reloadCourseTypes}
            onDelete={deleteCourseType}
            serverPagination={true}
            serverPage={courseTypesPage}
            serverTotalPages={courseTypesTotalPages}
            serverTotalItems={courseTypesTotalItems}
            onPageChange={setCourseTypePage}
            onSearchChange={setCourseTypeSearch}
        />
    );
};

export default CMSCourseTypesPage;
