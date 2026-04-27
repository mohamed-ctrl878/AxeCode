import React, { useState } from 'react';
import { Box } from 'lucide-react';
import { useFetchAdminCategorizations } from '@domain/useCase/useFetchAdminCategorizations';
import { useCreateCategorization } from '@domain/useCase/useCreateCategorization';
import { CMSResourceTable } from '../components/CMSResourceTable';
import { CMSCreateCategorizationModal } from '../components/CMSCreateCategorizationModal';

/**
 * CMSProblemTypesPage: Admin page for managing Problem Types.
 */
const CMSProblemTypesPage = () => {
    const { 
        problemTypes, 
        isLoading, 
        reloadProblemTypes, 
        deleteProblemType,
        problemTypesPage,
        problemTypesTotalPages,
        problemTypesTotalItems,
        setProblemTypePage,
        setProblemTypeSearch
    } = useFetchAdminCategorizations();

    const { createProblemType, inProgress: isCreating } = useCreateCategorization();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Map DTO to CMSResourceTable format
    const tableItems = problemTypes.map(type => ({
        ...type,
        title: type.title || 'Untitled Category',
        type: 'Problem Category',
        createdAt: type.createdAt,
        isActive: true,
        statusLabel: 'Categorization',
        statusStyles: 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30',
        metricValue: type.problemCount || 0
    }));

    const handleCreate = async (data) => {
        try {
            await createProblemType(data);
            setIsModalOpen(false);
            reloadProblemTypes();
        } catch (err) {
            console.error("Failed to create problem type:", err);
        }
    };

    return (
        <>
            <CMSResourceTable 
                sectionName="Problem-Types" 
                items={tableItems} 
                columns={{ status: 'Taxonomy', metric: 'Problems' }}
                isLoading={isLoading} 
                icon={Box} 
                onRefresh={reloadProblemTypes}
                onDelete={deleteProblemType}
                serverPagination={true}
                serverPage={problemTypesPage}
                serverTotalPages={problemTypesTotalPages}
                serverTotalItems={problemTypesTotalItems}
                onPageChange={setProblemTypePage}
                onSearchChange={setProblemTypeSearch}
                onAdd={() => setIsModalOpen(true)}
                addLabel="Add Problem Type"
            />

            <CMSCreateCategorizationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
                modalHeader="Create Problem Category"
                isLoading={isCreating}
            />
        </>
    );
};

export default CMSProblemTypesPage;
