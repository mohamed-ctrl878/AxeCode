import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchEvent } from '@domain/useCase/useFetchEvent';
import { EventHero } from '../components/EventHero';
import { EventInfoSidebar } from '../components/EventInfoSidebar';
import { EventSchedule } from '../components/EventSchedule';
import { EventSpeakers } from '../components/EventSpeakers';
import { RichBlocksPreviewer } from '@presentation/shared/components/RichBlocksPreviewer';
import { InteractionBar } from '@presentation/shared/components/interactions/InteractionBar';
import { EventDetailsSkeleton } from '@presentation/shared/components/skeletons/EventDetailsSkeleton';

/**
 * EventDetailsPage - Main compositor for the single event view.
 * Composes Hero, Sidebar, Scheduler, Speakers, and Interactions.
 */
const EventDetailsPage = () => {
    const { id } = useParams();
    const { fetchEvent, event, loading, error } = useFetchEvent();

    useEffect(() => {
        if (id) {
            fetchEvent(id);
        }
    }, [id, fetchEvent]);

    if (loading) {
        return <EventDetailsSkeleton />;
    }

    if (error || !event) {
        return (
            <div className="bento-card p-8 border border-red-500/30 bg-red-500/5 rounded-[32px] text-center max-w-2xl mx-auto mt-12 animate-zoom-in">
                <h2 className="text-xl font-bold text-status-error mb-2">Failed to load Event</h2>
                <p className="text-sm text-text-muted">{error || "The event could not be found."}</p>
            </div>
        );
    }

    return (
        <div className="md:col-span-12 max-w-6xl mx-auto w-full flex flex-col gap-8 pb-24 px-4 sm:px-6 lg:px-8">
            {/* Top Layer: Event Hero */}
            <EventHero event={event} />

            {/* Content & Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Content Column */}
                <div className="lg:col-span-8 flex flex-col gap-12 order-2 lg:order-1">
                    
                    {/* Event Description (Rich Text) */}
                    {event.description && (
                        <div className="bento-card p-6 md:p-10 bg-surface border border-border-subtle rounded-3xl shadow-sm animate-slide-up">
                            <h3 className="text-2xl font-bold text-text-primary border-b border-border-subtle pb-4 mb-6">About This Event</h3>
                            <div className="prose prose-invert max-w-none">
                                <RichBlocksPreviewer content={event.description} />
                            </div>
                        </div>
                    )}

                    {/* Schedule / Agenda */}
                    <EventSchedule activities={event.activities} />

                    {/* Speakers Section */}
                    <EventSpeakers speakers={event.speakers} />

                    {/* Interaction Footer */}
                    <div className="bento-card p-6 bg-surface-dark border border-border-subtle rounded-3xl mt-8">
                        <InteractionBar 
                            docId={event.uid || event.id} 
                            contentType="event"
                            initialLikes={event.likesCount}
                            initialComments={event.commentsCount}
                            initialIsLiked={event.isLiked}
                            contentTitle={event.title}
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 order-1 lg:order-2">
                    <EventInfoSidebar event={event} />
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
