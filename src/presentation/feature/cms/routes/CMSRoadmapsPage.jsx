import React from 'react';
import { Map } from 'lucide-react';
import { useFetchAdminRoadmaps } from '@domain/useCase/useFetchAdminRoadmaps';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSRoadmapsPage - Isolated CMS module for managing Roadmaps.
 * Follows SRP: Only fetches and displays roadmap data into the CMSResourceTable.
 */
const CMSRoadmapsPage = () => {
    const { 
        roadmaps, 
        isLoading, 
        fetch: fetchRoadmaps,
        currentPage,
        totalPages,
        totalItems,
        setPage,
        setSearch 
    } = useFetchAdminRoadmaps();

    return (
        <CMSResourceTable
            sectionName="Roadmaps"
            items={roadmaps || []}
            isLoading={isLoading}
            icon={Map}
            onRefresh={fetchRoadmaps}
            serverPagination={true}
            serverPage={currentPage}
            serverTotalPages={totalPages}
            serverTotalItems={totalItems}
            onPageChange={setPage}
            onSearchChange={setSearch}
            addLabel="Chart New Roadmap"
        />
    );
};

export default CMSRoadmapsPage;
