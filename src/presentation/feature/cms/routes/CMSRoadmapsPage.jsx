import React from 'react';
import { Map } from 'lucide-react';
import { useFetchRoadmaps } from '@domain/useCase/useFetchRoadmaps';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSRoadmapsPage - Isolated CMS module for managing Roadmaps.
 * Follows SRP: Only fetches and displays roadmap data into the CMSResourceTable.
 */
const CMSRoadmapsPage = () => {
    // using the existing hook that fetches roadmaps
    const { roadmaps, isLoading, fetchRoadmaps } = useFetchRoadmaps();

    React.useEffect(() => {
        fetchRoadmaps();
    }, [fetchRoadmaps]);

    return (
        <CMSResourceTable
            sectionName="Roadmaps"
            items={roadmaps || []}
            isLoading={isLoading}
            icon={Map}
            onRefresh={fetchRoadmaps}
        />
    );
};

export default CMSRoadmapsPage;
