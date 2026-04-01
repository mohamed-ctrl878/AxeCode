import React from 'react';
import { Calendar } from 'lucide-react';
import { useFetchAdminEvents } from '@domain/useCase/useFetchAdminEvents';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSEventsPage - Isolated CMS module for managing Events.
 * Follows SRP: Only fetches and displays event data.
 */
const CMSEventsPage = () => {
    const { events, isLoading, fetch: fetchEvents } = useFetchAdminEvents();

    return (
        <CMSResourceTable
            sectionName="Events"
            items={events || []}
            isLoading={isLoading}
            icon={Calendar}
            onRefresh={fetchEvents}
        />
    );
};

export default CMSEventsPage;
