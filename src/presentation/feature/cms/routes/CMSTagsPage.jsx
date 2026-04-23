import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { useFetchAdminTags } from '@domain/useCase/useFetchAdminTags';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSTagsPage: Admin page for managing Global Tags.
 * Follows SRP: Delegates data fetching to domain layer, UI to CMSResourceTable.
 */
const CMSTagsPage = () => {
    const { 
        tags, 
        isLoading, 
        fetch: reloadTags, 
        deleteTag,
        currentPage,
        totalPages,
        totalItems,
        setPage,
        setSearch
    } = useFetchAdminTags();

    // Map Strapi tag DTO to CMSResourceTable format
    const tableItems = tags.map(tag => ({
        ...tag,
        title: tag.name,
        type: 'System Tag',
        createdAt: tag.createdAt,
        isActive: true,
        statusLabel: 'Global Tag',
        statusStyles: 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30',
        metricValue: tag.count || 0
    }));

    return (
        <CMSResourceTable 
            sectionName="Global-Tags" 
            items={tableItems} 
            columns={{ status: 'Taxonomy', metric: 'Usage Count' }}
            isLoading={isLoading} 
            icon={Tag} 
            onRefresh={reloadTags}
            onDelete={deleteTag}
            serverPagination={true}
            serverPage={currentPage}
            serverTotalPages={totalPages}
            serverTotalItems={totalItems}
            onPageChange={setPage}
            onSearchChange={setSearch}
        />
    );
};

export default CMSTagsPage;
