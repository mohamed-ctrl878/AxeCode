import React from 'react';
import { Box } from 'lucide-react';
import { useFetchAdminCategorizations } from '@domain/useCase/useFetchAdminCategorizations';
import { CMSResourceTable } from '../components/CMSResourceTable';

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

    return (
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
        />
    );
};

export default CMSProblemTypesPage;
