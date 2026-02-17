import React, { useState } from 'react';
import { EventCard } from '../components/EventCard';
import { EventFilters } from '../components/EventFilters';
import { EventEntity } from '@domain/entity/EventEntity';

/**
 * EventPage: Core layout for exploring and registering for events.
 */
const EventPage = () => {
    const [filter, setFilter] = useState('all');

    // Mock data for initial presentation
    const mockEvents = [
        new EventEntity({
            id: 1,
            title: "Future of Agentic Coding Workshop",
            type: "Workshop",
            startDate: new Date('2026-03-10'),
            endDate: new Date('2026-03-11'),
            location: "Virtual HQ",
            registeredCount: 420,
            price: 49
        }),
        new EventEntity({
            id: 2,
            title: "React 19 Security Masterclass",
            type: "Webinar",
            startDate: new Date(), // Current for Live badge
            location: "Discord Live",
            registeredCount: 1540,
            price: 0
        })
        ,
        new EventEntity({
            id: 3,
            title: "Global AI Ethics Summit",
            type: "Physical",
            startDate: new Date('2026-05-20'),
            location: "Cairo, Egypt",
            registeredCount: 85,
            price: 299
        })
        ,
        new EventEntity({
            id: 3,
            title: "Global AI Ethics Summit",
            type: "Physical",
            startDate: new Date('2026-05-20'),
            location: "Cairo, Egypt",
            registeredCount: 85,
            price: 299
        })
        ,
        new EventEntity({
            id: 3,
            title: "Global AI Ethics Summit",
            type: "Physical",
            startDate: new Date('2026-05-20'),
            location: "Cairo, Egypt",
            registeredCount: 85,
            price: 299
        })
        ,
        new EventEntity({
            id: 3,
            title: "Global AI Ethics Summit",
            type: "Physical",
            startDate: new Date('2026-05-20'),
            location: "Cairo, Egypt",
            registeredCount: 85,
            price: 299
        })
        ,
        new EventEntity({
            id: 3,
            title: "Global AI Ethics Summit",
            type: "Physical",
            startDate: new Date('2026-05-20'),
            location: "Cairo, Egypt",
            registeredCount: 85,
            price: 299
        })
    ];

    return (
        <React.Fragment>
            {/* Main Content (9 cols) - Responsive Grid */}
            <div className="md:col-span-9 order-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>

            {/* Sidebar (3 cols) */}
            <aside className="md:col-span-3 flex flex-col gap-6 order-2">
                <EventFilters activeFilter={filter} onFilterChange={setFilter} />
            </aside>
        </React.Fragment>
    );
};

export default EventPage;
