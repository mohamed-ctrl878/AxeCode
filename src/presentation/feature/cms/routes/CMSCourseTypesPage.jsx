import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useFetchAdminCategorizations } from '@domain/useCase/useFetchAdminCategorizations';
import { useCreateCategorization } from '@domain/useCase/useCreateCategorization';
import { CMSResourceTable } from '../components/CMSResourceTable';
import { CMSCreateCategorizationModal } from '../components/CMSCreateCategorizationModal';

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

    const { createCourseType, inProgress: isCreating } = useCreateCategorization();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleCreate = async (data) => {
        try {
            await createCourseType(data);
            setIsModalOpen(false);
            reloadCourseTypes();
        } catch (err) {
            console.error("Failed to create course type:", err);
        }
    };

    return (
        <>
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
                onAdd={() => setIsModalOpen(true)}
                addLabel="Add Course Type"
            />

            <CMSCreateCategorizationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
                modalHeader="Create Course Track"
                isLoading={isCreating}
            />
        </>
    );
};

export default CMSCourseTypesPage;
