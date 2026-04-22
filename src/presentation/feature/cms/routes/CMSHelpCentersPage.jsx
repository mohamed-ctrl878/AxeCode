import React from 'react';
import { BookMarked } from 'lucide-react';
import { useFetchAdminHelpCenters } from '@domain/useCase/useFetchAdminHelpCenters';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSHelpCentersPage: Admin page for managing Help Center terms/content.
 */
const CMSHelpCentersPage = () => {
    const { 
        helpCenters, 
        isLoading, 
        fetch: reloadHelpCenters, 
        deleteHelpCenter,
        currentPage,
        totalPages,
        totalItems,
        setPage,
        setSearch
    } = useFetchAdminHelpCenters();

    const tableItems = helpCenters.map(hc => ({
        ...hc,
        title: `Help Document v${hc.id}`,
        type: 'Help Document',
        createdAt: hc.createdAt,
        publishedAt: hc.publishedAt,
        metricValue: 'Static' // No engagement metrics for static documents
    }));

    return (
        <CMSResourceTable 
            sectionName="Help-Centers" 
            items={tableItems} 
            columns={{ status: 'Shelf Status', metric: 'Activity' }}
            isLoading={isLoading} 
            icon={BookMarked} 
            onRefresh={reloadHelpCenters}
            onDelete={deleteHelpCenter}
            serverPagination={true}
            serverPage={currentPage}
            serverTotalPages={totalPages}
            serverTotalItems={totalItems}
            onPageChange={setPage}
            onSearchChange={setSearch}
        />
    );
};

export default CMSHelpCentersPage;
