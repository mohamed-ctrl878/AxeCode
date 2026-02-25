import React, { useState, useEffect } from 'react';
import { EventCard } from '../components/EventCard';
import { EventFilters } from '../components/EventFilters';
import { useFetchRecommendedEventsForPage } from '@domain/useCase/useFetchRecommendedEventsForPage';
import { Loader2, AlertTriangle } from 'lucide-react';

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
            {/* Main Content (9 cols) - Responsive Grid */}
            <div className="md:col-span-9 order-1">
                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
                        <Loader2 size={20} className="animate-spin text-accent-primary" />
                        <span className="text-sm font-mono">Loading events...</span>
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

            {/* Sidebar (3 cols) */}
            <aside className="md:col-span-3 flex flex-col gap-6 order-2">
                <EventFilters activeFilter={filter} onFilterChange={setFilter} />
            </aside>
        </React.Fragment>
    );
};

export default EventPage;
