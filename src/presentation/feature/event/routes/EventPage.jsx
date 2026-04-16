import React, { useState, useEffect } from 'react';
import { EventCard } from '../components/EventCard';
import { EventFilters } from '../components/EventFilters';
import { useFetchRecommendedEventsForPage } from '@domain/useCase/useFetchRecommendedEventsForPage';
import { Loader2, AlertTriangle } from 'lucide-react';
import { EventCardSkeleton } from '@presentation/shared/components/skeletons/EventCardSkeleton';
import { PageLoader } from '@presentation/shared/components/loaders/PageLoader';

/**
 * EventPage: Core layout for exploring and registering for events.
 */
const EventPage = () => {
    const [filter, setFilter] = useState('all');
    const { fetchEvents, events, loading, error } = useFetchRecommendedEventsForPage();

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <React.Fragment>
            {/* Sidebar (3 cols) */}
            <aside className="md:col-span-3 flex flex-col gap-6 md:order-2">
                <EventFilters activeFilter={filter} onFilterChange={setFilter} />
            </aside>

            {/* Main Content (9 cols) - Responsive Grid */}
            <div className="md:col-span-9 md:order-1">
                {loading ? (
                    <div className="py-12">
                        <PageLoader />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-red-400">
                        <AlertTriangle size={20} />
                        <span className="text-sm font-mono">Failed to load events</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {events?.map((event, idx) => (
                            <EventCard key={event.uid || idx} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default EventPage;
